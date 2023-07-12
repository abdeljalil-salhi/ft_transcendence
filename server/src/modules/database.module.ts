import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { POSTGRES_LOGGING } from 'src/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: POSTGRES_LOGGING,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
