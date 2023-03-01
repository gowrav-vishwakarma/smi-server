import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('details/:id')
  async getUser(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.usersService.getUser(id);
    delete user.password;
    return user;
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.usersService.getUser(id, {
      password: 0,
      _id: 0,
      __v: 0,
    });
    delete user.password;
    delete user._id;
    return user;
  }

  @Post('updateme')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  updateUser(@Body() user: any) {
    console.log('update me', user);
    return this.usersService.updateUser(user);
  }
}
