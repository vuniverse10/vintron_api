import { Document } from "mongoose";

export interface Nutrients {
    fats: number;
    carbs: number;
    protein: number;
    calories: number;
}

export interface FoodItem {
    food_name: string;
    common_names: string;
    food_unique_id: string;
    food_id: number;
    serving_size: string;
    serving_type: string;
    calories_calculated_for: number;
    basic_unit_measure: number;
    source_link: string;
    nutrients: Nutrients;
}

export default interface FoodItems extends Document {
    searchTerm: string;
    foodItemList: FoodItem[];
}