import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../schemas/user.schema';
import { UsersService } from './users.service';
import { MediaService } from '../media/media.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { Express } from 'express';
import { JwtPayload } from '../../auth/dto/JwtPayload.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
  ) {}

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
      __v: 0,
    });
    delete user.password;
    delete user._id;
    return user;
  }

  @Get('profile-by-token/:token')
  async getProfileByToken(
    @Param('token') token: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.getUserByToken(token);
    delete user.password;
    return user;
  }

  @Post('updateme')
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  /**
   * for uploading single image only S difference
   * @UseInterceptors(FileInterceptor('coverImage'))
   */
  @UseInterceptors(FilesInterceptor('images', 20))
  async updateme(
    @Body() user: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    /**
     * for uploading single image only S difference
     * @UploadedFile() files: Array<Express.Multer.File>,
     */
  ) {
    if (files) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const mediaRes = await this.mediaService.createMedia(
          file,
          `Profile/${user.userId}/${
            file.originalname + '.' + file.mimetype.split('/')[1]
          }`,
        );

        user[file.originalname] = mediaRes['Key'];
      }
    }
    return this.usersService.updateUser(user);
  }

  @Get('set-online-status/:status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async setOnlineStatus(
    @Param('status') status: string,
    @GetUser() user: UserDocument,
  ) {
    return this.usersService.setOnlineStatus(status, user);
  }

  @Get('add-new-ask-me-token/:name')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async addNewAskMeToken(
    @GetUser() user: JwtPayload,
    @Param('name') name: string,
  ) {
    return this.usersService.addNewAskMeToken(user, name);
  }

  @Get('remove-ask-me-token/:token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async removeAskMeToken(
    @GetUser() user: JwtPayload,
    @Param('token') token: string,
  ) {
    return this.usersService.removeAskMeToken(user, token);
  }
}
