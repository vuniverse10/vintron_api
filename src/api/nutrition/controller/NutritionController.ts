import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import FoodItemsModel from "../models/NutritionModel";
const nutritionSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

        const searchTerm = req.query.searchTerm as string;
        if (!searchTerm) {
            return res.status(400).json({ code:204, message: 'Missing "searterm" query parameter' });
        }

        const apiUrl = `https://api.bonhappetee.com/search?value=${encodeURIComponent(searchTerm)}`;
        const apiToken = process.env.BONHAPPETEE_API_KEY;
        if (!apiToken) {
            return res.status(500).json({ code:204, message: 'API token not available' });
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
                'x-api-key': apiToken,
            }
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
            code:200,
            message: 'Food Item List',
            data: foodItems,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error calling the external API',
            message: error.message,
            code:400
        });
    }


};

export default { nutritionSearch };
