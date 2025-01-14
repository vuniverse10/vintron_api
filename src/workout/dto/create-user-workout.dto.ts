import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserWorkoutDTO {
  age: number;
  weight: number;
  height: string | number;
  gender: string;
  personalTrainingJourneyWith: string;
  fitnessLevel: string;
  bodyAreaToFocus: string;
  cardioPlan?: boolean;
  preferableToTrain: string;
  preferableWorkoutSeason: string;
  preferableSlot: string | number;
  weeklyPlan: string[];
  duration?: {
    label?: string;
    timings?: string;
    duration?: string;
  };
  userID: string;

  constructor(partial: Partial<UserWorkoutDTO>) {
    Object.assign(this, partial);
  }
}
