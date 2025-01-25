import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDayBasedCaloriesSetupsDto } from "../dto/userDayBasedCaloriesSetup.dto";
import { UserDayBasedCaloriesSetup } from "../schema/userDayBasedCaloriesSetup.schema";
import { FoodItems } from "../schema/food.schema";
import { ServiceResponse } from "@common/service-response";
import axios from "axios";
import { UserNutritionHistory } from "../schema/userNutritionHistory.schema";

@Injectable()
export class NutritionService {
  constructor(
    @InjectModel("UserDayBasedCaloriesSetup")
    private readonly userDayBasedCaloriesSetupModel: Model<UserDayBasedCaloriesSetup>,
    @InjectModel("FoodItems")
    private readonly foodItemsModel: Model<FoodItems>,
    @InjectModel("UserNutritionHistory")
    private readonly userNutritionHistoryModel: Model<UserNutritionHistory>
  ) {}

  async saveUserDayBasedCaloriesSetup(
    userDayBasedCaloriesSetupData: UserDayBasedCaloriesSetupsDto
  ): Promise<any> {
    const { userID, caloriesGoal, goalDate } = userDayBasedCaloriesSetupData;

    const filter = { userID, goalDate };

    const update = { $set: { caloriesGoal } };

    const options = { upsert: true, new: true };

    const saveResponse =
      await this.userDayBasedCaloriesSetupModel.findOneAndUpdate(
        filter,
        update,
        options
      );

    return {
      code: 200,
      message: "User's daily calories goal saved successfully",
      data: saveResponse,
    };
  }

  async searchNutrition(searchTerm: string): Promise<any> {
    const apiUrl = `https://api.bonhappetee.com/search?value=${encodeURIComponent(
      searchTerm
    )}`;
    const apiToken = process.env.BONHAPPETEE_API_KEY;
    if (!apiToken) {
      return {
        code: 500,
        message: "Missing API Key ",
        data: [],
      };
    }
    try {
      const existingFoodItems = await this.foodItemsModel.findOne({
        searchTerm,
      });
      if (existingFoodItems) {
        return {
          code: 200,
          message: `Fetching ${searchTerm} food items`,
          data: existingFoodItems,
        };
      }
      const response = await axios.get(apiUrl, {
        headers: {
          "x-api-key": apiToken,
        },
      });

      const foodItemList = [];

      response.data.items.forEach((item: any) => {
        const itemList = {
          food_name: item.food_name || null,
          common_names: item.common_names || null,
          food_unique_id: item.food_unique_id || null,
          food_id: item.food_id || null,
          serving_size: 1 || null,
          serving_type: item.serving_type || null,
          calories_calculated_for: item.calories_calculated_for || null,
          basic_unit_measure: item.basic_unit_measure || null,
          source_link: item.source_link || null,
          nutrients: {
            fats: item.nutrients?.fats || 0,
            carbs: item.nutrients?.carbs || 0,
            protein: item.nutrients?.protein || 0,
            calories: item.nutrients?.calories || 0,
          },
        };

        foodItemList.push(itemList);
      });

      const foodItems = new this.foodItemsModel({
        searchTerm,
        foodItemList,
      });

      await foodItems.save();
      return {
        code: 200,
        message: "Food Item List",
        data: foodItems,
      };
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      return {
        code: 500,
        message: "Failed to fetch nutrition data",
        data: [],
      };
    }
  }

  async saveUserNutritionHistory(inputRequest): Promise<any> {
    const {
      userID,
      orderDate,
      orderTime,
      foodItem,
      itemWeight,
      mealType,
      itemQuantity,
    } = inputRequest;

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
    try {
      const saveFoodItem = new this.userNutritionHistoryModel(payLoadRequest);
      const saveFoodQuery = await saveFoodItem.save();
      return {
        code: 200,
        message: "User's nutrition history saved successfully",
        data: await saveFoodQuery,
      };
    } catch (error) {
      console.error("Error Saving Data:", error);
      return {
        code: 500,
        message: "Unable to save data",
        data: null,
      };
    }
  }

