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
import { TopicDocument } from '../schemas/topic.schema';
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from '../dto/create-topic.dto';

@Controller('topics')
@ApiTags('Topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('list')
  async getList(): Promise<TopicDocument[]> {
    return await this.topicsService.findAll();
  }

  @Post('create')
  async createList(@Body() payload: CreateTopicDTO): Promise<TopicDocument> {
    console.log('create topic body params', payload);
    return await this.topicsService.createTopic(payload);
  }
}
