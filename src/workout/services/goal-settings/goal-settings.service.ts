import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GoalSettings } from "../../schemas/goal-settings/goal-settings.schema";
import { CreateGoalSettingDto } from "../../dto/goal-settings/create-goal-setting.dto";
import { ServiceResponse } from "@common/service-response";

@Injectable()
export class GoalSettingService {
  constructor(
    @InjectModel("GoalSettings")
    private readonly goalSettingModel: Model<GoalSettings>,
    private readonly serviceResponse: ServiceResponse
  ) {}
}
