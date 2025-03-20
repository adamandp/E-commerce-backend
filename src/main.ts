import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET_KEY')));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap().catch(console.error);
