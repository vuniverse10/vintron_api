import { IsNotEmpty, IsNumber } from "class-validator";

export class UserDayBasedCaloriesSetupsDto {
  @IsNotEmpty()
  userID: string;
  caloriesGoal: number;
  goalDate: Date;
  createdDateTime: Date;
}
