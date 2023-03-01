import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTopicDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({ default: 'Topic Description here' })
  description: string;

  @IsString()
  @ApiProperty()
  icon: string;
}
