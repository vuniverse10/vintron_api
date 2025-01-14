import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalTraining } from '../schemas/personal-training.schema';
import { CreatePersonalTrainingServiceDto } from '../dto/create-personal-training.dto';

@Injectable()
export class PersonalTrainingService {
  constructor(
    @InjectModel('PersonalTraining')
    private readonly PersonalTrainingServiceListModel: Model<PersonalTraining>,
  ) {}

  async create(
    createPTDto: CreatePersonalTrainingServiceDto,
  ): Promise<PersonalTraining> {
    const newPersonalTraining = new this.PersonalTrainingServiceListModel(
      createPTDto,
    );
    return newPersonalTraining.save();
  }

  async findAll(): Promise<PersonalTraining[]> {
    return this.PersonalTrainingServiceListModel.find().exec();
  }

  async findOne(id: string): Promise<PersonalTraining> {
    return this.PersonalTrainingServiceListModel.findById(id).exec();
  }

  async update(
    id: string,
    updateHeightDto: CreatePersonalTrainingServiceDto,
  ): Promise<PersonalTraining> {
    return this.PersonalTrainingServiceListModel.findByIdAndUpdate(
      id,
      updateHeightDto,
      { new: true },
    ).exec();
  }

  async remove(id: string): Promise<void> {
    await this.PersonalTrainingServiceListModel.findByIdAndDelete(id).exec();
  }

  async bulkCreate(
    personalTrainingData: { label: string; value: string }[],
  ): Promise<any> {
    const bulkData = personalTrainingData.map((hData) => ({
      label: hData.label,
      value: hData.value,
    }));
    return await this.PersonalTrainingServiceListModel.insertMany(bulkData);
  }

  async fetchPersonalTrainingList(): Promise<
    { label: string; value: string }[]
  > {
    return this.PersonalTrainingServiceListModel.find({}, 'label value').exec();
  }
}
