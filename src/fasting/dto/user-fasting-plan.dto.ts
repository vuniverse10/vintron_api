import { IsNotEmpty, IsNumber } from "class-validator";
import { SchedulePeriodEnum } from "../enums/SchedulePeriod.enums";
export class UserFastingPlanDto {
  @IsNotEmpty()
  userID: string;
  planReferenceID: string;
  schedulePlan: string;
  dayName: string;
  scheduleStartDate: Date;
  scheduleEndDate: Date;
  scheduleStartTime: string;
  scheduleEndTime: string;
  schedulePeriod: SchedulePeriodEnum;
  isCompleted: boolean;
  createdDateTime: Date;
  updatedDateTime: Date;
}