  async updateUserNutritionHistory(inputRequest): Promise<any> {
    const {
      userID,
      itemWeight,
      mealType,
      itemQuantity,
      orderDate,
      orderTime,
      id,
    } = inputRequest;

    try {
      const updatedFoodItem =
        await this.userNutritionHistoryModel.findByIdAndUpdate(
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
            new: true,
          }
        );

      if (!updatedFoodItem) {
        throw new Error("User's nutrition history not found.");
      }

      return {
        code: 200,
        message: "User's nutrition history updated successfully",
        data: updatedFoodItem,
      };
    } catch (error) {
      console.error("Error Updating Data:", error);

      return {
        code: 500,
        message:
          "An error occurred while updating the user's nutrition history.",
        data: null,
      };
    }
  }

  async userBasedNutritionFilters(inputRequest): Promise<any> {
    try {
      const { userID: userId, filterDate } = inputRequest;
      if (!userId) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
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

      const orders = await this.userNutritionHistoryModel.find(query);

      if (!orders || orders.length === 0) {
        return {
          error: "No items found",
          message: "No items found for the given user or date.",
          code: 404,
        };
      }
      return {
        message: "Successfully fetched user-based orders",
        data: orders,
        code: 200,
      };
    } catch (error) {
      return {
        error: "Internal Server Error",
        message: "An error occurred while fetching orders.",
        code: 500,
      };
    }
  }

  async userFavoriteItems(inputRequest) {
    try {
      const { userID: userId } = inputRequest;

      if (!userId) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
      }

      const orders = await this.userNutritionHistoryModel.find({
        userID: userId,
      });

      if (!orders || orders.length === 0) {
        return {
          error: "No items found",
          message: "No items found for the given user.",
          code: 404,
        };
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

      return {
        message: "Successfully fetched most ordered item",
        data: {
          foodName: mostOrderedItem,
          count: maxCount,
        },
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Internal Server Error",
        message: "An error occurred while fetching orders.",
        code: 500,
      };
    }
  }

  async userDayBasedNutritionData(inputRequest) {
    try {
      const { userID: userId, filterDate } = inputRequest;

      if (!userId) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
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

      const result = await this.userNutritionHistoryModel.aggregate([
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
        return {
          error: "No items found",
          message: "No items found for the given user or date.",
          code: 404,
        };
      }

      return {
        message: "Successfully fetched user-based consumed calories",
        data: {
          date: filterDate,
          consumedCalories: result ? result[0].totalConsumedCalories : 0,
        },
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Internal Server Error",
        message: "An error occurred while fetching consumed calories.",
        code: 500,
      };
    }
  }

  async UserDayBasedTargetData(inputRequest) {
    try {
      const { userID: userId, filterDate } = inputRequest;

      if (!userId) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
      }

      if (!filterDate) {
        return {
          error: "Filter Date is required",
          message: "Please provide a valid date",
          code: 400,
        };
      }

      const startDate = new Date(filterDate);
      const formattedFilterDate = startDate.toISOString().split("T")[0];

      const result = await this.userDayBasedCaloriesSetupModel.aggregate([
        {
          $match: {
            userID: userId,
            goalDate: {
              $gte: new Date(formattedFilterDate),
              $lt: new Date(
                new Date(formattedFilterDate).setDate(
                  new Date(formattedFilterDate).getDate() + 1
                )
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalConsumedCalories: { $sum: "$caloriesGoal" },
          },
        },
      ]);

      if (result.length === 0) {
        return {
          error: "No data found",
          message: "No data found for the given user or date.",
          code: 404,
        };
      }

      return {
        message: "User Day based calories data.",
        data: {
          date: formattedFilterDate,
          consumedCalories: result[0].totalConsumedCalories || 0,
        },
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Internal Server Error",
        message: "An error occurred while fetching consumed calories.",
        code: 500,
      };
    }
  }

  async userBasedSummaryData(inputRequest) {
    try {
      const { userID: userId, filterDate } = inputRequest;

      // Validate the input data
      if (!userId) {
        return {
          error: "User ID is required",
          message: "Please provide a valid user ID",
          code: 400,
        };
      }

      if (!filterDate) {
        return {
          error: "Filter Date is required",
          message: "Please provide a valid date",
          code: 400,
        };
      }

      // Convert the input date (without time) into a Date object and then format it
      const startDate = new Date(filterDate);
      const formattedFilterDate = startDate.toISOString().split("T")[0]; // Only keep 'YYYY-MM-DD'

      // Aggregate query to sum calories and nutrients based on userID and createdDateTime
      const result = await this.userNutritionHistoryModel.aggregate([
        {
          $match: {
            userID: userId,
            // Match the date part of createdDateTime using $dateToString
            /* createdDateTime: {
              $gte: new Date(formattedFilterDate),
              $lt: new Date(
                new Date(formattedFilterDate).setDate(
                  new Date(formattedFilterDate).getDate() + 1
                )
              ), // Match the whole day
            },*/
          },
        },
        {
          $unwind: "$foodItem", // Unwind the foodItems array to process each item
        },
        {
          $group: {
            _id: null, // Group by no specific field (we want to sum everything)
            totalFats: { $sum: "$foodItem.nutrients.fats" }, // Sum the fats
            totalCarbs: { $sum: "$foodItem.nutrients.carbs" }, // Sum the carbs
            totalProtein: { $sum: "$foodItem.nutrients.protein" }, // Sum the protein
            totalCalories: { $sum: "$foodItem.nutrients.calories" }, // Sum the calories
          },
        },
      ]);

      // If no results found, return a message
      if (result.length === 0) {
        return {
          error: "No data found",
          message: "No data found for the given user or date.",
          code: 404,
        };
      }

      // Return the result with the summed nutrients
      return {
        message: "User Day based nutrient data.",
        data: {
          date: formattedFilterDate,
          nutrients: {
            fats: result[0].totalFats || 0,
            carbs: result[0].totalCarbs || 0,
            protein: result[0].totalProtein || 0,
            calories: result[0].totalCalories || 0,
          },
        },
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Internal Server Error",
        message: "An error occurred while fetching consumed nutrients.",
        code: 500,
      };
    }
  }
}
