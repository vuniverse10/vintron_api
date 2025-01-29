import { IsNotEmpty, IsNumber } from "class-validator";

export class FastingPackagesDto {
  @IsNotEmpty()
  fastingMethod: string;
  fastingWindow: string;
  eatingWindow: string;
  description: string;
  keywords: string;
  title: string;
  icon: string;
  feedDescription: string;
  graphPattern: string;
  graphStartEndTimes: string;
}
