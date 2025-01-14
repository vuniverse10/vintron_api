import { Schema, Document } from 'mongoose';

export const FastingPlanSchema = new Schema({
  fastingMethod: { type: String, required: true },
  fastingWindow: { type: String, required: true },
  eatingWindow: { type: String, required: false },
  description: { type: String, required: false },
  keywords: { type: String, required: false },
});

export interface FastingPlan extends Document {
  id: string;
  fastingMethod: string;
  fastingWindow: string;
  eatingWindow: string;
  description: string;
  keywords: string;
}
