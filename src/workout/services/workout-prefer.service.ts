import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutPrefer } from '../schemas/workout-prefer.schema';
import { CreateWorkoutPreferDto } from '../dto/create-workout-prefer.dto';

@Injectable()
export class WorkoutPreferService {
  constructor(
    @InjectModel('WorkoutPrefer')
    private readonly workoutPreferModel: Model<WorkoutPrefer>,
  ) {}

  async create(
    CreateWorkoutPreferDto: CreateWorkoutPreferDto,
  ): Promise<WorkoutPrefer> {
    const makeRequest = new this.workoutPreferModel(CreateWorkoutPreferDto);
    return makeRequest.save();
  }

  async findAll(): Promise<WorkoutPrefer[]> {
    return this.workoutPreferModel.find().exec();
  }

  async findOne(id: string): Promise<WorkoutPrefer> {
    return this.workoutPreferModel.findById(id).exec();
  }

  async update(
    id: string,
    updateFitnessLevelDto: CreateWorkoutPreferDto,
  ): Promise<WorkoutPrefer> {
    return this.workoutPreferModel
      .findByIdAndUpdate(id, updateFitnessLevelDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.workoutPreferModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(bulkDataReq: { label: string }[]): Promise<any> {
    try {
      console.log(bulkDataReq);
      const bulkData = bulkDataReq.map((inputReq) => ({
        label: inputReq.label,
      }));

      return await this.workoutPreferModel.insertMany(bulkData);
    } catch (error) {
      console.error('Error during bulk insert:', error);
      throw new Error('Bulk insert failed');
    }
  }

  async fetchWorkoutPreferList(): Promise<{ label: string }[]> {
    return this.workoutPreferModel.find({}, 'label').exec();
  }
}
