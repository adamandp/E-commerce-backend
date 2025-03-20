import { BadRequestException } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

export const validateWithZod = <T>(schema: ZodType<T>, value: T): T => {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMap: Record<string, string> = {};

      error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (!errorMap[field]) {
          errorMap[field] = err.message;
        }
      });

      const formattedErrors = Object.keys(errorMap).map((field) => ({
        field,
        message: errorMap[field],
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
};
