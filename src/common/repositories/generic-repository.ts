import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  MongooseUpdateQueryOptions,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base-repository.interface';

@Injectable()
export class GenericRepository<T extends Document> implements BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  // Create Operations
  async create(createDto: Partial<T>): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async createMany(createDtos: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(createDtos, { ordered: false }) as unknown as T[];
  }

  // Find Operations
  async findAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async findOne(filter: FilterQuery<T>, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async findById(id: string, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findById(id, null, options).exec();
  }

  // Update Operations
  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, options).exec();
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, options).exec();
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: MongooseUpdateQueryOptions = {}
  ): Promise<number> {
    const result = await this.model.updateMany(filter, update, options).exec();
    return result.modifiedCount || 0;
  }

  // Delete Operations
  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount || 0;
  }

  // Time Series Specific Methods
  async findByTimeRange(
    startDate: Date,
    endDate: Date,
    additionalFilter: FilterQuery<T> = {},
    options: QueryOptions = {}
  ): Promise<T[]> {
    const timeField = (this.model.schema as any).options.timeseries?.timeField;

    // TODO: Handle error better
    if (!timeField) {
      throw new Error('Time Series collection must have a timeField defined in schema options.');
    }

    const filter = {
      ...additionalFilter,
      [timeField]: { $gte: startDate, $lte: endDate },
    };

    return this.model.find(filter, null, options).exec();
  }
}
