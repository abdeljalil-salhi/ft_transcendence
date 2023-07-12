import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

import { AuthService } from 'src/services/auth.service';
import { Intra42Profile } from '../interfaces/intra42.interface';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.INTRA_API_UID,
      clientSecret: process.env.INTRA_API_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
      scope: 'public',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Intra42Profile
  ): Intra42Profile {
    return profile;
  }
}
