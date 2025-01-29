import { Schema, Document } from "mongoose";

export const UserFastingPlanSchema = new Schema({
  userID: { type: String, required: true },
  planReferenceID: { type: String, required: true },
  schedulePlan: { type: String, required: true },
  dayName: { type: String, required: true },
  scheduleStartDate: { type: Date, required: true },
  scheduleEndDate: { type: Date, required: true },
  scheduleStartTime: { type: String, required: true },
  scheduleEndTime: { type: String, required: true },
  schedulePeriod: { type: String, required: true },
  isCompleted: { type: Boolean, required: false, default: false },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
});

export interface UserFastingPlan extends Document {
  userID: string;
  planReferenceID: string;
  schedulePlan: string;
  dayName: string;
  scheduleStartDate: Date;
  scheduleEndDate: Date;
  scheduleStartTime: string;
  scheduleEndTime: string;
  schedulePeriod: string;
  isCompleted: boolean;
  createdDateTime: Date;
  updatedDateTime: Date;
}
