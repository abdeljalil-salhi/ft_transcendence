import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/services/auth.service';
import { Public } from 'src/other/decorators/public.decorator';
import { Request } from 'src/other/interfaces/request.interface';
import { Intra42Guard } from 'src/other/guards/intra42.guard';
import { Intra42Profile } from 'src/other/interfaces/intra42.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('jwt')
  jwt(@Req() req: Request): boolean {
    if (!req.headers.authorization) return false;
    const token = req.headers.authorization.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    return !!payload;
  }

  @Public()
  @UseGuards(Intra42Guard)
  @Get('42/callback')
  async login(@Req() req: Request, @Req() response: Response): Promise<void> {
    const token: string = await this.authService.login(
      req.user as unknown as Intra42Profile
    );
    const url: URL = new URL(`${req.protocol}:${req.hostname}`);
    url.port = process.env.CLIENT_PORT;
    url.pathname = 'login';
    url.searchParams.set('token', token);
    response.status(302).redirect(url.href);
  }

  @Public()
  @Post('otp')
  loginOTP(
    @Body('token') token: string,
    @Body('OTP') OTP: string
  ): Promise<string> {
    return this.authService.loginOTP(token, OTP);
  }
}
