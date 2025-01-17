import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserWorkout } from "../schemas/user-workout.schema";
import { UserWorkoutDTO } from "../dto/create-user-workout.dto";

@Injectable()
export class UserWorkoutService {
  constructor(
    @InjectModel("UserWorkout")
    private readonly userWorkoutModel: Model<UserWorkout>
  ) {}

  async create(UserWorkoutDTO: UserWorkoutDTO): Promise<UserWorkout> {
    const makeRequest = new this.userWorkoutModel(UserWorkoutDTO);
    return makeRequest.save();
  }

  async findAll(): Promise<UserWorkout[]> {
    return this.userWorkoutModel.find().exec();
  }

  async findOne(id: string): Promise<any> {
    try {
      const userWorkoutResponse = await this.userWorkoutModel
        .findById(id)
        .exec();

      const planObjectives = [
        {
          _id: "1",
          title: "Increase upper body strength and endurance.",
          icon: "💪",
        },
        {
          _id: "2",
          title:
            "Improve muscle definition and tone in the chest, shoulders, and arms.",
          icon: "🏋️‍♂️",
        },
        {
          _id: "3",
          title:
            "Enhance functional performance for daily activities requiring upper body movement.",
          icon: "🤹",
        },
        {
          _id: "4",
          title:
            "Boost posture and stability through strengthening the back and core muscles.",
          icon: "🧘‍♂️",
        },
        {
          _id: "5",
          title: "Develop balanced muscle groups to reduce the risk of injury.",
          icon: "⚖️",
        },
      ];

      return {
        code: 200,
        message: "Fetching Workout details",
        data: {
          userWorkout: userWorkoutResponse,
          planObjectives: planObjectives,
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
