import { IsNotEmpty, IsNumber } from "class-validator";

export class FastingPlanDto {
  @IsNotEmpty()
  fastingPlanTitle: string;
  fastingPlanValue: string;
  description?: string;
}
