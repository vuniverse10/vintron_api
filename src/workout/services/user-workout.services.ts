import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserWorkout } from "../schemas/user-workout.schema";
import { UserWorkoutDTO } from "../dto/create-user-workout.dto";
import { WorkoutPlanObjectiveService } from "./personal-objectives.service";
import { UserWorkoutWeeklyPlanService } from "./user-workouts/user-workout-weekly-plan-exercises.services";
@Injectable()
export class UserWorkoutService {
  constructor(
    @InjectModel("UserWorkout")
    private readonly userWorkoutModel: Model<UserWorkout>,
    private readonly workoutPlanObjectiveService: WorkoutPlanObjectiveService,
    private readonly userWorkoutWeeklyPlanService: UserWorkoutWeeklyPlanService
  ) {}

  async create(UserWorkoutDTO: UserWorkoutDTO): Promise<UserWorkout> {
    const makeRequest = new this.userWorkoutModel(UserWorkoutDTO);
    makeRequest.save();
    /* Weekly Plan Related Section Start >>*/

    await this.userWorkoutWeeklyPlanService.createWorkoutWeeklyPlan(
      makeRequest
    );
    /*<< Weekly Plan Related Section Edn*/
    return makeRequest;
  }

  async findAll(): Promise<UserWorkout[]> {
    return this.userWorkoutModel.find().exec();
  }

  async findOne(id: string): Promise<any> {
    try {
      const userWorkoutResponse = await this.userWorkoutModel
        .findById(id)
        .exec();
      let planObjectiveData;
      if (userWorkoutResponse) {
        planObjectiveData =
          await this.workoutPlanObjectiveService.filterPersonalObjectives({
            focusArea: userWorkoutResponse.bodyAreaToFocus,
            fitnessLevel: userWorkoutResponse.fitnessLevel,
          });
      }
      return {
        code: 200,
        message: "Fetching Workout details",
        data: {
          userWorkout: userWorkoutResponse,
          planObjectives: planObjectiveData,
        },
      };
    } catch (error) {
      console.error("Error fetching workout details:", error);
      return {
        code: 500,
        message: "Failed to fetch workout details",
        data: null,
      };
    }
  }

  async update(
    id: string,
    UserWorkoutDTO: UserWorkoutDTO
  ): Promise<UserWorkout> {
    return this.userWorkoutModel
      .findByIdAndUpdate(id, UserWorkoutDTO, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.userWorkoutModel.findByIdAndDelete(id).exec();
  }
}
