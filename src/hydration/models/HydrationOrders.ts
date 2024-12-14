import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const userWaterHistory = new Schema(
  {
    userID: { type: String, required: true },
    waterIntake: { type: Number, required: true },
    waterIntakeDate: { type: Date, required: true },
    createdDateTime: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const UserWaterIntakeModel = mongoose.model(
  "userWaterIntake",
  userWaterHistory
);
export default UserWaterIntakeModel;
