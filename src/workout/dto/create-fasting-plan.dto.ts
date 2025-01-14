import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFastingPlanDto {
  @IsNotEmpty()
  personId: string;

  @IsString()
  fastingType: string;

  @IsNumber()
  durationInHours: number;
}
