import { Schema, Document } from "mongoose";

export const UserFastingRequestSchema = new Schema({
  userID: { type: String, required: true },
  fastingDays: { type: [String], required: true },
  scheduleStartDate: { type: Date, required: true },
  scheduleEndDate: { type: Date, required: true },
  scheduleStartTime: { type: String, required: true },
  scheduleEndTime: { type: String, required: true },
  schedulePeriod: { type: String, required: true },
  schedulePlan: { type: String, required: true },
  createdDateTime: { type: Date, default: Date.now },
  updatedDateTime: { type: Date, default: Date.now },
  fastingStatus: { type: String, required: true, default: "NEW" },
});

export interface UserFastingRequest extends Document {
  userID: string;
  fastingDays: string[];
  scheduleStartDate: Date;
  scheduleEndDate: Date;
  scheduleStartTime: string;
  scheduleEndTime: string;
  schedulePeriod: string;
  schedulePlan: string;
  createdDateTime: Date;
  updatedDateTime: Date;
  fastingStatus: string;
}
