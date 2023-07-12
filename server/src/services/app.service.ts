import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPing(): string {
    return 'Server up and running...';
  }
}
