import { Schema, Document } from "mongoose";

const nutrientsSchema = new Schema({
  fats: { type: Number, required: false },
  carbs: { type: Number, required: false },
  protein: { type: Number, required: false },
  calories: { type: Number, required: false },
});

const foodItemSchema = new Schema({
  food_name: { type: String, required: false },
  common_names: { type: String, required: false },
  food_unique_id: { type: String, required: false },
  food_id: { type: Number, required: false },
  serving_size: { type: String, required: false, default: 1 },
  serving_type: { type: String, required: false },
  calories_calculated_for: { type: Number, required: false },
  basic_unit_measure: { type: Number, required: false },
  source_link: { type: String, required: false },
  nutrients: { type: nutrientsSchema, required: false },
});

export const FoodItemsSchema = new Schema({
  searchTerm: { type: String, required: true },
  foodItemList: { type: [foodItemSchema], required: true },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface FoodItems extends Document {
  searchTerm: string;
  foodItemList: string[];
  createdDateTime: Date;
  updatedDateTime: Date;
}
