import { Schema, Document } from "mongoose";

export const UserWaterHistorySchema = new Schema({
  userID: { type: String, required: true },
  waterIntake: { type: Number, required: true },
  waterIntakeDate: { type: Date, default: Date.now },
  createdDateTime: { type: Date, default: Date.now },
});

export interface UserWaterHistory extends Document {
  userID: string;
  waterIntake: number;
  waterRemainder: number;
  waterIntakeDate: Date;
  createdDateTime: Date;
}
