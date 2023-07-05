import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { get } from 'http';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateSolutionAttemptDTO } from '../dto/create-solution-attempt.dto';
import { CreateSolutionRatingDTO } from '../dto/create-solution-rating.dto';
import { SolutionAttemptedDocument } from '../schemas/solutionattempted.schema';
import { UserDocument } from '../schemas/user.schema';
import { SolutionAttemptService } from './attempt.service';

// import { MailerService } from '../email/email.service';

@Controller('solution-attempt')
export class SolutionAttemptController {
  constructor(
    private readonly solutionAttemptService: SolutionAttemptService, // private readonly mailerService: MailerService,
  ) {}

  @Post('create')
  @ApiTags('SolutionAttempt')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async createAttempt(
    @GetUser() user: UserDocument,
    @Body() solutionAttemp: any,
    // @Body() solutionAttemp: CreateSolutionAttemptDTO,
  ): Promise<SolutionAttemptedDocument> {
    return await this.solutionAttemptService.createAttempt(solutionAttemp);
  }

  @Post('createrating')
  @ApiTags('SolutionAttempt')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async createRating(
    @GetUser() user: UserDocument,
    @Body() Rating: any,
    // @Body() Rating: CreateSolutionRatingDTO,
  ): Promise<SolutionAttemptedDocument> {
    // Promise<SolutionAttemptedDocument> {

    // console.log(res);

    return await this.solutionAttemptService.createRating(Rating);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  solutionAttempt(@Param('id') id: string) {
    return this.solutionAttemptService.detail(id);
  }

  @Get('by/:id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  mySolutionAttempt(@Param('id') id: string) {
    return this.solutionAttemptService.mySolutionAttempt(id);
  }
}
