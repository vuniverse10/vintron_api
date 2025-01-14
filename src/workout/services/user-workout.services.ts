import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserWorkout } from '../schemas/user-workout.schema';
import { UserWorkoutDTO } from '../dto/create-user-workout.dto';

@Injectable()
export class UserWorkoutService {
  constructor(
    @InjectModel('UserWorkout')
    private readonly userWorkoutModel: Model<UserWorkout>,
  ) {}

  async create(UserWorkoutDTO: UserWorkoutDTO): Promise<UserWorkout> {
    const makeRequest = new this.userWorkoutModel(UserWorkoutDTO);
    return makeRequest.save();
  }

  async findAll(): Promise<UserWorkout[]> {
    return this.userWorkoutModel.find().exec();
  }

  async findOne(id: string): Promise<UserWorkout> {
    return this.userWorkoutModel.findById(id).exec();
  }

  async update(
    id: string,
    UserWorkoutDTO: UserWorkoutDTO,
  ): Promise<UserWorkout> {
    return this.userWorkoutModel
      .findByIdAndUpdate(id, UserWorkoutDTO, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.userWorkoutModel.findByIdAndDelete(id).exec();
  }
}
