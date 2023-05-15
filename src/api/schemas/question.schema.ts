import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/api/schemas/user.schema';

export type QuestionDocument = Question & Document;

export enum QuestionScope {
  Private = 'Private',
  Public = 'Public',
  Organization = 'Organization',
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SOLVED = 'SOLVED',
}

// defines quesitions value in the system
@Schema({ _id: false })
class questionValue {
  @Prop({ required: true, default: 0 })
  totalOfferingCount: number;
  @Prop({ required: true, default: 0 })
  totalVoteCount: number;
  @Prop({ required: true, default: 0 })
  totalVoteDownCount: number;
  @Prop({ required: true, default: 0 })
  totalCommentsCount: number;
  @Prop({ required: true, default: 0 })
  totalSolutionAttemptsCount: number;
}

const questionValueDefault = {
  totalOfferingCount: 0,
  totalVoteCount: 0,
  totalVoteDownCount: 0,
  totalCommentsCount: 0,
  totalSolutionAttemptsCount: 0,
};

// defines questions possible solutions channels
@Schema({ _id: false })
class solutionChannels {
  @Prop({ required: true, default: true })
  comments: boolean;
  @Prop({ required: true, default: true })
  chat: boolean;
  @Prop({ required: true, default: true })
  screenShare: boolean;
  @Prop({ required: true, default: true })
  audioCall: boolean;
  @Prop({ required: true, default: true })
  videoCall: boolean;
}

const solutionChannelsDefaults = {
  comments: true,
  chat: true,
  screenShare: true,
  audioCall: true,
  videoCall: true,
};

@Schema()
export class Question {
  @Prop({ required: true })
  topic: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  detail: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: false })
  video: string;

  @Prop({
    required: true,
    enum: QuestionStatus,
    default: QuestionStatus.OPEN,
  })
  status: string;

  @Prop({
    required: true,
    enum: QuestionScope,
    default: QuestionScope.Public,
  })
  scope: string;

  @Prop(raw({ type: solutionChannels, default: solutionChannelsDefaults }))
  solutionChannels: Record<string, any>;

  @Prop(
    raw({ type: questionValue, required: true, default: questionValueDefault }),
  )
  questionValue: Record<string, any>;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  questionerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  questioner: User;

  // @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Comment' })
  // comments: mongoose.Schema.Types.ObjectId[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
