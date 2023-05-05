import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from 'src/auth/dto/user-login.dto';
import { LoginUserWithTokenDTO } from 'src/auth/dto/user-login-withtoken.dto';
import { RegisterUserDTO } from 'src/auth/dto/user-register.dto';
import { User } from 'src/api/schemas/user.schema';
import { AuthService } from './auth.service';
import { MailerService } from 'src/api/email/email.service';
import { UsersService } from 'src/api/users/users.service';
import * as bcrypt from 'bcrypt';

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

  @Post('loginwithtoken')
  @UsePipes(ValidationPipe)
  loginUserWithToken(@Body() loginUserDetail: LoginUserWithTokenDTO) {
    return this.authService.loginUser({
      token: loginUserDetail.token,
      username: loginUserDetail.username,
      password: undefined,
    });
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

  @Post('otpverification')
  @UsePipes(ValidationPipe)
  async verifyUserOTP(
    @Body() payload: { username: string; code: string },
  ): Promise<any> {
    return this.authService.verifyUserOTP(payload);
  }

  @Post('sendresetpasswordlink')
  @UsePipes(ValidationPipe)
  async sendResetPasswordLink(
    @Body() payload: { emailId: string },
  ): Promise<any> {
    const userData = await this.userService.findUserByUsername(payload.emailId);

    if (userData) {
      const authOTP =
        '' + Math.abs(Math.floor(Math.random() * (111111 - 999999) + 111111));
      const authToken = bcrypt.hashSync(authOTP, 8);

      await this.userService.updateUser({
        authOTP: authOTP,
        authToken: authToken,
        userId: userData._id,
      });

      // console.log('userData', userData);
      await this.mailerService.sendMail(
        userData.email,
        'SolveMyIssue Password Reset Link',
        'passwordReset-template.html',
        {
          title: 'Password Reset Link',
          message: 'Password Reset Link',
          verification_link:
            process.env.CLIENT_URL +
            '/resetpassword/' +
            userData.username +
            '/' +
            authToken,
          otp: authOTP,
          username: userData.username,
        },
      );
      return { message: 'password reset link send successfully' };
    } else {
      throw new HttpException(
        'your email id is not registered with us',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
