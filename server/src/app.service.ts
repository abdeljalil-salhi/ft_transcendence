import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPinged(): string {
    return 'Server up and running...';
  }
}
