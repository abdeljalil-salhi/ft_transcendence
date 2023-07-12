import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from 'src/services/auth.service';
import { JWTStrategy } from 'src/other/strategies/jwt.strategy';
import { AuthController } from 'src/controllers/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [JWTStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
