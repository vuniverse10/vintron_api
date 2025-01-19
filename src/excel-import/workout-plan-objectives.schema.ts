import { Schema, Document } from "mongoose";

export const WorkoutPlanObjectiveSchema = new Schema({
  focus_area: { type: Schema.Types.Mixed, required: false },
  beginner: { type: Schema.Types.Mixed, required: false },
  intermediate: { type: Schema.Types.Mixed, required: false },
  advanced: { type: Schema.Types.Mixed, required: false },
  elite: { type: Schema.Types.Mixed, required: false },
});

export interface WorkoutPlanObjective extends Document {
  focus_area?: string | number;
  beginner?: string | number;
  intermediate?: string | number;
  advanced?: string | number;
  elite?: string | number;
}
