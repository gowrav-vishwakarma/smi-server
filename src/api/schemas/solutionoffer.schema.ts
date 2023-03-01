import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Question } from 'src/api/schemas/question.schema';

export type SolutionOfferDocument = SolutionOffer & Document;

@Schema({ _id: false })
class offerValue {
  @Prop({ type: Number, default: 0 })
  totalAttemptedCount: number;

  @Prop({ type: Number, default: 0 })
  totalAcceptedCount: number;

  @Prop({ type: Number, default: 0 })
  totalRejectedCount: number;

  @Prop({ type: Number, default: 0 })
  totalRatingsSum: number;

  @Prop({ type: Number, default: 0 })
  totalRatingsCount: number;
}

const offerValueDefault = {
  totalAttemptedCount: 0,
  totalAcceptedCount: 0,
  totalRejectedCount: 0,
  totalRatingsSum: 0,
  totalRatingsCount: 0,
};

@Schema()
export class SolutionOffer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  questionId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question' })
  question: Question;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  questionerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  offererId: string;

  @Prop({ required: false })
  notes: string;

  @Prop({ required: true })
  solutionChannel: [];

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop(raw({ type: offerValue, required: true, default: offerValueDefault }))
  offerValue: Record<string, any>;
}

export const SolutionOfferSchema = SchemaFactory.createForClass(SolutionOffer);
