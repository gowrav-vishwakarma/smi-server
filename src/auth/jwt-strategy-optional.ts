import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserDocument } from 'src/api/schemas/user.schema';
import { UsersService } from 'src/api/users/users.service';
import { JwtPayload } from './dto/JwtPayload.dto';

@Injectable()
export class JwtStrategyOptional extends PassportStrategy(
  Strategy,
  'JwtStrategyOptional',
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument | false> {
    const user = await this.userService.findUserByUsername(payload.username);
    if (!user) return false;
    return user;
  }
}
