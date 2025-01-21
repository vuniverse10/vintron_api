import { Schema, Document } from "mongoose";

export const WaterIntakeRemainderSchema = new Schema({
  userID: { type: String, required: true },
  waterGoal: { type: Number, required: true },
  waterRemainder: { type: Number, required: true },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface WaterIntakeRemainder extends Document {
  userID: string;
  waterGoal: number;
  waterRemainder: number;
  createdDateTime: Date;
  updatedDateTime: Date;
}
