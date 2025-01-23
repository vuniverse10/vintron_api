import { Schema, Document } from "mongoose";

export const UserNutritionHistorySchema = new Schema({
  userID: { type: String, required: true },
  itemWeight: { type: String, required: true },
  mealType: { type: String, required: true },
  itemQuantity: { type: String, required: true },
  foodItem: { type: Object, required: true },
  orderDate: { type: Date, required: true },
  orderTime: { type: String, required: true },
  foodItemCalories: { type: Number, required: false },
  consumedCalories: { type: Number, required: false },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface UserNutritionHistory extends Document {
  userID: string;
  itemWeight: string;
  mealType: string;
  itemQuantity: number;
  foodItem?: Object;
  orderDate: Date;
  orderTime: string;
  foodItemCalories: number;
  consumedCalories: number;
  createdDateTime: Date;
  updatedDateTime: Date;
}
