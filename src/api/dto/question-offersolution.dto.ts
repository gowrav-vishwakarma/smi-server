import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QuestionOfferSolutionDTO {
  @IsMongoId()
  @ApiProperty()
  questionerId: string;

  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsString()
  @ApiProperty()
  questionTitle: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: 'Intersted in this question',
  })
  notes: string;

  @IsArray()
  @ApiProperty({
    type: [],
    default: [],
  })
  solutionChannel: [];

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    default: '',
  })
  offererId: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean, default: false })
  isQuestionSolved: boolean;
}
