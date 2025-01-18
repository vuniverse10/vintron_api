import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Goal } from "../../schemas/goal-settings/goal.schema";
import { CreateGoalDto } from "../../dto/goal-settings/create-goal.dto";
import { ServiceResponse } from "@common/service-response";

@Injectable()
export class GoalService {
  constructor(
    @InjectModel("Goals") private readonly goalModel: Model<Goal>,
    private readonly serviceResponse: ServiceResponse
  ) {}

  async create(CreateGoalDto: CreateGoalDto): Promise<Goal> {
    const insertQueryRequest = new this.goalModel(CreateGoalDto);
    return insertQueryRequest.save();
  }

  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
  }

  async findOne(id: string): Promise<Goal> {
    return this.goalModel.findById(id).exec();
  }

  async update(id: string, updateGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalModel
      .findByIdAndUpdate(id, updateGoalDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.goalModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(goals: { title: string }[]): Promise<any> {
    const formattedRequest = goals.map((hData) => ({
      title: hData.title,
    }));

    return await this.goalModel.insertMany(formattedRequest);
  }

  async fetchGoals(): Promise<{
    code: number;
    message: string;
    data: { title: string }[];
  }> {
    const result = await this.goalModel.find({}, "title").exec();
    return this.serviceResponse.apiResponse<{ title: string }[]>(
      result,
      "Goals"
    );
  }
}
