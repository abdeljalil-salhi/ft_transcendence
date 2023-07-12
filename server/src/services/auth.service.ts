import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from '2fa-util';

import { UserService } from './user.service';
import { ConnectionService } from './connection.service';
import { Connection } from 'src/entities/connection.entity';
import { IJWTStrategyPayload } from 'src/other/strategies/types/jwt.strategy';

@Injectable()
export class AuthService {
  private secrets: Map<number, string> = new Map<number, string>();

  constructor(
    private readonly JWTService: JwtService,
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService
  ) {}

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

  async verifyOTP(userId: number, OTP: string, secret?: string): Promise<void> {
    if (!secret) {
      const connection: Connection = await this.connectionService.getConnection(
        { user: userId },
        []
      );
      secret = connection.OTP;
    }
    if (!secret) throw new HttpException('No OTP secret', HttpStatus.NOT_FOUND);
    const verified = await verify(OTP, secret);
    if (!verified) throw new HttpException('Invalid OTP', HttpStatus.FORBIDDEN);
  }

  async loginOTP(token: string, OTP: string): Promise<string> {
    const payload: IJWTStrategyPayload = this.verifyToken(token);
    if (!payload)
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    if (payload.otp)
      throw new HttpException('Already connected', HttpStatus.CONFLICT);
    await this.verifyOTP(payload.sub, OTP);
    return this.generateToken(payload.sub, true);
  }
}
