import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Types } from "mongoose";
import { UserWorkoutWeeklyPlan } from "../../schemas/user-workouts/user-workout-weekly-plan.schema";
import { ServiceResponse } from "@common/service-response";
import { WorkoutService } from "src/workout/workout.service";

@Injectable()
export class UserWorkoutWeeklyPlanService {
  constructor(
    @InjectModel("UserWorkoutWeeklyPlan")
    private readonly userWorkoutWeeklyPlanModel: Model<UserWorkoutWeeklyPlan>,
    private readonly serviceResponse: ServiceResponse,
    private readonly workoutService: WorkoutService
  ) {}

  async createWorkoutWeeklyPlan(data: any): Promise<any> {
    const {
      weeklyPlan,
      userID,
      _id,
      bodyAreaToFocus,
      preferableToTrain,
      duration,
    } = data;

    try {
      const currentDate = new Date();
      const dayToIndex = {
        SUN: 0,
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
      };
      const planBulkData = [];

      const objectId = new Types.ObjectId(_id);
      const userWorkoutReferenceID = objectId.toString();
      weeklyPlan.map((day) => {
        const dayIndex = dayToIndex[day];
        const diff = (dayIndex - currentDate.getDay() + 7) % 7; // Calculate the next occurrence of the day
        const planDate = new Date();
        planDate.setDate(currentDate.getDate() + diff);

        const PlanObject = {
          userID: userID,
          userWorkoutReferenceKey: userWorkoutReferenceID,
          WeekDay: day,
          WeekDate: planDate.toISOString().split("T")[0],
          bodyAreaToFocus: bodyAreaToFocus,
          preferableToTrainingAt: preferableToTrain,
          exerciseDuration: duration.label,
        };

        planBulkData.push(PlanObject);
      });
      console.log(planBulkData);
      try {
        const weekPlanStatus =
          await this.userWorkoutWeeklyPlanModel.insertMany(planBulkData);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
      throw new Error("Failed to create workout plan");
    }
  }

  async fetchWorkoutWeeklyPlan(filters: any): Promise<any> {
    try {
      console.log(filters);
      const { userID, userWorkoutReferenceKey } = filters;
      /* const workouts = await this.userWorkoutWeeklyPlanModel
        .find({
          userWorkoutReferenceKey: userWorkoutReferenceKey,
        })
        .exec();
      return this.serviceResponse.apiResponse(workouts, "workoutWeekly");*/

      const weeklyWorkouts = await this.userWorkoutWeeklyPlanModel
        .find({
          userWorkoutReferenceKey: userWorkoutReferenceKey,
        })
        .lean();

      const weeklyWorkoutsWithExercises = weeklyWorkouts.map((workout) => {
        return {
          ...workout,
          exercises: this.workoutService.userWeeklyPlanWorkouts(),
        };
      });
      return {
        code: 200,
        message: "Fetching weekly workouts with exercises",
        data: weeklyWorkoutsWithExercises,
      };
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      throw new Error("Failed to fetch workout plan");
    }
  }
}
