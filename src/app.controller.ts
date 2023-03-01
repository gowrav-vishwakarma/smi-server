import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetUser } from './auth/get-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/guard-test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  test(@GetUser() user) {
    return user.username + ' :: Guard test passed';
  }
}
