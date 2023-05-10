import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetQuestionsDTO {
  @IsOptional()
  @ApiPropertyOptional({ default: ['IT', 'Media'] })
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return obj[key]?.split(',');
    return obj[key];
  })
  topics: string[];

  @IsOptional()
  @ApiPropertyOptional({ default: ['VueJS', 'NodeJs'] })
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return obj[key]?.split(',');
    return obj[key];
  })
  tags: string[];

  @IsOptional()
  @ApiPropertyOptional({ default: ['Hindi', 'English'] })
  @Transform(({ obj, key }) => {
    if (typeof obj[key] === 'string') return obj[key]?.split(',');
    return obj[key];
  })
  languages: string[];

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsBoolean()
  // @Transform(({ obj, key }) => obj[key] === 'true')
  // @Type(() => Boolean)
  hasComments: boolean;

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsBoolean()
  // @Transform(({ obj, key }) => obj[key] === 'true')
  availableOnChatChannel: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: null })
  // @Transform(({ obj, key }) => obj[key] === 'true')
  availableOnScreenShare: boolean;

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsBoolean()
  // @Transform(({ obj, key }) => obj[key] === 'true')
  availableOnVideoCall: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: null })
  // @Transform(({ obj, key }) => obj[key] === 'true')
  availableOnAudioCall: boolean;

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsNumber()
  page: number;

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsString()
  sort: string;

  @IsOptional()
  @ApiPropertyOptional({ default: null })
  @IsString()
  query: string;
}
