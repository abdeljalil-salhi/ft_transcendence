import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';

import { User } from 'src/entities/user.entity';
import { Avatar } from 'src/entities/avatar.entity';
import { UserService } from 'src/services/user.service';
import { AvatarService } from 'src/services/avatar.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService
  ) {}

  @Get('/')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('/:id/avatar')
  async getUserAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const avatar: Avatar = await this.userService.getUserAvatar(id);
    response.set({
      'Content-Disposition': `inline; filename=${avatar.url}`,
      'Content-Type': 'image/*',
    });
    return this.avatarService.convertToStreamableFile(avatar.data);
  }
}
