import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { VoteCommentDTO } from '../dto/vote-comment.dto';
import { UserDocument } from '../schemas/user.schema';
import { CommentsService } from './comments.service';
import { Express } from 'express';
import { MediaService } from '../media/media.service';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly mediaService: MediaService,
  ) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard())
  async createComment(
    @GetUser() user: UserDocument,
    @Body() createCommentDTO: CreateCommentDTO,
    @UploadedFile() video: Express.Multer.File,
  ) {
    if (video) {
      const mediaRes = await this.mediaService.createMedia(
        video,
        `questions/${createCommentDTO.questionId}/comments/${createCommentDTO.questionId}_video.webm`,
      );
      createCommentDTO['video'] = mediaRes['key'];
    }
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

  @Get('delete-comment/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async deleteComment(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.commentsService.deleteComment(id, user);
  }
}
