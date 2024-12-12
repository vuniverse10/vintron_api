import { Document } from "mongoose";

export default interface IUser extends Document {
  username: string;
  password?: string;

  email: string;
  mobile: string;

  emailOTP?: string;
  mobileOTP?: string;
  userStatus?: number;
  userID: string;
  mobileVerified: boolean;
  emailVerified: boolean;

  interestedCategories?: string[];
  age: number;
  weight: number;
  height: string;
  gender: string;
  deviceID?: string;
  nutritionCalories?:string;
}
