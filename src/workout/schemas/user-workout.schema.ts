import { Schema, Document } from 'mongoose';

export interface UserWorkout extends Document {
  age: number;
  weight: number;
  height: string | number;
  gender: string;
  personalTrainingJourneyWith: string;
  fitnessLevel: string;
  bodyAreaToFocus: string;
  cardioPlan?: boolean;
  preferableToTrain: string;
  preferableWorkoutSeason: string;
  preferableSlot: string | number;
  weeklyPlan: string[];
  duration: {
    label?: string;
    timings?: string;
    duration?: string;
  };
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserWorkoutSchema = new Schema<UserWorkout>({
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Schema.Types.Mixed, required: true },
  gender: { type: String, required: true },
  personalTrainingJourneyWith: { type: String, required: true },
  fitnessLevel: { type: String, required: true },
  bodyAreaToFocus: { type: String, required: true },
  cardioPlan: { type: Boolean, required: false, default: false },
  preferableToTrain: { type: String, required: true },
  preferableWorkoutSeason: { type: String, required: true },
  preferableSlot: { type: Schema.Types.Mixed, required: true },
  weeklyPlan: { type: [String], required: true },
  duration: {
    label: { type: String, required: false },
    timings: { type: String, required: false },
    duration: { type: String, required: false },
  },
  userID: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
