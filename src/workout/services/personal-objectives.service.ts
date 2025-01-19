import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WorkoutPlanObjective } from "../schemas/workout-plan-objectives.schema";

import { ServiceResponse } from "@common/service-response";

@Injectable()
export class WorkoutPlanObjectiveService {
  constructor(
    @InjectModel("WorkoutPlanObjective")
    private readonly WorkoutPlanObjectiveModel: Model<WorkoutPlanObjective>,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async bulkCreate(
    psObjectives: {
      focus_area: string;
      beginner: string;
      intermediate: string;
      advanced: string;
      elite: string;
    }[]
  ): Promise<any> {
    const formattedHeights = psObjectives.map((res) => ({
      focus_area: res.focus_area,
      beginner: res.beginner,
      intermediate: res.intermediate,
      advanced: res.advanced,
      elite: res.elite,
    }));

    return await this.WorkoutPlanObjectiveModel.insertMany(formattedHeights);
  }

  async filterPersonalObjectives(filters: any): Promise<any> {
    const { focusArea, fitnessLevel } = filters;

    const query: any = {};

    if (focusArea) {
      query.focus_area = focusArea;
    }

    const result = await this.WorkoutPlanObjectiveModel.findOne(query);

    if (result) {
      let returnString;
      if (fitnessLevel == "Beginner") {
        returnString = result.beginner;
      } else {
        returnString = result.beginner;
      }
      return returnString;
    } else {
      return null;
    }
  }
}
