import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export enum UserOnlineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
}

export enum AccountTypes {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  AGENCY = 'AGENCY',
  ADMIN = 'ADMIN',
}

export enum StatusType {
  REGISTERED = 'REGISTERED',
  Active = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ _id: false })
class questionerRaputation {
  @Prop({ type: Number, default: 0 })
  totalQuestionsAsked: number;

  @Prop({ type: Number, default: 0 })
  totalMarkedSolved: number;

  @Prop({ type: Number, default: 0 })
  totalRatingsCount: number;

  @Prop({ type: Number, default: 0 })
  totalRatingsSum: number;
}

const questionerRaputationDefaults = {
  totalQuestionsAsked: 0,
  totalMarkedSolved: 0,
  totalRatingsCount: 0,
  totalRatingsSum: 0,
};

@Schema({ _id: false })
class solverRating {
  @Prop({ type: Number, default: 0 })
  totalOfferingCount: number;

  @Prop({ type: Number, default: 0 })
  totalRatingCount: number;

  @Prop({ type: Number, default: 0 })
  totalRatingSum: number;

  @Prop({ type: Number, default: 0 })
  totalCommentsCount: number;

  @Prop({ type: Number, default: 0 })
  totalCommentsVoteCount: number;

  @Prop({ type: Number, default: 0 })
  totalAcceptedCount: number;
}

const solverRatingDefaults = {
  totalOfferingCount: 0,
  totalRatingCount: 0,
  totalRatingSum: 0,
  totalCommentsCount: 0,
  totalCommentsVoteCount: 0,
  totalAcceptedCount: 0,
};

@Schema({ _id: false })
class asFollowersType {
  @Prop({ type: Number, default: 0 })
  totalFollowers: number;

  @Prop({ type: [], default: [] })
  userFollowersIds: String[];
}

const asFollowersDefaults = {
  totalFollowers: 0,
  userFollowersIds: [],
};

@Schema({ _id: false })
class asFollowingType {
  @Prop({ type: Number, default: 0 })
  totalFollowing: number;

  @Prop({ type: [], default: [] })
  userFollowingIds: String[];
}

const asFollowingDefaults = {
  totalFollowers: 0,
  userFollowingIds: [],
};

@Schema()
class experienceType extends Document {
  // @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  // _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  post: string;

  @Prop({ type: Date })
  from: Date;

  @Prop({ type: String })
  to: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  jobType: string;

  @Prop({ type: String })
  role: string;

  @Prop({ type: String })
  description: string;
}

export const experienceSchema = SchemaFactory.createForClass(experienceType);

@Schema({ _id: false })
class socialProfileType {
  @Prop({ type: String, default: null })
  LinkedIn: string;

  @Prop({ type: String, default: null })
  Facebook: string;

  @Prop({ type: String, default: null })
  Instagram: string;

  @Prop({ type: String, default: null })
  Pinterest: string;

  @Prop({ type: String, default: null })
  Quora: string;

  @Prop({ type: String, default: null })
  Stackoverflow: string;

  @Prop({ type: String, default: null })
  Website: string;
}

const socialProfileDefaults = {
  LinkedIn: null,
  Facebook: null,
  Instagram: null,
  Pinterest: null,
  Quora: null,
  Stackoverflow: null,
  Website: null,
};

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  contactNo: string;

  @Prop({ required: false, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  languagesSpeaks: string[];

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({
    required: true,
    enum: UserOnlineStatus,
    default: UserOnlineStatus.OFFLINE,
  })
  onlineStatus: string;

  @Prop({
    required: false,
    enum: AccountTypes,
    default: AccountTypes.INDIVIDUAL,
  })
  accountType: string;

  @Prop({
    required: false,
    enum: StatusType,
    default: StatusType.REGISTERED,
  })
  status: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: false })
  profileImage: string;

  @Prop({ required: false })
  coverImage: string;

  @Prop({ required: false })
  topicsInterestedIn: string[];

  @Prop(
    raw({
      type: questionerRaputation,
      required: true,
      default: questionerRaputationDefaults,
    }),
  )
  reputationAsQuestioner: Record<string, any>;

  @Prop(
    raw({ type: solverRating, required: true, default: solverRatingDefaults }),
  )
  ratingAsSolver: Record<string, any>;

  @Prop(
    raw({
      type: asFollowersType,
      required: true,
      default: asFollowersDefaults,
    }),
  )
  asFollowers: Record<string, any>;

  @Prop(
    raw({
      type: asFollowingType,
      required: true,
      default: asFollowingDefaults,
    }),
  )
  asFollowing: Record<string, any>;

  // @Prop(
  //   // raw(
  //   {
  //     type: experienceSchema,
  //     default: [],
  //   },
  //   // ),
  // )
  // experiences: experienceType[] = [];
  // experiences: Record<string, any> = [];
  @Prop({ type: [experienceSchema], default: [] })
  experiences: experienceType[];

  @Prop({ type: [], default: [] })
  skills: String[]; //as topic data

  @Prop(raw({ type: socialProfileType, default: socialProfileDefaults }))
  socialProfile: Record<string, any>;

  @Prop({ type: String })
  post: string;

  @Prop({ type: String })
  jobType: string;
}

// export const ExperienceType = SchemaFactory.createForClass(experienceType);
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  this.username = this.email;
  next();
});
