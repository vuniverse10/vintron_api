import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Height } from '../schemas/height.schema';
import { CreateHeightDto } from '../dto/create-height.dto';

@Injectable()
export class HeightService {
  constructor(
    @InjectModel('Height') private readonly heightModel: Model<Height>,
  ) {}

  async create(createHeightDto: CreateHeightDto): Promise<Height> {
    const newHeight = new this.heightModel(createHeightDto);
    return newHeight.save();
  }

  async findAll(): Promise<Height[]> {
    return this.heightModel.find().exec();
  }

  async findOne(id: string): Promise<Height> {
    return this.heightModel.findById(id).exec();
  }

  async update(id: string, updateHeightDto: CreateHeightDto): Promise<Height> {
    return this.heightModel
      .findByIdAndUpdate(id, updateHeightDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.heightModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(heights: { height: string; value: number }[]): Promise<any> {
    const formattedHeights = heights.map((hData) => ({
      height: hData.height,
      value: hData.value,
    }));

    return await this.heightModel.insertMany(formattedHeights);
  }

  async fetchHeights(): Promise<{ height: string; value: number }[]> {
    return this.heightModel.find({}, 'height value').exec();
  }
}
