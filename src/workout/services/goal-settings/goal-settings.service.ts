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

  async create(
    CreateGoalSettingDto: CreateGoalSettingDto
  ): Promise<GoalSettings> {
    const insertQueryRequest = new this.goalSettingModel(CreateGoalSettingDto);
    return insertQueryRequest.save();
  }

  async findAll(): Promise<GoalSettings[]> {
    return this.goalSettingModel.find().exec();
  }

  async findOne(id: string): Promise<GoalSettings> {
    return this.goalSettingModel.findById(id).exec();
  }
}
