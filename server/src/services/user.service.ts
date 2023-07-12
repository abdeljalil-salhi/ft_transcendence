import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/entities/avatar.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly avatarService: AvatarService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(userId: number, relations = [] as string[]): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
      relations,
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(): Promise<User> {
    const user: User = this.userRepository.create();
    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserAvatar(userId: number): Promise<Avatar> {
    const user: User = await this.getUser(userId, ['avatar']);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    else if (!user.avatar)
      throw new HttpException('User has no avatar', HttpStatus.NOT_FOUND);
    return user.avatar;
  }
}
