import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateSolutionAttemptDTO } from '../dto/create-solution-attempt.dto';
import { CreateSolutionRatingDTO } from '../dto/create-solution-rating.dto';
import {
  SolutionAttempted,
  SolutionAttemptedDocument,
  SolutionAttemptedStatus,
} from '../schemas/solutionattempted.schema';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class SolutionAttemptService {
  constructor(
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,
  ) {}

  async createAttempt(
    solutionAttemp: CreateSolutionAttemptDTO,
  ): Promise<SolutionAttemptedDocument> {
    console.log(solutionAttemp);
    await this.solutionAttemptedModel.updateOne(
      {
        questionId: solutionAttemp.questionId,
        offererId: solutionAttemp.offererId,
        questionerId: solutionAttemp.questionerId,
      },
      {
        questioner: solutionAttemp.questioner,
        offerer: solutionAttemp.offerer,
        notes: solutionAttemp.notes,
      },
      { upsert: true },
    );

    const newAttempt = await this.solutionAttemptedModel.findOne({
      questionId: solutionAttemp.questionId,
      offererId: solutionAttemp.offererId,
    });

    return newAttempt;
  }

  async creatingRating(
    ratingParams: CreateSolutionRatingDTO,
  ): Promise<SolutionAttemptedDocument> {
    return await this.solutionAttemptedModel.findById(
      ratingParams.solutionAttemptId,
    );
  }
}
