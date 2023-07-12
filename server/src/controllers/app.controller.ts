import { Controller, Get } from '@nestjs/common';

import { AppService } from 'src/services/app.service';
import { Public } from 'src/other/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getPing(): string {
    return this.appService.getPing();
  }
}
