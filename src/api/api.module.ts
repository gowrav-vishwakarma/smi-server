import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/questions.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { QuestionSchema } from './schemas/question.schema';
import { CommentSchema } from './schemas/comment.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MediaService } from './media/media.service';
import { MediaController } from './media/media.controller';
import { VoteSchema } from './schemas/vote.schema';
import { ConfigModule } from '@nestjs/config';
import { SolutionOfferSchema } from './schemas/solutionoffer.schema';
import { OffersController } from './solution-offers/offers.controllers';
import { OffersService } from './solution-offers/offers.service';
import { SolutionAttemptController } from './solution-attempt/attempt.controllers';
import { SolutionAttemptService } from './solution-attempt/attempt.service';
import { SolutionAttemptedSchema } from './schemas/solutionattempted.schema';
import { TopicSchema } from './schemas/topic.schema';
import { TopicsController } from './topic/topics.controller';
import { TopicsService } from './topic/topics.service';
import { MailerController } from './email/email.controller';
import { MailerService } from './email/email.service';
import { WsGateway } from 'src/ws/ws.gateway';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Vote', schema: VoteSchema },
      { name: 'SolutionOffer', schema: SolutionOfferSchema },
      { name: 'SolutionAttempted', schema: SolutionAttemptedSchema },
      { name: 'Topic', schema: TopicSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => AppModule),
    ConfigModule,
  ],
  controllers: [
    QuestionsController,
    CommentsController,
    UsersController,
    MediaController,
    OffersController,
    SolutionAttemptController,
    TopicsController,
    MailerController,
  ],
  providers: [
    QuestionsService,
    CommentsService,
    UsersService,
    MediaService,
    OffersService,
    SolutionAttemptService,
    TopicsService,
    MailerService,
  ],
  exports: [UsersService, MongooseModule, MailerService],
})
export class ApiModule {}
