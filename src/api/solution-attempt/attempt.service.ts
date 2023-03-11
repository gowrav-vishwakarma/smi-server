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
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SolutionAttemptService {
  constructor(
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,

    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async createRating(ratingParams: CreateSolutionRatingDTO): Promise<any> {
    console.log('ratingParams', ratingParams);

    if (ratingParams.forOfferer && !ratingParams.forQuestioner) {
      await this.userModel.updateOne(
        { _id: ratingParams.offererId },
        {
          $inc: {
            'ratingAsSolver.totalOfferingCount': 1,
            'ratingAsSolver.totalRatingCount': 1,
            'ratingAsSolver.totalRatingSum': ratingParams.rating,
            'ratingAsSolver.totalAcceptedCount': 1,
          },
        },
      );

      return await this.solutionAttemptedModel.updateOne(
        {
          questionId: ratingParams.questionId,
          offererId: ratingParams.offererId,
          questionerId: ratingParams.questionerId,
          _id: ratingParams.solutionAttemptId,
        },
        {
          ratingForSolver: ratingParams.rating,
          ratingCommentForSolver: ratingParams.comment,
        },
      );
    } else {
      await this.userModel.updateOne(
        { _id: ratingParams.questionerId },
        {
          $inc: {
            'reputationAsQuestioner.totalMarkedSolved':
              ratingParams.markedSolved ? 1 : 0,
            'reputationAsQuestioner.totalRatingsCount': 1,
            'reputationAsQuestioner.totalRatingsSum': ratingParams.rating,
          },
        },
      );

      return await this.solutionAttemptedModel.updateOne(
        {
          questionId: ratingParams.questionId,
          offererId: ratingParams.offererId,
          questionerId: ratingParams.questionerId,
          _id: ratingParams.solutionAttemptId,
        },
        {
          ratingForQuestioner: ratingParams.rating,
          ratingCommentForQuestioner: ratingParams.comment,
        },
      );
    }

    // return await this.solutionAttemptedModel.findById(
    //   ratingParams.solutionAttemptId,
    // );
  }

  async detail(id: string): Promise<SolutionAttemptedDocument> {
    return await this.solutionAttemptedModel.findById(id);
  }
}
