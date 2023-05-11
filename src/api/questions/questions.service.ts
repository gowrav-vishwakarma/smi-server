import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { filter, pipe } from 'rxjs';
import { CreateQuestionDTO } from '../dto/create-question.dto';
import { GetQuestionsDTO } from '../dto/question-filter-query.dto';
import { QuestionOfferSolutionDTO } from '../dto/question-offersolution.dto';
import { VoteQuestionDTO } from '../dto/vote-question.dto';
import { Comment } from '../schemas/comment.schema';
import { Question, QuestionDocument } from '../schemas/question.schema';
import {
  SolutionOffer,
  SolutionOfferDocument,
} from '../schemas/solutionoffer.schema';
import { UserDocument } from '../schemas/user.schema';
import { Vote, VoteDocument } from '../schemas/vote.schema';
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Vote.name)
    private readonly voteModel: Model<VoteDocument>,
    @InjectModel(SolutionOffer.name)
    private readonly offerModel: Model<SolutionOfferDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  async createQuestion(question: CreateQuestionDTO): Promise<QuestionDocument> {
    const createdQuestion = new this.questionModel(question);
    return await createdQuestion.save();
  }

  async searchQuestions(
    filterOptions: GetQuestionsDTO,
    user?: any,
    filterMyQuestionsOnly: boolean = false,
  ): Promise<QuestionDocument[] | any> {
    const { page = 1, sort = false } = filterOptions;
    const matchCondition = {};

    matchCondition['scope'] = 'Public';

    if (filterOptions.query) {
      const searchRegex = new RegExp('.*' + filterOptions.query + '.*', 'i');

      matchCondition['title'] = {
        $regex: searchRegex,
      };
    }

    if (filterOptions.topics && filterOptions.topics.length > 0) {
      matchCondition['topic'] = { $in: filterOptions.topics };
    }

    if (filterOptions.tags && filterOptions.tags.length) {
      matchCondition['tags'] = { $in: filterOptions.tags };
    }

    //  todo not saving languag in question
    if (filterOptions.languages && filterOptions.languages.length) {
      matchCondition['languages'] = { $in: filterOptions.tags };
    }

    // solution channels
    if (filterOptions.availableOnAudioCall) {
      matchCondition['solutionChannels.audioCall'] = true;
    }
    if (filterOptions.availableOnChatChannel) {
      matchCondition['solutionChannels.chat'] = true;
    }
    if (filterOptions.availableOnScreenShare) {
      matchCondition['solutionChannels.screenShare'] = true;
    }

    if (filterOptions.availableOnVideoCall) {
      matchCondition['solutionChannels.videoCall'] = true;
    }
    // end --- solution channels

    if (filterMyQuestionsOnly) {
      matchCondition['questionerId'] = user._id;
    }

    const pipeline = [];
    pipeline.push({ $match: matchCondition });
    if (user) {
      // Include my vode
      pipeline.push({
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'questionId',
          as: 'myVote',
          pipeline: [
            {
              $match: {
                userId: user._id,
              },
            },
            {
              $project: { vote: 1, _id: 0 },
            },
          ],
        },
      });

      pipeline.push({
        $set: {
          myVote: {
            $first: '$myVote',
          },
        },
      });

      // include my Offers
      pipeline.push({
        $lookup: {
          from: 'solutionoffers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'myOffer',
          pipeline: [
            {
              $match: {
                offererId: user._id,
              },
            },
            {
              $project: { notes: 1, _id: 0 },
            },
          ],
        },
      });

      pipeline.push({
        $set: {
          myOffer: {
            $first: '$myOffer',
          },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'questionerId',
        foreignField: '_id',
        as: 'byUser',
        pipeline: [
          {
            $project: {
              name: 1,
              // avatar: 1,
              languagesSpeaks: 1,
              reputationAsQuestioner: 1,
              post: 1,
              profileImage: 1,
            },
          },
        ],
      },
    });

    const limit = 10;
    pipeline.push({ $unwind: '$byUser' });
    pipeline.push({
      $skip: (page - 1) * limit,
    });
    pipeline.push({
      $limit: +limit,
    });

    const questions = await this.questionModel.aggregate(pipeline);

    return questions;
  }

  async getdetailedQuestion(
    id: string,
    user?: UserDocument,
  ): Promise<QuestionDocument> {
    const pipeline = [];

    pipeline.push({ $match: { _id: ObjectId(id) } });
    if (user) {
      // Include my vode
      pipeline.push({
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'questionId',
          as: 'myVote',
          pipeline: [
            {
              $match: {
                userId: user._id,
              },
            },
            {
              $project: { vote: 1, _id: 0 },
            },
          ],
        },
      });

      pipeline.push({
        $set: {
          myVote: {
            $first: '$myVote',
          },
        },
      });

      // include my Offers
      pipeline.push({
        $lookup: {
          from: 'solutionoffers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'myOffer',
          pipeline: [
            {
              $match: {
                offererId: user._id,
              },
            },
            {
              $project: { notes: 1, _id: 0 },
            },
          ],
        },
      });

      pipeline.push({
        $set: {
          myOffer: {
            $first: '$myOffer',
          },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'questionerId',
        foreignField: '_id',
        as: 'byUser',
        pipeline: [
          {
            $project: {
              name: 1,
              languagesSpeaks: 1,
              reputationAsQuestioner: 1,
            },
          },
        ],
      },
    });

    pipeline.push({ $unwind: '$byUser' });

    const questions = await this.questionModel.aggregate(pipeline);
    if (questions.length > 0) {
      return questions[0];
    } else {
      throw new NotFoundException('Question not found');
    }
  }

  async getQuestionOffers(questionId: string) {
    const offers = await this.offerModel.aggregate([
      { $match: { questionId: ObjectId(questionId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'offererId',
          foreignField: '_id',
          as: 'Offerer',
          pipeline: [
            {
              $project: { name: 1, ratingAsSolver: 1, post: 1 },
            },
          ],
        },
      },
      { $unwind: '$Offerer' },
    ]);

    return offers;
  }

  async getQuestionComments(questionId: string, user?: UserDocument) {
    const pipeline = [];

    pipeline.push({ $match: { questionId: ObjectId(questionId) } });

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'commenterId',
        foreignField: '_id',
        as: 'User',
        pipeline: [
          {
            $project: { name: 1, ratingAsSolver: 1, _id: 0 },
          },
        ],
      },
    });

    pipeline.push({ $unwind: '$User' });

    if (user) {
      // Include my vote
      pipeline.push({
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'commentId',
          as: 'myVote',
          pipeline: [
            {
              $match: {
                userId: user._id,
              },
            },
            {
              $project: { vote: 1, _id: 0 },
            },
          ],
        },
      });

      pipeline.push({
        $set: {
          myVote: {
            $first: '$myVote',
          },
        },
      });
    }

    const comments = await this.commentModel.aggregate(pipeline);

    return comments;
  }

  async voteQuestion(
    voteDto: VoteQuestionDTO,
    user: UserDocument,
  ): Promise<any> {
    const updateDetails = await this.voteModel.updateOne(
      {
        userId: user._id,
        questionId: voteDto.questionId,
      },
      {
        vote: voteDto.vote === 'up' ? 1 : -1,
      },
      { upsert: true },
    );

    // update vote up OR vote down only when either new vote OR changed from up to down
    let updateCount =
      (updateDetails.modifiedCount && updateDetails.matchedCount) ||
      updateDetails.upsertedCount;

    if (voteDto.vote === 'up' && updateCount) {
      await this.questionModel.updateOne(
        { _id: voteDto.questionId },
        {
          $inc: {
            'questionValue.totalVoteCount': 1,
            'questionValue.totalVoteDownCount': updateDetails.upsertedCount
              ? 0
              : -1,
          },
        },
        { returnOriginal: false },
      );
    }
    if (voteDto.vote === 'down' && updateCount) {
      await this.questionModel.updateOne(
        { _id: voteDto.questionId },
        {
          $inc: {
            'questionValue.totalVoteDownCount': 1,
            'questionValue.totalVoteCount': updateDetails.upsertedCount
              ? 0
              : -1,
          },
        },
      );
    }
    return updateDetails;
  }

  async offerSolution(offer: QuestionOfferSolutionDTO, user: UserDocument) {
    // intert into offers collection and increment question offer count
    const offerDetails = await this.offerModel.create({
      ...offer,
      offererId: user._id,
    });
    await this.questionModel.updateOne(
      { _id: offer.questionId },
      { $inc: { 'questionValue.totalOfferingCount': 1 } },
    );

    return offerDetails;
  }

  async updateVideoURL(qId: string, videoS3Path: string): Promise<any> {
    return await this.questionModel.updateOne(
      { _id: qId },
      {
        video: videoS3Path,
      },
    );
  }
}
