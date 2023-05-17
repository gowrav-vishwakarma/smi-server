import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  offererId?: string;
}
