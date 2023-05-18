import {
  ConflictException,
  NotAcceptableException,
  Injectable,
} from '@nestjs/common';
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
      const checkUser = await this.findUserByUsername(registerUserDto.email);
      console.log(checkUser);
      if (checkUser && checkUser.status == 'REGISTERED') {
        throw new NotAcceptableException('User REGISTERED But Not Active');
      }

      if (error.code === 11000) {
        throw new ConflictException('Username/email Id already exists');
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
    if (!updateUserDto.userId || updateUserDto.userId == undefined) return;

    try {
      if (updateUserDto.password) {
        // for update password only
        console.log('updateUserDto.password save method');
        const um = await this.userModel.findById(updateUserDto.userId).exec();
        um.password = updateUserDto.password;
        return um.save();
      } else {
        // converting jsonstring to jsonObject
        if (updateUserDto.socialProfile != null) {
          updateUserDto.socialProfile = JSON.parse(updateUserDto.socialProfile);
        }

        return await this.userModel.updateOne(
          { _id: updateUserDto.userId },
          updateUserDto,
        );
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        throw error;
      }
    }
  }

  async setOnlineStatus(status: string, user: UserDocument): Promise<any> {
    return await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        onlineStatus: status,
      },
    );
  }
}
