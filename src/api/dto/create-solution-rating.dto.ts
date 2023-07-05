import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateSolutionRatingDTO {
  @IsMongoId()
  @ApiProperty()
  questionId: string;

  @IsMongoId()
  @ApiProperty()
  questionerId: string;

  @IsMongoId()
  @ApiProperty()
  offererId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  solutionAttemptId: string;

  @ApiProperty()
  forOfferer: boolean;

  @ApiProperty()
  forQuestioner: boolean;

  @ApiProperty()
  markedSolved: boolean;

  @ApiProperty()
  solutionVideoBlob: Blob | null;

  @ApiProperty()
  videoText: string | null;
}
