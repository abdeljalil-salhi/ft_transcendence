import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  IJWTStrategyPayload,
  IJWTStrategyValidate,
} from './types/jwt.strategy';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: IJWTStrategyPayload): IJWTStrategyValidate {
    if (!payload.otp || !payload.sub)
      throw new HttpException('No OTP provided', HttpStatus.FORBIDDEN);
    return { userId: payload.sub };
  }
}
