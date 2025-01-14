import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHeightDto {
  @IsNotEmpty()
  height: string;

  @IsNumber()
  value: number;
}
