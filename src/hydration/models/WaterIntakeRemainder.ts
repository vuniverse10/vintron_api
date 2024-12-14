import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const remainderSchema = new Schema(
  {
    userID: { type: String, required: true },
    waterGoal: { type: Number, required: true },
    waterRemainder: { type: Number, required: true },
    createdDateTime: { type: Date, required: true, default: Date.now },
    updatedDateTime: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const waterReminderModel = mongoose.model(
  "userWaterRemainder",
  remainderSchema
);
export default waterReminderModel;
