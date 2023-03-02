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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/optionalJwtAuthGyard';
import { CreateQuestionDTO } from '../dto/create-question.dto';
import { GetQuestionsDTO } from '../dto/question-filter-query.dto';
import { QuestionOfferSolutionDTO } from '../dto/question-offersolution.dto';
import { VoteQuestionDTO } from '../dto/vote-question.dto';
import { MediaService } from '../media/media.service';
import { QuestionDocument } from '../schemas/question.schema';
import { UserDocument } from '../schemas/user.schema';
import { QuestionsService } from './questions.service';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  getQuestions(
    @GetUser() user: UserDocument,
    @Body() filterOptions: GetQuestionsDTO,
  ): QuestionDocument[] | any {
    return this.questionsService.searchQuestions(filterOptions, user);
  }

  @Get('/my-questions')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getMyQuestions(
    @GetUser() user: UserDocument,
    @Query() filterOptions: GetQuestionsDTO,
  ): QuestionDocument[] | any {
    return this.questionsService.searchQuestions(filterOptions, user, true);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  questionDetail(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.questionsService.getdetailedQuestion(id, user);
  }

  @Get('/:id/offers')
  @UsePipes(ValidationPipe)
  questionOffers(@Param('id') id: string) {
    return this.questionsService.getQuestionOffers(id);
  }

  @Get('/:id/comments')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  questionComments(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.questionsService.getQuestionComments(id, user);
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('video'))
  async createQuestion(
    @GetUser() user: UserDocument,
    @Body() question: CreateQuestionDTO,
    @UploadedFile() video: Express.Multer.File,
  ) {
    const questionData = {
      ...question,
      questionerId: user._id,
      // video: video ? video.originalname : null,
    };

    const createdQuestion = await this.questionsService.createQuestion(
      questionData,
    );

    if (video) {
      const mediaRes = await this.mediaService.createMedia(
        video,
        createdQuestion._id,
      );
      await this.questionsService.updateVideoURL(
        createdQuestion._id,
        mediaRes.Location,
      );
      createdQuestion.video = mediaRes.Location;
    }
    return createdQuestion;
  }

  @Get('/vote/:questionId/:vote')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async vote(@GetUser() user: UserDocument, @Param() voteDto: VoteQuestionDTO) {
    return this.questionsService.voteQuestion(voteDto, user);
  }

  @Post('/offer-solution')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async offerSolution(
    @GetUser() user: UserDocument,
    @Body() offer: QuestionOfferSolutionDTO,
  ) {
    return this.questionsService.offerSolution(offer, user);
  }
}
