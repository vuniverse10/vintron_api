import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { CreatePersonalTrainingServiceDto } from "./dto/create-personal-training.service.dto";
import { CreateFitnessLevelDto } from "./dto/create-fitness-level.dto";
import { CreateBodyFocusAreaDto } from "./dto/create-body-focus-area.dto";
import { CreateWorkoutPreferDto } from "./dto/create-workout-prefer.dto";
import { CreateWorkoutTimingDto } from "./dto/create-workout-timing.dto";
import { CreateWorkoutPlanWeekDto } from "./dto/create-workout-plan-week.dto";
import { CreateWorkoutDurationDto } from "./dto/create-workout-duration.dto";
import { Workout } from "../excel-import/workout.schema";
import { WorkoutPlanObjectiveService } from "./services/personal-objectives.service";

@Controller("workouts")
export class WorkoutController {
  constructor(
    private readonly workoutService: WorkoutService,
    private readonly WorkoutPlanObjectiveService: WorkoutPlanObjectiveService
  ) {}

  @Post("age-calculator")
  ageCalculator(@Body() body: { dob: string }) {
    const dob = new Date(body.dob);
    const age = this.calculateAge(dob);
    return age;
  }

  @Post("fetch-categories")
  fetchFitnessLevelCategories(@Body() body: { fitnessLevel: string }) {
    console.log(body);
    return this.workoutService.fitnessLevelBasedCategories(body.fitnessLevel);
  }

  @Get("workouts-unique-equipments")
  workoutsUniqueEquipments() {
    return this.workoutService.fetchWorkoutsUniqueEquipments();
  }

  @Post("workout-equipments")
  workoutEquipments(@Body() body: { fitnessLevel: string; category: string }) {
    const payloadRequest = {
      category: body.fitnessLevel,
      fitnessLevel: body.fitnessLevel,
    };
    return this.workoutService.filterWorkoutEquipments(payloadRequest);
  }

  @Get("search-workouts")
  async getWorkouts(@Query() filters: any): Promise<Workout[]> {
    return this.workoutService.searchWorkOuts(filters);
  }

  private calculateAge(dob: Date): { age: string | number; dob: Date } {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (
      month < dob.getMonth() ||
      (month === dob.getMonth() && day < dob.getDate())
    ) {
      age--;
    }

    return {
      age: Number(age),
      dob: dob,
    };
  }

  @Get("workouts-sections")
  async fetchWorkoutSections(): Promise<any> {
    return this.workoutService.fetchAllWorkoutSections();
  }

  @Post("user-suggested-categories")
  userSuggestedWorkoutCategories(@Body() body) {
    return this.workoutService.userSuggestibleWorkoutCategories(body);
  }

  @Post("category-based-unique-exercises")
  categoryBasedUniqueExercises(@Body() body) {
    return this.workoutService.categoryBasedUniqueExerciseList(body);
  }

  @Post("category-based-exercises")
  categoryBasedExercises(@Body() body) {
    return this.workoutService.categoryBasedExerciseList(body);
  }

  @Get("fetch-all-workouts")
  async fetchAllWorkouts(): Promise<any> {
    return this.workoutService.fetchAllWorkouts();
  }

  @Get("reps-list")
  async repsList(): Promise<{
    code: number;
    message: string;
    data: { _id: string; title: string; value: number }[];
  }> {
    try {
      const reps = Array.from({ length: 100 }, (_, i) => {
        const value = i + 1;
        return {
          _id: `${value}_${value}`,
          title: `${value} Reps`,
          value: value,
        };
      });

      return {
        code: 200,
        message: "Repetitions list generated successfully",
        data: reps,
      };
    } catch (error) {
      console.error(error);
      return {
        code: 204,
        message: "Failed to generate repetitions list",
        data: [],
      };
    }
  }

  @Get("weights-list")
  async weightsList(): Promise<{
    code: number;
    message: string;
    data: { _id: string; title: string; value: number }[];
  }> {
    try {
      const reps = Array.from({ length: 100 }, (_, i) => {
        const value = i + 1;
        return {
          _id: `${value}_${value}`,
          title: `${value} Kg`,
          value: value,
        };
      });

      return {
        code: 200,
        message: "Weights list  successfully",
        data: reps,
      };
    } catch (error) {
      console.error(error);
      return {
        code: 204,
        message: "Failed to  weights list",
        data: [],
      };
    }
  }

  @Post("special-workout")
  specialWorkout(@Body() body) {
    return this.workoutService.specialWorkoutData(body);
  }

  @Post("special-workout-data")
  specialWorkoutInfo(@Body() body) {
    return this.workoutService.specialWorkoutExercisesData(body);
  }

  @Post("bulk-insert-personal-objectives")
  async bulkInsertPersonalObjectives(
    @Body()
    inputReq: {
      focus_area: string;
      beginner: string;
      intermediate: string;
      advanced: string;
      elite: string;
    }[]
  ): Promise<any> {
    return this.WorkoutPlanObjectiveService.bulkCreate(inputReq);
  }
}
