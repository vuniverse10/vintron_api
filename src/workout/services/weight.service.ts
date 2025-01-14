import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weight } from '../schemas/weight.schema';
import { CreateWeightDto } from '../dto/create-weight.dto';

@Injectable()
export class WeightService {
  constructor(
    @InjectModel('Weight') private readonly weightModel: Model<Weight>,
  ) {}

  async create(createWeightDto: CreateWeightDto): Promise<Weight> {
    const newWeight = new this.weightModel(createWeightDto);
    return newWeight.save();
  }

  async findAll(): Promise<Weight[]> {
    return this.weightModel.find().exec();
  }

  async findOne(id: string): Promise<Weight> {
    return this.weightModel.findById(id).exec();
  }

  async update(id: string, updateWeightDto: CreateWeightDto): Promise<Weight> {
    return this.weightModel
      .findByIdAndUpdate(id, updateWeightDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.weightModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(weights: { kg: number; lbs: number }[]): Promise<any> {
    const formattedHeights = weights.map((hData) => ({
      kg: hData.kg,
      lbs: hData.lbs,
    }));

    return await this.weightModel.insertMany(formattedHeights);
  }

  async fetchWeights(): Promise<{ kg: number; lbs: number }[]> {
    return this.weightModel.find({}, 'kg lbs').exec();
  }
}
