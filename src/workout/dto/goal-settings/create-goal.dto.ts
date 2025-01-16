import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGoalDto {
  @IsNotEmpty()
  title: string;
}
