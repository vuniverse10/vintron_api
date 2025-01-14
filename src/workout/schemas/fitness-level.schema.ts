import { Schema, Document } from 'mongoose';

export interface FitnessLevel extends Document {
  label: string;
}

export const FitnessLevelSchema = new Schema<FitnessLevel>({
  label: { type: String, required: true },
});
