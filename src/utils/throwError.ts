import { Logger, HttpException } from '@nestjs/common';

export function throwError(
  message: string,
  ExceptionType: new (msg: string) => HttpException,
): never {
  const stack = new Error().stack?.split('\n')[2] || 'UnknownCaller';
  const logger = new Logger(stack.trim());
  logger.error(message);
  throw new ExceptionType(message);
}
