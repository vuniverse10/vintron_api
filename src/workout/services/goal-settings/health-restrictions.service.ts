import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateHealRestrictionsDto } from "../../dto/goal-settings/create-healh-restrictions.dto";
import { ServiceResponse } from "@common/service-response";
import { HealthRestrictions } from "src/workout/schemas/goal-settings/health-restrictions.schema";

@Injectable()
export class HealthRestrictionsService {
  constructor(
    @InjectModel("HealthRestrictions")
    private readonly hrModel: Model<HealthRestrictions>,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async create(
    CreateHealRestrictionsDto: CreateHealRestrictionsDto
  ): Promise<HealthRestrictions> {
    const insertQueryRequest = new this.hrModel(CreateHealRestrictionsDto);
    return insertQueryRequest.save();
  }

  async findAll(): Promise<HealthRestrictions[]> {
    return this.hrModel.find().exec();
  }

  async findOne(id: string): Promise<HealthRestrictions> {
    return this.hrModel.findById(id).exec();
  }

  async update(
    id: string,
    updateGoalDto: CreateHealRestrictionsDto
  ): Promise<HealthRestrictions> {
    return this.hrModel
      .findByIdAndUpdate(id, updateGoalDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.hrModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(goals: { title: string }[]): Promise<any> {
    const formattedRequest = goals.map((hData) => ({
      title: hData.title,
    }));

    return await this.hrModel.insertMany(formattedRequest);
  }

  async fetchHealthRestrictions(): Promise<{
    code: number;
    message: string;
    data: { title: string }[];
  }> {
    const result = await this.hrModel.find({}, "title").exec();
    return this.serviceResponse.apiResponse<{ title: string }[]>(
      result,
      "Health Restrictions"
    );
  }
}
