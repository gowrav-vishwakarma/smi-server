import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { VoteCommentDTO } from '../dto/vote-comment.dto';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { UserDocument } from '../schemas/user.schema';
import { Vote, VoteDocument } from '../schemas/vote.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Vote.name)
    private readonly voteModel: Model<VoteDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDTO,
    user: UserDocument,
  ): Promise<CommentDocument> {
    const commentData = {
      ...createCommentDto,
      commenterId: user._id,
    };
    return await this.commentModel.create(commentData);
  }

  getComments(questionId: string) {
    return 'TODO';
  }

  async voteCommentQuestion(
    voteDto: VoteCommentDTO,
    user: UserDocument,
  ): Promise<any> {
    const updateDetails = await this.voteModel.updateOne(
      {
        userId: user._id,
        commentId: voteDto.commentId,
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
      await this.commentModel.updateOne(
        { _id: voteDto.commentId },
        {
          $inc: {
            'commentValue.totalVoteCount': 1,
            'commentValue.totalVoteDownCount': updateDetails.upsertedCount
              ? 0
              : 1,
          },
        },
      );
    }
    if (voteDto.vote === 'down' && updateCount) {
      await this.commentModel.updateOne(
        { _id: voteDto.commentId },
        {
          $inc: {
            'commentValue.totalVoteDownCount': -1,
            'commentValue.totalVoteCount': updateDetails.upsertedCount ? 0 : -1,
          },
        },
      );
    }
    return updateDetails;
  }

  async getAllMyComments(user: UserDocument): Promise<any> {
    return await this.commentModel.find({
      commenterId: user._id,
    });
  }
}
