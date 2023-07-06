import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateSolutionAttemptDTO } from '../dto/create-solution-attempt.dto';
import { CreateSolutionRatingDTO } from '../dto/create-solution-rating.dto';
import {
  SolutionAttempted,
  SolutionAttemptedDocument,
  SolutionAttemptedStatus,
} from '../schemas/solutionattempted.schema';
import { User, UserDocument } from '../schemas/user.schema';
import {
  Question,
  QuestionDocument,
  QuestionStatus,
} from '../schemas/question.schema';

import {
  SolutionOffer,
  SolutionOfferDocument,
} from '../schemas/solutionoffer.schema';

@Injectable()
export class SolutionAttemptService {
  constructor(
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(SolutionOffer.name)
    private readonly SolutionOfferModel: Model<SolutionOfferDocument>,
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
        offerId: solutionAttemp.offerId,
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
    let userUpdate: any = {};
    let solutionUpdate: any = {};

    if (ratingParams.forOfferer && !ratingParams.forQuestioner) {
      userUpdate = {
        $inc: {
          'ratingAsSolver.totalOfferingCount': 1,
          'ratingAsSolver.totalRatingCount': 1,
          'ratingAsSolver.totalRatingSum': ratingParams.rating,
          'ratingAsSolver.totalAcceptedCount': ratingParams.markedSolved
            ? 1
            : 0,
        },
      };

      solutionUpdate = {
        ratingForSolver: ratingParams.rating,
        ratingCommentForSolver: ratingParams.comment,
      };
    } else {
      userUpdate = {
        $inc: {
          'reputationAsQuestioner.totalMarkedSolved': ratingParams.markedSolved
            ? 1
            : 0,
          'reputationAsQuestioner.totalRatingsCount': 1,
          'reputationAsQuestioner.totalRatingsSum': ratingParams.rating,
        },
      };

      await this.questionModel.updateOne(
        { _id: ratingParams.questionId },
        {
          status: QuestionStatus.SOLVED,
        },
      );

      solutionUpdate = {
        ratingForQuestioner: ratingParams.rating,
        ratingCommentForQuestioner: ratingParams.comment,
        status: SolutionAttemptedStatus.SOLVED,
      };
    }

    await this.userModel.updateOne({ _id: ratingParams.offererId }, userUpdate);

    if (ratingParams.offerId) {
      await this.SolutionOfferModel.updateOne(
        { _id: ratingParams.offerId },
        { isQuestionSolved: true },
      );
    }

    return this.solutionAttemptedModel.updateOne(
      {
        questionId: ratingParams.questionId,
        offererId: ratingParams.offererId,
        questionerId: ratingParams.questionerId,
        _id: ratingParams.solutionAttemptId,
      },
      solutionUpdate,
    );
  }

  async mySolutionAttempt(id: string): Promise<SolutionAttemptedDocument[]> {
    return this.solutionAttemptedModel
      .aggregate([
        {
          $match: {
            offererId: new Types.ObjectId(id) as any,
          },
        },
        {
          $lookup: {
            from: 'questions', // Replace with the actual name of the Question collection
            localField: 'questionId',
            foreignField: '_id',
            as: 'question',
          },
        },
        {
          $addFields: {
            questionTitle: {
              $arrayElemAt: ['$question.title', 0],
            },
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort by 'createdAt' field in descending order (latest first)
          },
        },
        {
          $limit: 20, // Limit the result to 20 documents
        },
      ])
      .exec();
  }

  async detail(id: string): Promise<SolutionAttemptedDocument> {
    return await this.solutionAttemptedModel.findById(id);
  }
}
