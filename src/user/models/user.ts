import mongoose, { Schema } from "mongoose";
import IUser from "../../interfaces/user";
import { string } from "zod";

const UserSchema: Schema = new Schema(
  {
    userName: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    weight: { type: Number, required: false },
    height: { type: String, required: false },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: false,
    },
    emailOTP: { type: String, required: false },
    mobileOTP: { type: String, required: false },
    userStatus: { type: Number, default: 0 },
    userID: { type: String, required: true },
    deviceID: { type: String, required: false },
    paymentSelection: { type: String, required: false },
    interestedCategories: {
      type: Array,
      required: false,
      items: {
        type: Object,
        properties: {
          moduleName: { type: String },
          moduleID: { type: String },
        },
      },
    },
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
      nutritionCalories: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isDuplicateEmail = async function (email) {
  try {
    const emailExists = await this.findOne({ email });
    if (emailExists) true;
    return false;
  } catch (error) {
    return false;
  }
};

UserSchema.statics.isDuplicatePhone = async function (mobile) {
  try {
    const mobileExists = await this.findOne({ mobile });
    if (mobileExists) true;
    return false;
  } catch (error) {
    return false;
  }
};

export default mongoose.model<IUser>("User", UserSchema);
