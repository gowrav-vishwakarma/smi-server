import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserDocument } from 'src/api/schemas/user.schema';
import { UsersService } from 'src/api/users/users.service';
import { JwtPayload } from './dto/JwtPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userService.findUserByUsername(payload.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
