import {
  PipeTransform,
  BadRequestException,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodType, ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}
  transform(value: T): T {
    try {
      return this.schema.parse(value);
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
  }
}

// @Injectable()
// export class ZodValidationPipe<T> implements PipeTransform {
//   transform(value: T, metadata: ArgumentMetadata): T {
//     const schema: ZodType<T> | undefined = (metadata.metatype as any)?.schema;

//     if (!schema) {
//       return value; // Jika tidak ada schema, langsung return tanpa validasi
//     }

//     try {
//       return schema.parse(value);
//     } catch (error) {
//       if (error instanceof ZodError) {
//         throw new BadRequestException({
//           statusCode: 400,
//           error: 'Bad Request',
//           message: 'Validation failed',
//           details: error.errors.map((err) => ({
//             field: err.path.join('.'),
//             message: err.message,
//           })),
//         });
//       }
//       throw error;
//     }
//   }
// }
