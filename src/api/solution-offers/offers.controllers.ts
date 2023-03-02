import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { SolutionOfferDocument } from '../schemas/solutionoffer.schema';
import { UserDocument } from '../schemas/user.schema';
import { OffersService } from './offers.service';

@Controller('offers')
@ApiTags('Offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('my-offers')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getAllMySolutions(
    @GetUser() user: UserDocument,
  ): Promise<SolutionOfferDocument[]> {
    return this.offersService.getAllSolutions(user);
  }
}
