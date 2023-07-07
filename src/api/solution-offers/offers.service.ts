import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SolutionOffer,
  SolutionOfferDocument,
} from '../schemas/solutionoffer.schema';
import { UserDocument } from '../schemas/user.schema';
import {
  SolutionAttempted,
  SolutionAttemptedDocument,
} from '../schemas/solutionattempted.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(SolutionOffer.name)
    private readonly solutionOfferModel: Model<SolutionOfferDocument>,
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,
  ) {}

  async getAllSolutions(user: UserDocument): Promise<SolutionOfferDocument[]> {
    return await this.solutionOfferModel
      .find({
        offererId: user._id,
      })
      .populate('questionId') // Populate the question field
      .populate('questionerId', '-password'); // Populate the questionerId field and exclude the password field
  }

  async removeSolutionOffer(id: string, user: UserDocument): Promise<any> {
    // load the solution Offer first
    // get its questionId and offererId then delete the solutionAttempted based on these two fields
    const solutionOffer = await this.solutionOfferModel.findOne({
      _id: id,
      offererId: user._id,
    });

    if (solutionOffer) {
      await this.solutionAttemptedModel.deleteOne({
        questionId: solutionOffer.questionId,
        offererId: solutionOffer.offererId,
      });
    }

    return await this.solutionOfferModel.deleteOne({
      _id: id,
      offererId: user._id,
    });
  }

  async getUnreadOffers(
    countOnly: boolean,
    showReadOffers: boolean,
    user: UserDocument,
  ): Promise<any> {
    if (countOnly) {
      return this.solutionOfferModel.countDocuments({
        questionerId: user._id,
        isRead: showReadOffers,
      });
    } else {
      return this.solutionOfferModel
        .find({
          questionerId: user._id,
          isRead: showReadOffers,
        })
        .sort({ createdAt: -1 })
        .populate('questionId') // Populate the question field
        .populate('offererId', '-password'); // Populate the offererId field and exclude the password field
    }
  }

  async markOfferRead(
    offerId: string,
    readStatus: boolean,
    user: UserDocument,
  ): Promise<any> {
    return await this.solutionOfferModel.updateOne(
      {
        _id: offerId,
        questionerId: user._id,
      },
      {
        isRead: readStatus,
      },
    );
  }
}
