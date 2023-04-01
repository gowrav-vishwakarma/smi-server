import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from 'src/auth/dto/user-login.dto';
import { RegisterUserDTO } from 'src/auth/dto/user-register.dto';
import { User } from 'src/api/schemas/user.schema';
import { AuthService } from './auth.service';
import { MailerService } from 'src/api/email/email.service';
import { UsersService } from 'src/api/users/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() registerUserDTO: RegisterUserDTO): Promise<any> {
    const userData = await this.authService.registerUser(registerUserDTO);

    try {
      await this.mailerService.sendMail(
        userData.email,
        'SolveMyIssue Verification email',
        'verification-template.html',
        {
          title: 'Verification OTP',
          message: 'Your OTP',
          verification_link:
            process.env.CLIENT_URL +
            '/verification/' +
            userData.username +
            '/' +
            userData.authToken,
          otp: userData.authOTP,
          username: userData.username,
        },
      );
    } catch (error) {}

    return { message: 'User created successfully' };
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.loginUser(loginUserDTO);
  }

  @Post('sendverification')
  @UsePipes(ValidationPipe)
  async sendVerificationOTP(
    @Body() payload: { username: string },
  ): Promise<any> {
    const userData = await this.userService.findUserByUsername(
      payload.username,
    );

    console.log('userData', userData);
    if (userData) {
      await this.mailerService.sendMail(
        userData.email,
        'SolveMyIssue Verification email',
        'verification-template.html',
        {
          title: 'Verification OTP',
          message: 'Your OTP',
          verification_link:
            process.env.CLIENT_URL +
            '/verification/' +
            userData.username +
            '/' +
            userData.authToken,
          otp: userData.authOTP,
          username: userData.username,
        },
      );
    }

    return { message: 'verification send successfully' };
  }

  @Post('verification')
  @UsePipes(ValidationPipe)
  async verifyUser(
    @Body() payload: { username: string; authtoken: string },
  ): Promise<any> {
    return this.authService.verifyUser(payload);
  }
}
