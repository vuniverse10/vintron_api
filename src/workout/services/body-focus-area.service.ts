import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BodyFocusArea } from '../schemas/body-focus-area.schema';
import { CreateBodyFocusAreaDto } from '../dto/create-body-focus-area.dto';

@Injectable()
export class BodyFocusAreaService {
  constructor(
    @InjectModel('BodyFocusArea')
    private readonly bodyFocusAreaModel: Model<BodyFocusArea>,
  ) {}

  async create(
    CreateBodyFocusAreaDto: CreateBodyFocusAreaDto,
  ): Promise<BodyFocusArea> {
    const newFitnessLevel = new this.bodyFocusAreaModel(CreateBodyFocusAreaDto);
    return newFitnessLevel.save();
  }

  async findAll(): Promise<BodyFocusArea[]> {
    return this.bodyFocusAreaModel.find().exec();
  }

  async findOne(id: string): Promise<BodyFocusArea> {
    return this.bodyFocusAreaModel.findById(id).exec();
  }

  async update(
    id: string,
    updateFitnessLevelDto: CreateBodyFocusAreaDto,
  ): Promise<BodyFocusArea> {
    return this.bodyFocusAreaModel
      .findByIdAndUpdate(id, updateFitnessLevelDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.bodyFocusAreaModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(bulkDataReq: { label: string }[]): Promise<any> {
    try {
      console.log(bulkDataReq);
      const bulkData = bulkDataReq.map((inputReq) => ({
        label: inputReq.label,
      }));

      return await this.bodyFocusAreaModel.insertMany(bulkData);
    } catch (error) {
      console.error('Error during bulk insert:', error);
      throw new Error('Bulk insert failed');
    }
  }

  async fetchBodyFocusAreaList(): Promise<{ label: string }[]> {
    return this.bodyFocusAreaModel.find({}, 'label').exec();
  }
}
