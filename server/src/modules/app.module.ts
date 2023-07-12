import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { JWTGuard } from 'src/other/guards/jwt.guard';
import { UserModule } from './user.module';
import { DatabaseModule } from './database.module';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        CLIENT_URL: Joi.string().required(),
        INTRA_API_UID: Joi.string().required(),
        INTRA_API_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      ignoreEnvFile: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JWTGuard,
    },
    AppService,
  ],
})
export class AppModule {}
