import { Schema, Document } from 'mongoose';

export interface WorkoutPlanWeek extends Document {
  title: string;
  value: string;
}

export const WorkoutPlanWeekSchema = new Schema<WorkoutPlanWeek>({
  title: { type: String, required: true },
  value: { type: String, required: true },
});
