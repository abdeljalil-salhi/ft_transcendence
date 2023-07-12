import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';

import { CLIENT_URL, PORT } from './constants';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CLIENT_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const openAPI: OpenAPIObject = JSON.parse(
    readFileSync(join(__dirname, '../openapi/settings.json'), 'utf8')
  );
  SwaggerModule.setup('api', app, openAPI, {
    customCss: readFileSync(join(__dirname, '../openapi/custom.css'), 'utf8'),
  });

  await app.listen(PORT);
}

bootstrap().catch((err: Error) => {
  console.error(err);
});
