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

  @ApiProperty()
  questioner: {
    name: string;
    email: string;
  };

  @ApiProperty()
  offerer: {
    name: string;
    ratingAsSolver: {
      totalOfferingCount: number;
      totalRatingCount: number;
      totalRatingSum: number;
      totalCommentsCount: number;
      totalCommentsVoteCount: number;
      totalAcceptedCount: number;
    };
  };

  @ApiProperty()
  notes: string;

  @ApiProperty()
  offerId: string;
}
