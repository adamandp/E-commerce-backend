import { Injectable, BadRequestException } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType<T>, data: T): T {
    try {
      return zodType.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: formattedErrors,
        });
      }
      throw error;
    }
  }
}
