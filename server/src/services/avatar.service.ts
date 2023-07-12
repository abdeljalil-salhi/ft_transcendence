import { Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';

import { Avatar } from 'src/entities/avatar.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatarRepository: Repository<Avatar>
  ) {}

  async createAvatar(url: string, data: Buffer, user: User): Promise<Avatar> {
    const avatar: Avatar = this.avatarRepository.create({
      url,
      data,
      user,
    });
    try {
      await this.avatarRepository.save(avatar);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return avatar;
  }

  async deleteAvatar(avatarId: number): Promise<void> {
    try {
      await this.avatarRepository.delete(avatarId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  convertToStreamableFile(data: Buffer): StreamableFile {
    return new StreamableFile(Readable.from(data));
  }
}
