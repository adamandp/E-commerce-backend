import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('E-commerce API')
  .setDescription('E-commerce API for creamy-cream')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
