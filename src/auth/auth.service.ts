import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from 'src/auth/dto/user-login.dto';
import { RegisterUserDTO } from 'src/auth/dto/user-register.dto';
import { UserDocument } from 'src/api/schemas/user.schema';
import { UsersService } from 'src/api/users/users.service';
import { JwtPayload } from './dto/JwtPayload.dto';
import { LoginResponseDTO } from './dto/login-rersponse.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private JwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDTO): Promise<UserDocument> {
    return this.usersService.createUser(registerUserDto);
  }

  /**
   * login work with both password and token
   */
  async loginUser(loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    const { username, password, token } = loginUserDTO;
    const user = await this.usersService.findUserByUsername(username);

    let data = user.password;
    let hash = password;

    if (token != undefined && token != 'undefined') {
      hash = user.authOTP;
      data = token;
    }

    if (!user || !bcrypt.compareSync(hash, data)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { _id: user._id, username: user.username };
    const accessToken = this.JwtService.sign(payload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userToppics: user.topicsInterestedIn,
        userLanguages: user.languagesSpeaks,
        onlineStatus: user.onlineStatus,
        profileImage: user.profileImage,
      },
      accessToken,
    };
  }

  //   async validateUser(username: string, password: string): Promise<any> {
  //     const user = await this.usersService.findOne(username);
  //     if (user && user.password === password) {
  //       const { password, ...result } = user;
  //       return result;
  //     }
  //     return null;
  //   }

  async verifyUser(verifyUserPayload: {
    username: string;
    authtoken: string;
  }): Promise<LoginResponseDTO> {
    const user = await this.usersService.findUserByUsername(
      verifyUserPayload.username,
    );
    if (!user || user.authToken != verifyUserPayload.authtoken) {
      throw new UnauthorizedException('Invalid otp');
    }
    if (
      !user ||
      !bcrypt.compareSync(user.authOTP, verifyUserPayload.authtoken)
    ) {
      throw new UnauthorizedException('Invalid otp');
    }

    this.usersService.updateUser({
      userId: user._id,
      status: 'ACTIVE',
      authToken: null,
    });

    const payload: JwtPayload = { _id: user._id, username: user.username };
    const accessToken = this.JwtService.sign(payload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userToppics: user.topicsInterestedIn,
        userLanguages: user.languagesSpeaks,
        onlineStatus: user.onlineStatus,
        profileImage: user.profileImage,
      },
      accessToken,
    };
  }

  async verifyUserOTP(verifyUserPayload: {
    username: string;
    code: string;
  }): Promise<LoginResponseDTO> {
    const user = await this.usersService.findUserByUsername(
      verifyUserPayload.username,
    );
    if (!user || user.authOTP != verifyUserPayload.code) {
      throw new UnauthorizedException('Invalid otp');
    }

    this.usersService.updateUser({
      userId: user._id,
      status: 'ACTIVE',
      authToken: null,
    });

    const payload: JwtPayload = { _id: user._id, username: user.username };
    const accessToken = this.JwtService.sign(payload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userToppics: user.topicsInterestedIn,
        userLanguages: user.languagesSpeaks,
        onlineStatus: user.onlineStatus,
        profileImage: user.profileImage,
      },
      accessToken,
    };
  }
}
