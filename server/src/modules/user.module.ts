import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { Connection } from 'src/entities/connection.entity';
import { Avatar } from 'src/entities/avatar.entity';
import { ConnectionService } from 'src/services/connection.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Connection, Avatar])],
  controllers: [UserController],
  providers: [UserService, ConnectionService],
  exports: [UserService, ConnectionService],
})
export class UserModule {}
