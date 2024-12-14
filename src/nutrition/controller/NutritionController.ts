import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import FoodItemsModel from "../models/NutritionModel";
import UserFoodItemsModel from "../models/NutritionOrders";
import User from "../../user/models/user";
const nutritionSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchTerm = req.query.searchTerm as string;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ code: 204, message: 'Missing "searterm" query parameter' });
  }

  const apiUrl = `https://api.bonhappetee.com/search?value=${encodeURIComponent(
    searchTerm
  )}`;
  const apiToken = process.env.BONHAPPETEE_API_KEY;
  if (!apiToken) {
    return res
      .status(500)
      .json({ code: 204, message: "API token not available" });
  }

  try {
    const existingFoodItems = await FoodItemsModel.findOne({ searchTerm });

    if (existingFoodItems) {
      // If the search term exists in the database, return the data
      return res.json({
        code: 200,
        message: `Fetching ${searchTerm} food items`,
        data: existingFoodItems,
      });
    }

    const response = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiToken,
      },
    });
    console.log(response.data);
    const foodItemList = response.data.items.map((item: any) => ({
      food_name: item.food_name,
      common_names: item.common_names,
      food_unique_id: item.food_unique_id,
      food_id: item.food_id,
      serving_size: item.serving_size,
      serving_type: item.serving_type,
      calories_calculated_for: item.calories_calculated_for,
      basic_unit_measure: item.basic_unit_measure,
      source_link: item.source_link,
      nutrients: {
        fats: item.nutrients.fats,
        carbs: item.nutrients.carbs,
        protein: item.nutrients.protein,
        calories: item.nutrients.calories,
      },
    }));

    const foodItems = new FoodItemsModel({
      searchTerm,
      foodItemList,
    });

    await foodItems.save();

    return res.status(200).json({
      code: 200,
      message: "Food Item List",
      data: foodItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error calling the external API",
      message: error.message,
      code: 400,
    });
  }
};

const saveUserNutrition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userID,
    orderDate,
    orderTime,
    foodItem,
    itemWeight,
    mealType,
    itemQuantity,
  } = req.body;
  try {
    //:TODO - check duplication exists or not.
    const payLoadRequest = {
      userID: userID,
      itemWeight: itemWeight,
      mealType: mealType,
      itemQuantity: Number(itemQuantity),
      foodItem: foodItem,
      orderDate: orderDate,
      orderTime: orderTime,
      foodItemCalories: foodItem.calories_calculated_for,
      consumedCalories: itemQuantity * foodItem.calories_calculated_for,
    };
    const saveFoodItem = new UserFoodItemsModel(payLoadRequest);
    const insertResult = await saveFoodItem.save();
    if (insertResult) {
      return res.status(201).json({
        code: 200,
        message: "Food item added successfully.",
        data: insertResult,
      });
    }
    return res
      .status(204)
      .json({ code: 204, message: "error occured", data: null });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: "error occured", data: null });
  }
};

const updateUserNutritionData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { userID, itemWeight, mealType, itemQuantity, orderDate, orderTime, id } =
    req.body;

  try {
    const authRes = res["locals"]["jwt"];
    const updateResult = await UserFoodItemsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          itemWeight: itemWeight,
          mealType: mealType,
          itemQuantity: Number(itemQuantity),
          orderDate: orderDate,
          orderTime: orderTime,
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (updateResult)
      return res.status(200).json({
        code: 200,
        message: "Item details updated Successfully",
        data: updateResult,
      });
    else
      return res.status(204).json({
        code: 204,
        message: "Unable to Update",
        data: null,
      });
  } catch (error: any) {
    return res.status(500).json({
      code: 500,
      message: "Server Error",
      data: error,
    });
  }
};

const userBasedNutritionFilters = async (
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

    const orders = await UserFoodItemsModel.find(query);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: "No items found",
        message: "No items found for the given user or date.",
        code: 404,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched user-based orders",
      data: orders,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching orders.",
      code: 500,
    });
  }
};

const userFavoriteItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userID: userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        message: "Please provide a valid user ID",
        code: 400,
      });
    }

    const orders = await UserFoodItemsModel.find({ userID: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: "No items found",
        message: "No items found for the given user.",
        code: 404,
      });
    }

    const foodCountMap = new Map();

    orders.forEach((order: any) => {
      order.foodItem.forEach((item: any) => {
        const foodName = item.food_name;
        foodCountMap.set(foodName, (foodCountMap.get(foodName) || 0) + 1);
      });
    });

    let mostOrderedItem = null;
    let maxCount = 0;
    for (let [foodName, count] of foodCountMap) {
      if (count > maxCount) {
        mostOrderedItem = foodName;
        maxCount = count;
      }
    }

    return res.status(200).json({
      message: "Successfully fetched most ordered item",
      data: {
        foodName: mostOrderedItem,
        count: maxCount,
      },
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching orders.",
      code: 500,
    });
  }
};

const userDayBasedNutritionData = async (
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

    const result = await UserFoodItemsModel.aggregate([
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
  nutritionSearch,
  saveUserNutrition,
  updateUserNutritionData,
  userBasedNutritionFilters,
  userFavoriteItems,
  userDayBasedNutritionData,
};
