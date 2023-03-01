import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/api/schemas/user.schema';
import { Question } from 'src/api/schemas/question.schema';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {
  @Prop({ required: true, default: 1 })
  vote: number;

  @Prop()
  remark: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  //for comment id
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  commentId: string;

  // for question id
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  })
  questionId: string;

  // for user id
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
