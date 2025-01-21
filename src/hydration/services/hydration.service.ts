import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WaterIntakeRemainder } from "../schema/waterIntakeRemainder.schema";
import { WaterIntakeRemainderDto } from "../dto/waterIntakeRemainder.dto";
import { ServiceResponse } from "@common/service-response";

import { UserWaterHistoryDto } from "../dto/userWaterHistory.dto";
import { UserWaterHistory } from "../schema/userWaterHistory.schema";
@Injectable()
export class HydrationService {
  constructor(
    @InjectModel("WaterIntakeRemainder")
    private readonly waterIntakeRemainderModel: Model<WaterIntakeRemainder>,
    @InjectModel("UserWaterHistory")
    private readonly userWaterHistoryModel: Model<UserWaterHistory>
  ) {}

  async waterIntakeSuggestions(inputData): Promise<any> {
    try {
      const { weight } = inputData;
      if (!weight || isNaN(weight) || weight <= 0) {
        return {
          code: 400,
          message:
            "Invalid weight. Please provide a valid weight in kilograms.",
          data: null,
        };
      }
      const waterIntake = weight * 0.033 * 1000;
      const recemendedWaterIntake = Math.round(waterIntake);
      return {
        code: 200,
        message: "Water intake calculated successfully",
        data: {
          weight_kg: Number(weight),
          height_cm: null,
          gender: null,
          age: null,
          activity_level: null,
          recommended_water_intake_ml: `${recemendedWaterIntake} ML`,
          recommended_water_intake_liter: `${recemendedWaterIntake / 1000} Liters`,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async saveUserWaterRemainder(
    waterRemainderData: WaterIntakeRemainderDto
  ): Promise<any> {
    const { userID, waterGoal, waterRemainder } = waterRemainderData;
    try {
      const existingReminder = await this.waterIntakeRemainderModel.findOne({
        userID,
      });
      if (existingReminder) {
        existingReminder.waterGoal = waterGoal;
        existingReminder.waterRemainder = waterRemainder;
        const updateResult = await existingReminder.save();

        if (updateResult) {
          return {
            code: 200,
            message: `Goal & Remainder setup successfully`,
            data: updateResult,
          };
        } else {
          return {
            code: 500,
            message: "Error updating goal & remainder",
            data: null,
          };
        }
      } else {
        const payLoadRequest = {
          userID: userID,
          waterGoal: waterGoal,
          waterRemainder: waterRemainder,
        };
        const makeQueryRequest = new this.waterIntakeRemainderModel(
          payLoadRequest
        );
        const insertRow = await makeQueryRequest.save();
        return {
          code: 200,
          message: `Goal & Remainder setup successfully`,
          data: insertRow,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async saveWaterIntake(inputRequest): Promise<any> {
    const { userID, waterIntake, createdDate } = inputRequest;
    try {
      const payLoadRequest = {
        userID: userID,
        waterIntake: waterIntake,
        waterIntakeDate: createdDate,
      };

      const makeQueryRequest = new this.userWaterHistoryModel(payLoadRequest);
      const insertRow = await makeQueryRequest.save();
      return {
        code: 200,
        message: `${waterIntake} ml water added successfully`,
        data: insertRow,
      };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async create(): Promise<any> {
    return {
      code: 200,
      message: "Success",
      data: {
        message: "Hydration data created successfully",
      },
    };
  }

  async fetchWaterRemainderDetails(userID: string): Promise<any> {
    try {
      const existingReminder = await this.waterIntakeRemainderModel.findOne({
        userID,
      });

      if (existingReminder) {
        if (existingReminder) {
          return {
            code: 200,
            message: `Fetching Water Remainder data.`,
            data: existingReminder,
          };
        } else {
          return {
            code: 500,
            message: "No waterReminder found",
            data: null,
          };
        }
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error occurred", data: null };
    }
  }

  async fetchWaterIntakeStatistics(inputRequest): Promise<any> {
    try {
      const { userID, filterDate, filterMonth, filterYear } = inputRequest;
      if (!userID) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
      }
      let query: any = { userID };
      if (filterDate) {
        // Daily filter
        const makeFilterDate = new Date(filterDate);
        makeFilterDate.setHours(0, 0, 0, 0);
        query.waterIntakeDate = {
          $gte: makeFilterDate,
          $lt: new Date(makeFilterDate.getTime() + 24 * 60 * 60 * 1000),
        };
      } else if (filterMonth && filterYear) {
        // Monthly filter
        const startDate = new Date(filterYear, filterMonth - 1, 1); // Month is 0-indexed
        const endDate = new Date(filterYear, filterMonth, 1);
        query.waterIntakeDate = {
          $gte: startDate,
          $lt: endDate,
        };
      } else if (filterYear) {
        // Yearly filter
        const startDate = new Date(filterYear, 0, 1);
        const endDate = new Date(filterYear + 1, 0, 1);
        query.waterIntakeDate = {
          $gte: startDate,
          $lt: endDate,
        };
      }
      const result = await this.userWaterHistoryModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              userID: "$userID",
              waterIntakeDate: {
                $dateToString: { format: "%Y-%m-%d", date: "$waterIntakeDate" },
              },
            },
            totalWaterIntake: { $sum: "$waterIntake" },
          },
        },
        {
          $project: {
            userID: "$_id.userID",
            date: "$_id.waterIntakeDate",
            totalWaterIntake: 1,
            _id: 0,
          },
        },
      ]);

      if (result.length === 0) {
        return {
          error: "No Data Found",
          message: "No records found for the given user or date.",
          code: 404,
        };
      }

      return {
        message: "Successfully fetched user-based water intake statistics",
        data:
          result && result.length
            ? {
                totalWaterIntakeInMl: result[0].totalWaterIntake,
                totalWaterIntakeInLiters: result[0].totalWaterIntake,
              }
            : null,
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error occurred", data: null };
    }
  }

  private feetToCms(height: string) {
    const cmPerFoot = 30.48;
    const cmPerInch = 2.54;
    const regex = /^(\d+)'(\d+)''$/;

    if (height) {
      const match = height.match(regex);
      if (match) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        const totalCm = feet * cmPerFoot + inches * cmPerInch;
        return totalCm;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
