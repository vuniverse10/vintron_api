import { Schema, Document } from "mongoose";

export const UserWorkoutWeeklyPlanSchema = new Schema({
  userID: { type: String, required: true },
  userWorkoutReferenceKey: { type: Schema.Types.ObjectId, required: true },
  WeekDay: { type: String, required: true },
  WeekDate: { type: String, required: false },
  description: { type: String, required: false },
  keywords: { type: String, required: false },
  bodyAreaToFocus: { type: String, required: false },
  preferableToTrainingAt: { type: String, required: false },
  dayExerciseCompleted: { type: Boolean, required: false, default: false },
  exerciseDuration: { type: String, required: false },
  exerciseType: { type: String, required: false },
  exerciseIntensity: { type: String, required: false },
  exerciseRestPeriod: { type: String, required: false },
  exerciseSets: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface UserWorkoutWeeklyPlan extends Document {
  userID: string;
  userWorkoutReferenceKey: string;
  WeekDay: string;
  WeekDate: string;
  description: string;
  keywords: string;
  bodyAreaToFocus: string;
  preferableToTrainingAt: string;
  dayExerciseCompleted: boolean;
  exerciseDuration: string;
  exerciseType: string;
  exerciseIntensity: string;
  exerciseRestPeriod: string;
  exerciseSets: number;
  createdAt: Date;
  updatedAt: Date;
}
