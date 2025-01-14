import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/common';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository extends GenericRepository<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async findByMobileNumber(mobileNumber: string): Promise<UserDocument | null> {
    return this.model.findOne({ mobileNumber }).exec();
  }
}
