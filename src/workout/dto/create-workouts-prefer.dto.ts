import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkoutsPreferDto {
  @IsNotEmpty()
  label: string;
}
