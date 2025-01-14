import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBodyFocusAreaDto {
  @IsNotEmpty()
  label: string;
}
