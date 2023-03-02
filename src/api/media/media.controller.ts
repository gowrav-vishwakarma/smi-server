import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';

@Controller()
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Post('/upload')
  // async uploadMedia() {
  //   return 'TODO';
  // }
}
