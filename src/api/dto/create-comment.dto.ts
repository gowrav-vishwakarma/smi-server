import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsString()
  @ApiProperty({ default: 'Comment here' })
  comment: string;

  @ApiProperty({ default: null })
  video: string | null;

  @IsBoolean()
  @ApiProperty({ default: false })
  isQuestionSolved: boolean;
}
