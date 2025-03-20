import {
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AxiosError } from 'axios';
import { startCase } from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import { ErrorMessage } from 'src/utils/messages';
import { throwError } from 'src/utils/throwError';

@Catch(PrismaClientKnownRequestError)
export class CommonFilter implements ExceptionFilter {
  constructor(private logger: PinoLogger) {
    this.logger.setContext(CommonFilter.name);
  }

  catch(exception: PrismaClientKnownRequestError | AxiosError) {
    if (exception instanceof PrismaClientKnownRequestError) {
      const model: string = startCase(exception.meta?.modelName as string);
      const field: string = startCase(exception.meta?.target as string);

      switch (exception.code) {
        case 'P2002':
          throwError(
            ErrorMessage.alreadyExist(model, field),
            ConflictException,
          );
          break;
        case 'P2025':
          throwError(ErrorMessage.notFound(model, field), NotFoundException);
          break;

        default: {
          this.logger.error(exception.message);
          throw new InternalServerErrorException(exception.message);
        }
      }
    }
    throw new InternalServerErrorException(`🚨 Server error 🚨`);
  }
}
