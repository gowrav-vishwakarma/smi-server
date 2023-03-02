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
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { VoteCommentDTO } from '../dto/vote-comment.dto';
import { UserDocument } from '../schemas/user.schema';
import { CommentsService } from './comments.service';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async createComment(
    @GetUser() user: UserDocument,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    return await this.commentsService.createComment(createCommentDTO, user);
  }

  @Get('/vote/:commentId/:vote')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async vote(@GetUser() user: UserDocument, @Param() voteDto: VoteCommentDTO) {
    return this.commentsService.voteCommentQuestion(voteDto, user);
  }
  @Get('/my-comments')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getAllMyComments(@GetUser() user: UserDocument) {
    return this.commentsService.getAllMyComments(user);
  }
  
}
