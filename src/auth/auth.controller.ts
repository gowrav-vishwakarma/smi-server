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

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() registerUserDTO: RegisterUserDTO): Promise<any> {
    await this.authService.registerUser(registerUserDTO);
    return { message: 'User created successfully' };
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.loginUser(loginUserDTO);
  }
}
