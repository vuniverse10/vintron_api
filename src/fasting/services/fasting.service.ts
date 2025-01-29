import { Injectable, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserFastingRequest } from "../schemas/user-fasting-request.schema";
import { UserFastingRequestDto } from "../dto/user-fasting-request.dto";

import { UserFastingPlan } from "../schemas/user-fasting-plan.schema";
import { UserFastingPlanDto } from "../dto/user-fasting-plan.dto";

import { ServiceResponse } from "@common/service-response";
import * as moment from "moment";

@Injectable()
export class FastingService {
  constructor(
    @InjectModel("UserFastingRequest")
    private readonly userFastingRequestModel: Model<UserFastingRequest>,
    @InjectModel("UserFastingPlan")
    private readonly userFastingPlanModel: Model<UserFastingPlan>,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async createUserFastingPlan(
    userFastingRequestDto: UserFastingRequestDto
  ): Promise<any> {
    try {
      const createdUserFastingRequest = new this.userFastingRequestModel(
        userFastingRequestDto
      );
      const savedRequest = await createdUserFastingRequest.save();

      // Step 2: Generate future fasting dates
      const fastingPlans = this.generateFastingPlans(
        userFastingRequestDto,
        savedRequest._id.toString()
      );

      // Step 3: Save fasting plans in userFastingPlanModel
      await this.userFastingPlanModel.insertMany(fastingPlans);

      return {
        code: 201,
        message: "Fasting plan created successfully!",
        data: fastingPlans,
      };
    } catch (error) {
      console.error("Error creating fasting plan:", error);
    }
  }

  private generateFastingPlans(
    userFastingRequestDto: UserFastingRequestDto,
    planReferenceID: string
  ): Partial<UserFastingPlan>[] {
    const {
      userID,
      fastingDays,
      scheduleStartDate,
      scheduleEndDate,
      scheduleStartTime,
      scheduleEndTime,
      schedulePeriod,
      schedulePlan,
    } = userFastingRequestDto;

    const startDate = moment(scheduleStartDate);
    const endDate = moment(scheduleEndDate);
    const fastingPlans: Partial<UserFastingPlan>[] = [];

    while (startDate.isSameOrBefore(endDate, "day")) {
      const dayName = startDate.format("ddd").toUpperCase();

      if (fastingDays.includes(dayName)) {
        const fastingPlan = new this.userFastingPlanModel({
          userID,
          planReferenceID,
          schedulePlan,
          dayName,
          scheduleStartDate: startDate.toDate(),
          scheduleEndDate: endDate.toDate(),
          scheduleStartTime,
          scheduleEndTime,
          schedulePeriod,
          isCompleted: false,
          createdDateTime: new Date(),
          updatedDateTime: new Date(),
        });

        fastingPlans.push(fastingPlan);
      }

      startDate.add(1, "day");
    }

    return fastingPlans;
  }

  async fetchUserDayBasedFastingDetails(inputRequest): Promise<any> {
    try {
      const { userID, date } = inputRequest;
      const searchDateStr = moment(date).format("YYYY-MM-DD");

      const fastingPlan = await this.userFastingPlanModel.findOne({
        userID,
        $expr: {
          $or: [
            {
              $eq: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$scheduleStartDate",
                  },
                },
                searchDateStr,
              ],
            },
            {
              $eq: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$scheduleEndDate",
                  },
                },
                searchDateStr,
              ],
            },
          ],
        },
      });

      if (!fastingPlan) {
        return {
          code: 404,
          message: "Fasting plan not found",
          data: null,
        };
      }

      return {
        code: 200,
        message: "Fasting plan fetched successfully!",
        data: fastingPlan,
      };
    } catch (error) {
      console.error("Error fetching fasting plan:", error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async changeFastingCompleteStatus(body: {
    fastingPlanID: string;
    isCompleted: boolean;
    userID: string;
  }): Promise<any> {
    try {
      const { fastingPlanID, isCompleted, userID } = body;

      const updatedFastingPlan =
        await this.userFastingPlanModel.findByIdAndUpdate(
          { _id: fastingPlanID, userID },
          { isCompleted, updatedDateTime: new Date() },
          { new: true }
        );

      if (!updatedFastingPlan) {
        return {
          code: 404,
          message: "Fasting plan not found",
          data: null,
        };
      }

      return {
        code: 200,
        message: "Fasting plan status updated successfully!",
        data: updatedFastingPlan,
      };
    } catch (error) {
      console.error("Error updating fasting plan status:", error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async fetchUserLastFastingData(userID: string): Promise<any> {
    try {
      const lastFastingRequest = await this.userFastingRequestModel
        .findOne({ userID })
        .sort({ createdDateTime: -1 })
        .exec();

      if (!lastFastingRequest) {
        return {
          code: 404,
          message: "No fasting request found for the user",
          data: null,
        };
      }

      const fastingPlanHistory = await this.userFastingPlanModel
        .find({ userID, planReferenceID: lastFastingRequest._id })
        .sort({ scheduleStartDate: -1 })
        .exec();

      return {
        code: 200,
        message: "User fasting plan history fetched successfully!",
        data: {
          lastFastingRequest,
          fastingPlanHistory,
        },
      };
    } catch (error) {
      console.error("Error fetching fasting plan:", error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async updateFastingPlan(
    userID: string,
    fastingPlanID: string,
    updateData: any
  ): Promise<any> {
    try {
      const fastingPlan = await this.userFastingPlanModel
        .findOne({ userID, _id: fastingPlanID })
        .exec();

      if (!fastingPlan) {
        return {
          code: 404,
          message: "Fasting plan not found",
          data: null,
        };
      }

      Object.assign(fastingPlan, updateData);

      await fastingPlan.save();

      return {
        code: 200,
        message: "Fasting plan updated successfully!",
        data: fastingPlan,
      };
    } catch (error) {
      console.error("Error updating fasting plan:", error);
      return {
        code: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }
}
