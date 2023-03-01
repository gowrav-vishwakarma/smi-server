import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateSolutionAttemptDTO {
  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsMongoId()
  @ApiProperty()
  questionerId: string;

  @IsMongoId()
  @ApiProperty()
  offererId: string;
}
