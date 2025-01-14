import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutPlanWeek } from '../schemas/workout-plan-week.schema';
import { CreateWorkoutPlanWeekDto } from '../dto/create-workout-plan-week.dto';

@Injectable()
export class workoutPlanWeekService {
  constructor(
    @InjectModel('WorkoutPlanWeek')
    private readonly workoutPlanWeekModel: Model<WorkoutPlanWeek>,
  ) {}

  async create(
    createPTDto: CreateWorkoutPlanWeekDto,
  ): Promise<WorkoutPlanWeek> {
    const newPersonalTraining = new this.workoutPlanWeekModel(createPTDto);
    return newPersonalTraining.save();
  }

  async findAll(): Promise<WorkoutPlanWeek[]> {
    return this.workoutPlanWeekModel.find().exec();
  }

  async findOne(id: string): Promise<WorkoutPlanWeek> {
    return this.workoutPlanWeekModel.findById(id).exec();
  }

  async update(
    id: string,
    updateHeightDto: CreateWorkoutPlanWeekDto,
  ): Promise<WorkoutPlanWeek> {
    return this.workoutPlanWeekModel
      .findByIdAndUpdate(id, updateHeightDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.workoutPlanWeekModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(
    bulkDataReq: { title: string; value: string }[],
  ): Promise<any> {
    try {
      const bulkData = bulkDataReq.map((hData) => ({
        title: hData.title,
        value: hData.value,
      }));
      return await this.workoutPlanWeekModel.insertMany(bulkData);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchWorkoutPlanWeekList(): Promise<
    { title: string; value: string }[]
  > {
    return this.workoutPlanWeekModel.find({}, 'title value').exec();
  }
}
