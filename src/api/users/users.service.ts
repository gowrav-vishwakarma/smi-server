import {
  ConflictException,
  NotAcceptableException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDTO } from '../../auth/dto/user-register.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtPayload } from '../../auth/dto/JwtPayload.dto';

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

  async getUserByToken(token: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ askMeTokens: { $elemMatch: { token } } }, { password: 0 })
      .exec();
  }

  async findUserByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  async updateUser(updateUserDto: any): Promise<any> {
    if (!updateUserDto.userId) return;

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

  async addNewAskMeToken(user: JwtPayload, name: string): Promise<any> {
    const loadedUser = await this.userModel.findById(user._id);
    if (!loadedUser) {
      throw new Error('User not found');
    }

    const askMeToken = new Types.ObjectId().toString();
    loadedUser.askMeTokens = [
      ...(loadedUser.askMeTokens ?? []),
      { name, token: askMeToken },
    ]; // Push new token into askMeTokens array
    await loadedUser.save(); // Save the updated user document
    return askMeToken;
  }

  async removeAskMeToken(user: JwtPayload, token: string): Promise<any> {
    const loadedUser = await this.userModel.findById(user._id);
    if (!loadedUser) {
      throw new Error('User not found');
    }

    loadedUser.askMeTokens = loadedUser.askMeTokens.filter(
      (t) => t.token !== token,
    ); // Remove token from askMeTokens array
    await loadedUser.save(); // Save the updated user document
  }

  async setOnlineStatus(status: string, user: UserDocument): Promise<any> {
    return this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        onlineStatus: status,
      },
    );
  }
}
