import { Schema, Document } from "mongoose";

export const FastingPackagesSchema = new Schema({
  fastingMethod: { type: String, required: true },
  fastingWindow: { type: String, required: true },
  eatingWindow: { type: String, required: false },
  description: { type: String, required: false },
  keywords: { type: String, required: false },
  title: { type: String, required: false },
  icon: { type: String, required: false },
  feedDescription: { type: String, required: false },
  graphPattern: { type: String, required: false },
  graphStartEndTimes: { type: String, required: false },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface FastingPackages extends Document {
  fastingMethod: string;
  fastingWindow: string;
  eatingWindow: string;
  description: string;
  keywords: string;
  title: string;
  icon: string;
  feedDescription: string;
  graphPattern: string;
  graphStartEndTimes: string;
  createdDateTime: Date;
  updatedDateTime: Date;
}
