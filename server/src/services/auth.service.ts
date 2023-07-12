import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from '2fa-util';
import { IncomingMessage } from 'http';
import * as https from 'https';

import { UserService } from './user.service';
import { ConnectionService } from './connection.service';
import { Connection } from 'src/entities/connection.entity';
import { IJWTStrategyPayload } from 'src/other/strategies/types/jwt.strategy';
import { Intra42Profile } from 'src/other/interfaces/intra42.interface';
import { User } from 'src/entities/user.entity';

const download = (url: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res: IncomingMessage) => {
        const data = [];
        res
          .on('data', (chunk) => data.push(chunk))
          .on('end', () => resolve(Buffer.concat(data)));
      })
      .on('error', (err: Error) => reject(err));
  });

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

  async login(data: Intra42Profile): Promise<string> {
    let connection: Connection = await this.connectionService
      .getConnection({
        Intra42Id: data.id,
      })
      .catch(() => null);
    if (!connection) {
      const user: User = await this.userService.createUser();
      connection = await this.connectionService.createConnection(user.id);
      await this.connectionService.updateConnection(connection.id, {
        Intra42Id: data.id,
      });
      if (data.photos) {
        const avatar = await download(data.photos[0].value);
        await this.userService.updateUserAvatar(user.id, {
          originalname: 'avatar.jpg',
          buffer: avatar,
        } as Express.Multer.File);
      }
    }
    return this.generateToken(connection.id, !connection.OTP);
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
