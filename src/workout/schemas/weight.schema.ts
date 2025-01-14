import { Schema, Document } from 'mongoose';

export const WeightSchema = new Schema({
  kg: { type: Number, required: true },
  lbs: { type: Number, required: true },
});

export interface Weight extends Document {
  id: string;
  kg: number;
  lbs: number;
}
