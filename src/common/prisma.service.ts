import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(private readonly logger: Logger) {
    super({
      log: [
        // { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  onModuleInit() {
    this.$on('info', (e) => {
      this.logger.log({ message: e.message });
    });
    this.$on('warn', (e) => {
      this.logger.warn({ message: e.message });
    });
    this.$on('error', (e) => {
      this.logger.error({ message: e.message });
    });
    this.$on('query', (e) => {
      this.logger.debug({
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });
  }
}
