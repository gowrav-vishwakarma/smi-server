import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDTO } from '../../auth/dto/user-register.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(registerUserDto: RegisterUserDTO): Promise<UserDocument> {
    const user = new this.userModel(registerUserDto);
    try {
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        throw error;
      }
    }
  }

  async getUser(userId: string, excludeFields: {} = {}): Promise<UserDocument> {
    return await this.userModel.findById(userId, excludeFields);
  }

  async findUserByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username });
  }

  async updateUser(updateUserDto: any): Promise<any> {
    try {
      return await this.userModel.updateOne(
        { _id: updateUserDto.userId },
        updateUserDto,
      );
      // const um = await this.userModel.findById(updateUserDto.userId).exec();
      // um.experiences = updateUserDto.experiences;
      // return um.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        throw error;
      }
    }
  }
}
