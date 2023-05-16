import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SolutionOffer,
  SolutionOfferDocument,
} from '../schemas/solutionoffer.schema';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(SolutionOffer.name)
    private readonly solutionOfferModel: Model<SolutionOfferDocument>,
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
    return await this.solutionOfferModel.deleteOne({
      _id: id,
      offererId: user._id,
    });
  }
}
