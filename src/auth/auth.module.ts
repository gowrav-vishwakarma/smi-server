import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiModule } from 'src/api/api.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { JwtStrategyOptional } from './jwt-strategy-optional';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    forwardRef(() => ApiModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtStrategyOptional],
  exports: [JwtStrategy, JwtStrategyOptional, PassportModule],
})
export class AuthModule {}
