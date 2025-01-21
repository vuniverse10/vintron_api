import { IsNotEmpty, IsNumber } from "class-validator";

export class UserWaterHistoryDto {
  @IsNotEmpty()
  userID: string;
  waterIntake: number;
  waterIntakeDate: Date;
  createdDateTime: Date;
}
