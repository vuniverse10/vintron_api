import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(mobileNumber: string): Promise<UserDocument> {
    const user = await this.userRepository.create({ mobileNumber });
    return user;
  }

  async findByMobileNumber(mobileNumber: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findByMobileNumber(mobileNumber);
    return user;
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<UserDocument> {
    const updatedUserDocument = await this.userRepository.updateById(id, updatedUser);
    return updatedUserDocument;
  }
}
