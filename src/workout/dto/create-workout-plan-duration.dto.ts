import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkoutPlanDurationDto {
  @IsNotEmpty()
  title: string;
  value: string;
  duration: number;
  durationDisplay: string;
}
