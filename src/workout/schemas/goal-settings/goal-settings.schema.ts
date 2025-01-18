import { Schema, Document } from "mongoose";

export const GoalSettingsSchema = new Schema({
  goal: { type: String, required: true },
  workoutPlan: { type: String, required: true },
  workoutDuration: { type: String, required: true },
  workoutSchedule: { type: String, required: true },
  fitnessLevel: { type: String, required: true },
  equipment: { type: String, required: true },
  cardioTraining: { type: String, required: true },
  healthRestrictions: { type: String, required: true },
  isHealthRestriction: { type: Boolean, required: false, default: false },
  userID: { type: String, required: true },
  //user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface GoalSettings extends Document {
  title: string;
  workoutPlan: string;
  workoutDuration: string | number;
  workoutSchedule: string;
  fitnessLevel: string;
  equipment: string;
  cardioTraining: string;
  healthRestrictions: string;
  isHealthRestriction: boolean;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}
