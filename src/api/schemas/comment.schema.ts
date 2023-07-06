import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/api/schemas/user.schema';
import { Question } from 'src/api/schemas/question.schema';

export type CommentDocument = Comment & Document;

@Schema({ _id: false })
class commentValue {
  @Prop({ required: true, default: 0 })
  totalVoteCount: number;

  @Prop({ required: true, default: 0 })
  totalVoteDownCount: number;
}

const commentValueDefault = {
  totalVoteCount: 0,
  totalVoteDownCount: 0,
};

@Schema()
export class Comment {
  @Prop({ required: true })
  comment: string;

  @Prop(
    raw({ type: commentValue, required: true, default: commentValueDefault }),
  )
  commentValue: Record<string, any>;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  })
  questionId: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question' })
  // question: Question;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  commenterId: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // commenter: User;

  @Prop({ required: false })
  video: string;

  @Prop({ required: true, default: false })
  isQuestionSolved: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
