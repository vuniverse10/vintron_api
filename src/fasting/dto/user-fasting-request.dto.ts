import { IsNotEmpty, IsNumber } from "class-validator";
import { SchedulePeriodEnum } from "../enums/SchedulePeriod.enums";
export class UserFastingRequestDto {
  @IsNotEmpty()
  userID: string;
  fastingDays: string[];
  scheduleStartDate: Date;
  scheduleEndDate: Date;
  scheduleStartTime: string;
  scheduleEndTime: string;
  schedulePeriod: SchedulePeriodEnum;
  schedulePlan: string;
}
