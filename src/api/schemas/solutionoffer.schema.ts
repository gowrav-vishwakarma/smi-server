import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

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
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  })
  questionId: string;

  @Prop({ required: true })
  questionTitle: string;
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question' })
  // question: Question;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  questionerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  offererId: string;

  @Prop({ required: false })
  notes: string;

  @Prop({ required: true })
  solutionChannel: string[];

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: true, default: false })
  isQuestionSolved: boolean;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop(raw({ type: offerValue, required: true, default: offerValueDefault }))
  offerValue: Record<string, any>;
}

const SolutionOfferSchema = SchemaFactory.createForClass(SolutionOffer);
SolutionOfferSchema.index({ offererId: 1, questionId: 1 }, { unique: true });
export { SolutionOfferSchema };
