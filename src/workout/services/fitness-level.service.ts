import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FitnessLevel } from '../schemas/fitness-level.schema';
import { CreateFitnessLevelDto } from '../dto/create-fitness-level.dto';

@Injectable()
export class FitnessLevelService {
  constructor(
    @InjectModel('FitnessLevel')
    private readonly fitnessLevelModel: Model<FitnessLevel>,
  ) {}

  async create(
    createFitnessLevelDto: CreateFitnessLevelDto,
  ): Promise<FitnessLevel> {
    const newFitnessLevel = new this.fitnessLevelModel(createFitnessLevelDto);
    return newFitnessLevel.save();
  }

  async findAll(): Promise<FitnessLevel[]> {
    return this.fitnessLevelModel.find().exec();
  }

  async findOne(id: string): Promise<FitnessLevel> {
    return this.fitnessLevelModel.findById(id).exec();
  }

  async update(
    id: string,
    updateFitnessLevelDto: CreateFitnessLevelDto,
  ): Promise<FitnessLevel> {
    return this.fitnessLevelModel
      .findByIdAndUpdate(id, updateFitnessLevelDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.fitnessLevelModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(weights: { label: string }[]): Promise<any> {
    const bulkData = weights.map((inputReq) => ({
      label: inputReq.label,
    }));

    return await this.fitnessLevelModel.insertMany(bulkData);
  }

  async fetchFitnessLevelList(): Promise<{ label: string }[]> {
    return this.fitnessLevelModel.find({}, 'label').exec();
  }
}
