import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWeightDto {
  @IsNotEmpty()
  kg: number;
  lbs: number;
}
