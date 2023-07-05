import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/api/schemas/user.schema';

export type SolutionAttemptedDocument = SolutionAttempted & Document;

export enum SolutionAttemptedStatus {
  ATTEMPTED = 'ATTEMPTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  SOLVED = 'SOLVED',
}

@Schema()
export class SolutionAttempted {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  questionId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  questionerId: string;

  @Prop({ required: true })
  questioner: mongoose.Schema.Types.Mixed;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  offererId: string;

  @Prop({ required: true })
  offerer: mongoose.Schema.Types.Mixed;

  @Prop({ required: false })
  notes: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({
    required: true,
    default: SolutionAttemptedStatus.ATTEMPTED,
    type: String,
  })
  status: string;

  @Prop({ required: false, default: Date.now() })
  solutionMeetingStardAt: Date;

  @Prop({ required: false, default: Date.now() })
  solutionMeetingFinishedAt: Date;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  ratingForSolver: number;

  @Prop({ required: false })
  ratingCommentForSolver: string;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  ratingForQuestioner: number;

  @Prop({ required: false })
  ratingCommentForQuestioner: string;

  // Virtual field
  public questionTitle?: string;
}

export const SolutionAttemptedSchema =
  SchemaFactory.createForClass(SolutionAttempted);
