import { Schema, Document } from "mongoose";

export const FastingPlanSchema = new Schema({
  fastingPlanTitle: { type: String, required: true },
  fastingPlanValue: { type: String, required: true },
  description: { type: String, required: false },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface FastingPlan extends Document {
  fastingPlanTitle: string;
  fastingPlanValue: string;
  description: string;
  createdDateTime: Date;
  updatedDateTime: Date;
}
