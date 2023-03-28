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

  async loginUser(loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    const { username, password } = loginUserDTO;

    const user = await this.usersService.findUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
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
      },
      accessToken,
    };
  }
}
