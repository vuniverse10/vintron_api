import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGoalSettingDto {
  @IsNotEmpty()
  goal: string;
  workoutPlan: string;
  workoutDuration: string | number;
  workoutSchedule: string;
  fitnessLevel: string;
  equipment: string;
  cardioTraining: string;
  healthRestrictions: string;
  isHealthRestriction: boolean;
  userID: string;
}
