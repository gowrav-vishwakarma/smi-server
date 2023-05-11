import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

class SolutionChannelsDTO {
  @IsBoolean()
  @ApiProperty({ default: true })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true';
  })
  comments: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  @Transform(({ obj, key }) => obj[key] === 'true')
  chat: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  @Transform(({ obj, key }) => obj[key] === 'true')
  screenShare: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  @Transform(({ obj, key }) => obj[key] === 'true')
  audioCall: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  @Transform(({ obj, key }) => obj[key] === 'true')
  videoCall: boolean;
}

export class CreateQuestionDTO {
  @IsDefined()
  @ApiProperty({ default: 'IT' })
  // @Transform(({ obj, key }) => {
  //   if (typeof obj[key] === 'string') return obj[key]?.split(',');
  //   return obj[key];
  // })
  topic: string;

  @IsString()
  @ApiProperty({ default: 'Question title here' })
  title: string;

  @IsString()
  @ApiProperty({ default: 'Question Details here ' })
  detail: string;

  @IsDefined()
  @ApiProperty({ default: ['VueJS', 'NodeJs'] })
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return obj[key]?.split(',');
    return obj[key];
  })
  tags: string[];

  @IsDefined()
  @ApiProperty({ default: ['Hindi', 'English'] })
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return obj[key]?.split(',');
    return obj[key];
  })
  languages: string[];

  //   @Type(() => SolutionChannelsDTO)
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return JSON.parse(obj[key]);
    return obj[key];
  })
  @IsDefined()
  //   @ValidateNested()
  @ApiProperty({
    default: {
      comments: true,
      chat: true,
      screenShare: true,
      audioCall: true,
      videoCall: false,
    },
    required: true,
  })
  solutionChannels!: SolutionChannelsDTO;

  @IsOptional()
  @ApiPropertyOptional({ type: String, format: 'binary' })
  video: string;

  @IsString()
  @ApiProperty({ default: 'Public' })
  scope: string;
}
