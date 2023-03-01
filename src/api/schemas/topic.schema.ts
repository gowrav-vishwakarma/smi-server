import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  description: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

TopicSchema.index({ name: 1 }, { unique: true });
