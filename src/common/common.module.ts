import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { loggerOptions } from '../config/logger.config';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
