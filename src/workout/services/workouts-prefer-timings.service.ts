import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutsPreferTimings } from '../schemas/workouts-prefer-timings.schema';
import { CreateWorkoutsPreferTimingsDto } from '../dto/create-workouts-prefer-timings.dto';

@Injectable()
export class WorkoutsPreferTimingsService {
  constructor(
    @InjectModel('WorkoutsPreferTimings')
    private readonly workoutsPreferTimingsModel: Model<WorkoutsPreferTimings>,
  ) {}

  async create(
    createDto: CreateWorkoutsPreferTimingsDto,
  ): Promise<WorkoutsPreferTimings> {
    const timing = new this.workoutsPreferTimingsModel(createDto);
    return timing.save();
  }

  async findAll(): Promise<WorkoutsPreferTimings[]> {
    return this.workoutsPreferTimingsModel.find().exec();
  }

  async findOne(id: string): Promise<WorkoutsPreferTimings> {
    const timing = await this.workoutsPreferTimingsModel.findById(id).exec();
    if (!timing) {
      throw new NotFoundException(
        `WorkoutsPreferTiming with ID ${id} not found`,
      );
    }
    return timing;
  }

  async update(
    id: string,
    updateDto: WorkoutsPreferTimings,
  ): Promise<WorkoutsPreferTimings> {
    const updatedTiming = await this.workoutsPreferTimingsModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updatedTiming) {
      throw new NotFoundException(
        `WorkoutsPreferTiming with ID ${id} not found`,
      );
    }

    return updatedTiming;
  }

  async remove(id: string): Promise<void> {
    const result = await this.workoutsPreferTimingsModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(
        `WorkoutsPreferTiming with ID ${id} not found`,
      );
    }
  }

  async fetchWorkoutPreferTimings(): Promise<
    { title: string; value: string }[]
  > {
    return this.workoutsPreferTimingsModel.find({}, 'title value').exec();
  }

  async bulkCreate(
    personalTrainingData: { title: string; value: string }[],
  ): Promise<any> {
    const bulkData = personalTrainingData.map((hData) => ({
      height: hData.title,
      value: hData.value,
    }));
    return await this.workoutsPreferTimingsModel.insertMany(bulkData);
  }
}
