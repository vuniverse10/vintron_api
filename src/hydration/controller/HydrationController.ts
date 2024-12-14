import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import waterReminderModel from "../models/WaterIntakeRemainder";
import UserWaterIntakeModel from "../models/HydrationOrders";
import User from "../../user/models/user";

const userWaterRemainder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userID, waterGoal, waterRemainder } = req.body;
  try {
    const existingReminder = await waterReminderModel.findOne({ userID });

    if (existingReminder) {
      existingReminder.waterGoal = waterGoal;
      existingReminder.waterRemainder = waterRemainder;
      const updateResult = await existingReminder.save();

      if (updateResult) {
        return res.status(200).json({
          code: 200,
          message: `Goal & Remainder setup successfully`,
          data: updateResult,
        });
      } else {
        return res.status(500).json({
          code: 500,
          message: "Error updating goal & remainder",
          data: null,
        });
      }
    } else {
      // Create a new record
      const payLoadRequest = {
        userID: userID,
        waterGoal: waterGoal,
        waterRemainder: waterRemainder,
      };
      const saveWaterRequest = new waterReminderModel(payLoadRequest);
      const insertResult = await saveWaterRequest.save();

      if (insertResult) {
        return res.status(201).json({
          code: 201,
          message: `Goal & Remainder setup successfully`,
          data: insertResult,
        });
      } else {
        return res.status(500).json({
          code: 500,
          message: "Error setting up goal & remainder",
          data: null,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: "Error occurred", data: null });
  }
};

const saveUserWaterIntake = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userID, waterIntake, createdDate } = req.body;
  try {
    const payLoadRequest = {
      userID: userID,
      waterIntake: waterIntake,
      waterIntakeDate: createdDate,
    };
    const saveWaterRequest = new UserWaterIntakeModel(payLoadRequest);
    const insertResult = await saveWaterRequest.save();
    if (insertResult) {
      return res.status(201).json({
        code: 200,
        message: `${waterIntake} ml water added successfully`,
        data: insertResult,
      });
    }
    return res
      .status(204)
      .json({ code: 204, message: "error occurred", data: null });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: "error occurred", data: null });
  }
};

const userWaterFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userID: userId, filterDate } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        message: "Please provide a valid user ID",
        code: 400,
      });
    }

    let query: any = { userID: userId };

    if (filterDate) {
      const makeFilterDate = new Date(filterDate);

      makeFilterDate.setHours(0, 0, 0, 0);

      query.orderDate = {
        $gte: makeFilterDate,
        $lt: new Date(makeFilterDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const orders = await UserWaterIntakeModel.find(query);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: "No results found",
        message: "No results found for the given user or date.",
        code: 404,
      });
    }

    return res.status(200).json({
      message: "User Water intake results were successfully",
      data: orders,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching results.",
      code: 500,
    });
  }
};

const userDayBasedWaterStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userID: userId, filterDate } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        message: "Please provide a valid user ID",
        code: 400,
      });
    }

    let query: any = { userID: userId };

    if (filterDate) {
      const makeFilterDate = new Date(filterDate);

      makeFilterDate.setHours(0, 0, 0, 0);

      query.orderDate = {
        $gte: makeFilterDate,
        $lt: new Date(makeFilterDate.getTime() + 24 * 60 * 60 * 1000), // End of the day
      };
    }

    const result = await UserWaterIntakeModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: { userID: "$userID", orderDate: "$orderDate" },
          totalConsumedCalories: { $sum: "$consumedCalories" },
        },
      },
      {
        $project: {
          userID: "$_id.userID",
          orderDate: "$_id.orderDate",
          totalConsumedCalories: 1,
          _id: 0,
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        error: "No items found",
        message: "No items found for the given user or date.",
        code: 404,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched user-based consumed calories",
      data: {
        date: filterDate,
        consumedCalories: result ? result[0].totalConsumedCalories : 0,
      },
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching consumed calories.",
      code: 500,
    });
  }
};

export default {
  userWaterRemainder,
  saveUserWaterIntake,
  userDayBasedWaterStatistics,
  userWaterFilters,
};