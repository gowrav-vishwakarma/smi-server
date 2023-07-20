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
import { BunnyNetService } from '../media/bunnyNet.service';

@Controller('comments')
@ApiTags('Comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly mediaService: MediaService,
    private readonly bunnyNetService: BunnyNetService,
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
      // upload video to s3
      // const mediaRes = await this.mediaService.createMedia(
      //   video,
      //   `questions/${createCommentDTO.questionId}/comments/${createCommentDTO.questionId}_video.webm`,
      // );
      // createCommentDTO['video'] = mediaRes['key'];

      //upload video to bunny.net
      // await this.bunnyNetService.createVideo({
      //   title: 'videoTestService1',
      // });
      const mediaRes = await this.bunnyNetService.uploadVideo(
        {
          title: 'video of Q' + ' ' + createCommentDTO.questionId,
        },
        {
          videoId: null,
          enabledResolutions: '720',
        },
        video.buffer,
      );
      createCommentDTO['video'] = mediaRes['videoPath'];
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
