import { Injectable, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FastingPlan } from "../schemas/fasting-plan.schema";
import { FastingPlanDto } from "../dto/fasting-plan.dto";
import { ServiceResponse } from "@common/service-response";

@Injectable()
export class FastingPlansService {
  constructor(
    @InjectModel("FastingPlan")
    private readonly fastingPlansModel: Model<FastingPlan>,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async create(createFastingPlanDto: FastingPlanDto): Promise<FastingPlan> {
    const createdFastingPlan = new this.fastingPlansModel(createFastingPlanDto);
    return createdFastingPlan.save();
  }

  async findAll(): Promise<FastingPlan[]> {
    return this.fastingPlansModel.find().exec();
  }

  async findOne(id: string): Promise<FastingPlan> {
    return this.fastingPlansModel.findById(id).exec();
  }

  async update(
    id: string,
    FastingPlanDto: FastingPlanDto
  ): Promise<FastingPlan> {
    return this.fastingPlansModel
      .findByIdAndUpdate(id, FastingPlanDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.fastingPlansModel.findByIdAndDelete(id).exec();
  }

  async fetchFastingPlans(): Promise<{
    code: number;
    message: string;
    data: FastingPlan[];
  }> {
    const result = await this.fastingPlansModel
      .find({}, "fastingPlanTitle fastingPlanValue description")
      .exec();
    return this.serviceResponse.apiResponse<FastingPlan[]>(
      result,
      "Fasting Plans"
    );
  }

  async bulkCreate(plans: FastingPlan[]): Promise<any> {
    const bulkPlans = plans.map((hData) => ({
      fastingPlanTitle: hData.fastingPlanTitle,
      fastingPlanValue: hData.fastingPlanValue,
    }));

    return await this.fastingPlansModel.insertMany(bulkPlans);
  }
}
