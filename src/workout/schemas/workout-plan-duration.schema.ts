import { Schema, Document } from 'mongoose';

export const WorkoutPlanDurationSchema = new Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  duration: { type: Number, required: true },
  durationDisplay: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface WorkoutPlanDuration extends Document {
  title: string;
  value: string;
  duration: number;
  durationDisplay: string;
  createdAt: Date;
  updatedAt: Date;
}
