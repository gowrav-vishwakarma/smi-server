import { AuthGuard } from '@nestjs/passport';
import { JwtStrategyOptional } from './jwt-strategy-optional';

export class OptionalJwtAuthGuard extends AuthGuard(JwtStrategyOptional.name) {
  // Override handleRequest so it never throws an error
  handleRequest(err, user, info, context) {
    return user;
  }
}
