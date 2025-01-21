import { IsNotEmpty, IsNumber } from "class-validator";

export class WaterIntakeRemainderDto {
  @IsNotEmpty()
  userID: string;
  waterGoal: number;
  waterRemainder: number;
}
