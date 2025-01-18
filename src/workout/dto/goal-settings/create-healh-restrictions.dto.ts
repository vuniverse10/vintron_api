import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateHealRestrictionsDto {
  @IsNotEmpty()
  title: string;
}
