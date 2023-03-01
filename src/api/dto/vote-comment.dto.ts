import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';

export class VoteCommentDTO {
  @IsMongoId()
  @ApiProperty()
  commentId: string;

  @IsEnum({ up: 'up', down: 'down' })
  @ApiProperty({
    type: String,
    default: 'up',
    enum: { up: 'up', down: 'down' },
  })
  vote: string;
}
