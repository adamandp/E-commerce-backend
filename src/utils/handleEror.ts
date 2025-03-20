import { AxiosError } from 'axios';
import {
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ErrorMessage } from './messages';

export function handleError(
  error: unknown,
  entity: string = 'Resource',
): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    switch (status) {
      case 401:
        throw new UnauthorizedException(ErrorMessage.sessionExpired());
      case 403:
        throw new ForbiddenException(ErrorMessage.accessDenied(entity));
      case 404:
        throw new NotFoundException(ErrorMessage.notFound(entity));
      case 409:
        throw new ConflictException(ErrorMessage.alreadyExist(entity));
      case 500:
      default:
        throw new InternalServerErrorException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `🚨 Server error: ${error.response?.data?.message || error.message}`,
        );
    }
  }

  throw new InternalServerErrorException(
    `An unknown error occurred: ${error instanceof Error ? error.message : 'No details'}`,
  );
}
