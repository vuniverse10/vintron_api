import { Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface BaseRepository<T extends Document> {
  // Create Operations
  create(createDto: Partial<T>): Promise<T>;
  createMany(createDtos: Partial<T>[]): Promise<T[]>;

  // Read Operations
  findAll(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null>;
  findById(id: string, options?: QueryOptions): Promise<T | null>;

  // Update Operations
  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null>;
  updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null>;
  updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<number>;

  // Delete Operations
  deleteOne(filter: FilterQuery<T>): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
  deleteMany(filter: FilterQuery<T>): Promise<number>;

  // Time Series Specific Methods
  findByTimeRange(
    startDate: Date,
    endDate: Date,
    additionalFilter?: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<T[]>;
}
