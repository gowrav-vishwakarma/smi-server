import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from '../schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private readonly TopicModel: Model<TopicDocument>,
  ) {}

  async createTopic(topicDto: {
    name: string;
    description: string;
  }): Promise<TopicDocument> {
    const topic = new this.TopicModel(topicDto);
    try {
      return await topic.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('topicname already exists');
      } else {
        throw error;
      }
    }
  }

  async findAll(): Promise<TopicDocument[]> {
    return await this.TopicModel.find().exec();
  }
}
