import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async createMedia(video: Express.Multer.File, uploadUrl: any) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_BUCKET'),
        Body: video.buffer,
        // Key: `nest-question/${uploadUrl}/video.webm`,
        Key: uploadUrl,
      })
      .promise();
    return uploadResult;
  }
}
