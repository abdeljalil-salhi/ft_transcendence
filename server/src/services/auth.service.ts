import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IJWTStrategyPayload } from 'src/other/strategies/types/jwt.strategy';

@Injectable()
export class AuthService {
  private secrets: Map<number, string> = new Map<number, string>();

  constructor(private readonly JWTService: JwtService) {}

  generateToken(userId: number, OTP = true): string {
    return this.JWTService.sign({ sub: userId, otp: OTP });
  }

  verifyToken(token: string): IJWTStrategyPayload | null {
    // The JWTService.verify() method throws an error if the token is invalid.
    try {
      return this.JWTService.verify(token);
    } catch (err: unknown) {
      return null;
    }
  }
}
