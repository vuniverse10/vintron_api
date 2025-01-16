import { Schema, Document } from "mongoose";

export const GoalSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface Goal extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
