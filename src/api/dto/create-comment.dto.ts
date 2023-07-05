import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsString()
  @ApiProperty({ default: 'Comment here' })
  comment: string;

  @ApiProperty({ default: null })
  video: string | null;
}
