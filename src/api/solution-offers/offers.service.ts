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
    return await this.solutionOfferModel.find({
      offererId: user._id,
    });
  }
}
