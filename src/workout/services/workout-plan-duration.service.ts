import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutPlanDuration } from '../schemas/workout-plan-duration.schema';
import { CreateWorkoutPlanDurationDto } from '../dto/create-workout-plan-duration.dto';

@Injectable()
export class WorkoutPlanDurationService {
  constructor(
    @InjectModel('WorkoutPlanDuration')
    private readonly workoutPlanDurationModel: Model<WorkoutPlanDuration>,
  ) {}

  async create(
    CreateWorkoutPlanDurationDto: CreateWorkoutPlanDurationDto,
  ): Promise<WorkoutPlanDuration> {
    const newReq = new this.workoutPlanDurationModel(
      CreateWorkoutPlanDurationDto,
    );
    return newReq.save();
  }

  async findAll(): Promise<WorkoutPlanDuration[]> {
    return this.workoutPlanDurationModel.find().exec();
  }

  async findOne(id: string): Promise<WorkoutPlanDuration> {
    return this.workoutPlanDurationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDto: CreateWorkoutPlanDurationDto,
  ): Promise<WorkoutPlanDuration> {
    return this.workoutPlanDurationModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.workoutPlanDurationModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(
    bulkReq: {
      title: string;
      value: string;
      duration: number;
      durationDisplay: string;
    }[],
  ): Promise<any> {
    const formatDataReq = bulkReq.map((reqData) => ({
      title: reqData.title,
      value: reqData.value,
      duration: reqData.duration,
      durationDisplay: reqData.durationDisplay,
    }));

    return await this.workoutPlanDurationModel.insertMany(formatDataReq);
  }

  async fetchWorkPlanDuration(): Promise<
    {
      title: string;
      value: string;
      duration: number;
      durationDisplay: string;
    }[]
  > {
    return this.workoutPlanDurationModel
      .find({}, 'title value duration durationDisplay')
      .exec();
  }
}
