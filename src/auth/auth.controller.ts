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

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() registerUserDTO: RegisterUserDTO): Promise<any> {
    const userData = await this.authService.registerUser(registerUserDTO);
    console.log(userData);

    try {
      await this.mailerService.sendMail(
        'rakesh.s@frendy.in',
        'SolveMyIssue verification email',
        'verification-template.html',
        {
          title: 'Verification OTP',
          message: 'Your OTP',
          verification_link: userData.authToken,
          otp: userData.authOTP,
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
}
