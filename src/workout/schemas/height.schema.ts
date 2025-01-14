import { Schema, Document } from 'mongoose';

export const HeightSchema = new Schema({
  height: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface Height extends Document {
  height: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
