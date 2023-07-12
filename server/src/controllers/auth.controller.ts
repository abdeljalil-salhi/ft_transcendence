import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AuthService } from 'src/services/auth.service';
import { Public } from 'src/other/decorators/public.decorator';
import { Request } from 'src/other/interfaces/request.interface';

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
  @Post('otp')
  loginOTP(
    @Body('token') token: string,
    @Body('code') code: string
  ): Promise<string> {
    return this.authService.loginOTP(token, code);
  }
}
