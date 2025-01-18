import { Schema, Document } from "mongoose";

export const HealthRestrictionsSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface HealthRestrictions extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
