import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePersonalTrainingServiceDto {
  @IsNotEmpty()
  label: string;
  value: string;
}
