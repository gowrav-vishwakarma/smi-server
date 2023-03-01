import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';

export class VoteQuestionDTO {
  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsEnum({ up: 'up', down: 'down' })
  @ApiProperty({
    type: String,
    default: 'up',
    enum: { up: 'up', down: 'down' },
  })
  vote: string;
}
