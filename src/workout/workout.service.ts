// src/workout/workout.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Workout } from "../excel-import/workout.schema";
import { Model } from "mongoose";
import { Height } from "./schemas/height.schema";

import { PersonalTrainingService } from "./services/personalTraining.service";
import { FitnessLevelService } from "./services/fitness-level.service";
import { BodyFocusAreaService } from "./services/body-focus-area.service";
import { WorkoutPreferService } from "./services/workout-prefer.service";
import { WorkoutsPreferTimingsService } from "./services/workouts-prefer-timings.service";
import { workoutPlanWeekService } from "./services/workoutPlanWeek.service";
import { WorkoutPlanDurationService } from "./services/workout-plan-duration.service";
import { ServiceResponse } from "@common/service-response";
@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel("Workout") private readonly workoutModel: Model<Workout>,
    @InjectModel("Height") private readonly heightModel: Model<Height>,
    private readonly personalTrainingService: PersonalTrainingService,
    private readonly fitnessLevelService: FitnessLevelService,
    private readonly bodyFocusAreaService: BodyFocusAreaService,
    private readonly workoutPreferService: WorkoutPreferService,
    private readonly workoutsPreferTimingsService: WorkoutsPreferTimingsService,
    private readonly workoutPlanWeekService: workoutPlanWeekService,
    private readonly workoutPlanDurationService: WorkoutPlanDurationService,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async searchWorkOuts(filters: any): Promise<Workout[]> {
    try {
      const query: any = {};

      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== "") {
          query[key] = new RegExp(filters[key], "i");
        }
      }

      const workouts = await this.workoutModel.find(query).exec();

      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw new Error("Failed to fetch workout data");
    }
  }

  async categoryBasedUniqueExerciseList(filters: any): Promise<any[]> {
    try {
      const { fitnessLevel, bodyAreaToFocus, category } = filters;

      const aggregationPipeline = [
        {
          $match: {
            ...(fitnessLevel
              ? { workout_level: new RegExp(fitnessLevel, "i") }
              : {}),
            /*  ...(bodyAreaToFocus
              ? { keywords: new RegExp(bodyAreaToFocus, 'i') }
              : {}),
              */
            ...(category ? { category: new RegExp(category, "i") } : {}),
          },
        },

        {
          $group: {
            _id: "$equipment",
            sets: { $addToSet: "$sets" }, // Collect unique sets
            reps: { $addToSet: "$reps" }, // Collect unique reps
          },
        },
        {
          $project: {
            _id: 0,
            equipment: "$_id",
            sets: {
              $reduce: {
                input: {
                  $map: {
                    input: "$sets",
                    as: "set",
                    in: { $toString: "$$set" },
                  },
                },
                initialValue: "",
                in: {
                  $concat: [
                    "$$value",
                    { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
                    "$$this",
                  ],
                },
              },
            },
            reps: {
              $reduce: {
                input: {
                  $map: {
                    input: "$reps",
                    as: "rep",
                    in: { $toString: "$$rep" },
                  },
                },
                initialValue: "",
                in: {
                  $concat: [
                    "$$value",
                    { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
                    "$$this",
                  ],
                },
              },
            },
            videoURL: { $literal: "https://dummyvideourl.com/sample.mp4" },
          },
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw new Error("Failed to fetch workout data");
    }
  }

  async userSuggestibleWorkoutCategories(filters: any): Promise<Workout[]> {
    try {
      const { fitnessLevel, bodyAreaToFocus } = filters;

      const aggregationPipeline = [
        {
          $addFields: {
            set_break_seconds: {
              $cond: [
                { $regexMatch: { input: "$set_break", regex: /^[0-9]+ sec$/ } },
                {
                  $toInt: {
                    $arrayElemAt: [{ $split: ["$set_break", " "] }, 0],
                  },
                },
                0, // Default to 0 if `set_break` is invalid
              ],
            },
          },
        },
        /* ...(bodyAreaToFocus
          ? [
              {
                $match: {
                  keywords: new RegExp(bodyAreaToFocus, 'i'),
                },
              },
            ]
          : []),
            */
        ...(fitnessLevel
          ? [
              {
                $match: {
                  workout_level: new RegExp(fitnessLevel, "i"),
                },
              },
            ]
          : []),

        {
          $group: {
            _id: "$category",
            total_set_break_seconds: { $sum: "$set_break_seconds" },
          },
        },

        {
          $project: {
            _id: 0,
            category: "$_id",
            total_set_break: {
              seconds: "$total_set_break_seconds",
              minutes: { $divide: ["$total_set_break_seconds", 60] },
              hours: { $divide: ["$total_set_break_seconds", 3600] },
            },
          },
        },
      ];

      const results = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return results;
    } catch (error) {
      console.error(
        "Error fetching unique categories with set break sum:",
        error
      );
      throw new Error("Failed to fetch unique categories with set break sum");
    }
  }

  async fetchAllWorkoutSections(): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    try {
      const personalTrainingData =
        await this.personalTrainingService.fetchPersonalTrainingList();
      const fitnessLevelData =
        await this.fitnessLevelService.fetchFitnessLevelList();
      const bodyFocusAreaData =
        await this.bodyFocusAreaService.fetchBodyFocusAreaList();

      const workoutPreferData =
        await this.workoutPreferService.fetchWorkoutPreferList();

      const workoutPreferTimingData =
        await this.workoutsPreferTimingsService.fetchWorkoutPreferTimings();

      const workoutPlanWeekData =
        await this.workoutPlanWeekService.fetchWorkoutPlanWeekList();

      const workoutPlanDurationsData =
        await this.workoutPlanDurationService.fetchWorkPlanDuration();

      const responseData = {
        personal_training_services: personalTrainingData,
        fitness_levels: fitnessLevelData,
        body_focus_area_list: bodyFocusAreaData,
        workouts_prefer: workoutPreferData,
        workouts_prefer_timings: workoutPreferTimingData,
        workout_plan_weeks: workoutPlanWeekData,
        workout_plan_duration: workoutPlanDurationsData,
      };

      return this.serviceResponse.workoutPreferenceResponse<any>(
        responseData,
        "Workout Sections"
      );
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Workout Sections");
    }
  }

  async categoryBasedExerciseList(filters: any): Promise<any[]> {
    try {
      const { fitnessLevel, bodyAreaToFocus, category } = filters;

      const aggregationPipeline = [
        {
          $match: {
            ...(fitnessLevel
              ? { workout_level: new RegExp(fitnessLevel, "i") }
              : {}),
            /*  ...(bodyAreaToFocus
              ? { keywords: new RegExp(bodyAreaToFocus, 'i') }
              : {}),
              */
            ...(category ? { category: new RegExp(category, "i") } : {}),
          },
        },
        {
          $project: {
            video_exercise_title: 1,
            short_description: 1,
            category: 1,
            keywords: 1,
            reps: 1,
            reps_break: 1,
            sets: 1,
            weights: 1,
            set_break: 1,
            equipment: 1,
            workout_level: 1,
            videoURL: { $literal: "https://dummyvideourl.com/sample.mp4" },
          },
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw new Error("Failed to fetch workout data");
    }
  }

  async fetchAllWorkouts() {
    const workouts = await this.workoutModel.find().exec();
    return workouts;
  }

  async fitnessLevelBasedCategories(fitnessLevel: string): Promise<{
    code: number;
    message: string;
    data: { category: string }[];
  }> {
    try {
      let searchFitnessLevel: string;
      switch (fitnessLevel.toLowerCase()) {
        case "intermediate":
          searchFitnessLevel = "intermediate";
          break;
        case "beginner":
          searchFitnessLevel = "beginner";
          break;
        case "advanced":
          searchFitnessLevel = "advanced";
          break;
        case "elite":
          searchFitnessLevel = "elite";
          break;
        default:
          searchFitnessLevel = "";
      }

      const aggregationPipeline = [
        {
          $match: {
            ...(searchFitnessLevel
              ? { workout_level: new RegExp(searchFitnessLevel, "i") }
              : {}),
          },
        },
        {
          $group: {
            _id: "$category",
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
          },
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return this.serviceResponse.apiResponse<{ category: string }[]>(
        workouts,
        "Workout Categories"
      );
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Workout Categories");
    }
  }

  async fetchWorkoutsUniqueEquipments(): Promise<{
    code: number;
    message: string;
    data: { equipment: string }[];
  }> {
    try {
      const aggregationPipeline = [
        {
          $group: {
            _id: "$equipment",
          },
        },
        {
          $project: {
            _id: 0,
            equipment: "$_id",
          },
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return this.serviceResponse.apiResponse<{ equipment: string }[]>(
        workouts,
        "Workout Equipments"
      );
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Workout Equipments");
    }
  }

  async filterWorkoutEquipments(filters: {
    fitnessLevel: string;
    category: string;
  }): Promise<{
    code: number;
    message: string;
    data: { equipment: string }[];
  }> {
    try {
      let searchFitnessLevel: string;
      switch (filters.fitnessLevel.toLowerCase()) {
        case "intermediate":
          searchFitnessLevel = "intermediate";
          break;
        case "beginner":
          searchFitnessLevel = "beginner";
          break;
        case "advanced":
          searchFitnessLevel = "advanced";
          break;
        case "elite":
          searchFitnessLevel = "elite";
          break;
        default:
          searchFitnessLevel = "";
      }

      const aggregationPipeline = [
        {
          $match: {
            ...(searchFitnessLevel
              ? { workout_level: new RegExp(searchFitnessLevel, "i") }
              : {}),
          },
        },
        {
          $group: {
            _id: "$equipment",
          },
        },
        {
          $project: {
            _id: 0,
            equipment: "$_id",
            thumbnail: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
            },
          },
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return this.serviceResponse.apiResponse<{ equipment: string }[]>(
        workouts,
        "Workout Exercises"
      );
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Workout Exercises");
    }
  }

  async specialWorkoutData(filters: any): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    try {
      const { fitnessLevel, bodyAreaToFocus, category } = filters;

      const aggregationPipeline = [
        {
          $project: {
            video_exercise_title: 1,
            videoURL: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/yoga/videos/1736404189198-01%20Samasthithi.mp4",
            },
            thumbnail: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
            },
          },
        },
        {
          $limit: 10,
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      const returnResponse = {
        timeSlot: "30 Mins",
        keywords: ["Back, chest,Core", "Arms"],
        videoList: workouts,
      };

      return {
        code: 200,
        message: "Fetching Special workout information",
        data: returnResponse,
      };
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw new Error("Failed to fetch workout data");
    }
  }

  async specialWorkoutExercisesData(filters: any): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    try {
      const { fitnessLevel, bodyAreaToFocus, category } = filters;

      const aggregationPipeline = [
        {
          $project: {
            video_exercise_title: 1,
            short_description: 1,
            category: 1,
            keywords: 1,
            reps: 1,
            reps_break: 1,
            sets: 1,
            weights: 1,
            set_break: 1,
            equipment: 1,
            workout_level: 1,
            videoURL: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/yoga/videos/1736404189198-01%20Samasthithi.mp4",
            },
            thumbnail: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
            },
          },
        },
        {
          $limit: 10,
        },
      ];

      const exercisesData = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      let warmupData;
      let warmupTime;
      let coolDownData;
      let coolDownTime;

      const equipementSevice = await this.filterWorkoutEquipments(filters);
      const warmupApiRequest = await this.warmupExerciseList(filters);
      if (warmupApiRequest && warmupApiRequest.length > 0) {
        warmupData = warmupApiRequest;
        warmupTime = "5 Mins";
      } else {
        warmupData = [];
        warmupTime = "0 Mins";
      }
      const coolDownApiRequest = await this.coolDownExerciseList(filters);

      if (coolDownApiRequest && coolDownApiRequest.length > 0) {
        coolDownData = coolDownApiRequest;
        coolDownTime = "5 Mins";
      } else {
        coolDownData = [];
        coolDownTime = "0 Mins";
      }

      const returnResponse = {
        timeSlot: "30 Mins",
        title: "Upper Body",
        equipments: equipementSevice.data,
        exercises: exercisesData,
        warmup: warmupData,
        warmupTime: warmupTime,
        coolDown: coolDownData,
        coolDownTime: coolDownTime,
      };

      return {
        code: 200,
        message: "Fetching Special workout information",
        data: returnResponse,
      };
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw new Error("Failed to fetch workout data");
    }
  }

  async warmupExerciseList(filters: {
    fitnessLevel: string;
    category: string;
  }): Promise<any> {
    try {
      let searchFitnessLevel: string;
      switch (filters.fitnessLevel.toLowerCase()) {
        case "intermediate":
          searchFitnessLevel = "intermediate";
          break;
        case "beginner":
          searchFitnessLevel = "beginner";
          break;
        case "advanced":
          searchFitnessLevel = "advanced";
          break;
        case "elite":
          searchFitnessLevel = "elite";
          break;
        default:
          searchFitnessLevel = "";
      }

      const aggregationPipeline = [
        {
          $match: {
            ...(searchFitnessLevel
              ? { workout_level: new RegExp(searchFitnessLevel, "i") }
              : {}),
            category: new RegExp("Warmups", "i"),
          },
        },
        {
          $project: {
            video_exercise_title: 1,
            short_description: 1,
            category: 1,
            keywords: 1,
            reps: 1,
            reps_break: 1,
            sets: 1,
            weights: 1,
            set_break: 1,
            equipment: 1,
            workout_level: 1,
            videoURL: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/yoga/videos/1736404189198-01%20Samasthithi.mp4",
            },
            thumbnail: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
            },
          },
        },
        {
          $limit: 5,
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();
      console.log("Warmup ", workouts);
      return workouts;
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Warmup Exercises");
    }
  }

  async coolDownExerciseList(filters: {
    fitnessLevel: string;
    category: string;
  }): Promise<any> {
    try {
      let searchFitnessLevel: string;
      switch (filters.fitnessLevel.toLowerCase()) {
        case "intermediate":
          searchFitnessLevel = "intermediate";
          break;
        case "beginner":
          searchFitnessLevel = "beginner";
          break;
        case "advanced":
          searchFitnessLevel = "advanced";
          break;
        case "elite":
          searchFitnessLevel = "elite";
          break;
        default:
          searchFitnessLevel = "";
      }

      const aggregationPipeline = [
        {
          $match: {
            ...(searchFitnessLevel
              ? { workout_level: new RegExp(searchFitnessLevel, "i") }
              : {}),
            category: new RegExp("Stretching", "i"),
          },
        },
        {
          $project: {
            video_exercise_title: 1,
            short_description: 1,
            category: 1,
            keywords: 1,
            reps: 1,
            reps_break: 1,
            sets: 1,
            weights: 1,
            set_break: 1,
            equipment: 1,
            workout_level: 1,
            videoURL: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/yoga/videos/1736404189198-01%20Samasthithi.mp4",
            },
            thumbnail: {
              $literal:
                "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
            },
          },
        },
        {
          $limit: 5,
        },
      ];

      const workouts = await this.workoutModel
        .aggregate(aggregationPipeline)
        .exec();

      return workouts;
    } catch (error) {
      console.log(error);
      return this.serviceResponse.errorResponse("Cool Down Exercises");
    }
  }

  async userWeeklyPlanWorkouts(): Promise<any> {
    const aggregationPipeline = [
      {
        $project: {
          video_exercise_title: 1,
          videoURL: {
            $literal:
              "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/yoga/videos/1736404189198-01%20Samasthithi.mp4",
          },
          thumbnail: {
            $literal:
              "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
          },
        },
      },
      {
        $limit: 1,
      },
    ];

    const workouts = await this.workoutModel
      .aggregate(aggregationPipeline)
      .exec();
    return workouts;
  }
}
