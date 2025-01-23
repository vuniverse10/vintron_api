import { Schema, Document } from "mongoose";

export const UserDayBasedCaloriesSetupSchema = new Schema({
  userID: { type: String, required: true },
  caloriesGoal: { type: Number, required: true },
  goalDate: { type: Date, required: true },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface UserDayBasedCaloriesSetup extends Document {
  userID: string;
  caloriesGoal: number;
  goalDate: Date;
  createdDateTime: Date;
  updatedDateTime: Date;
}
