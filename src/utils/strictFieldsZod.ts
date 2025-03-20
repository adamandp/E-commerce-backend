import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  Schema,
  z,
  ZodEffects,
  ZodObject,
  ZodRawShape,
  ZodSchema,
  ZodTypeAny,
} from 'zod';

// export const strict = {
//   extraKeys: <T extends ZodObject<any>>(schema: T) =>
//     schema.passthrough().superRefine((data, ctx) => {
//       const allowedFields = Object.keys((schema as ZodObject<any>).shape);
//       const extraKeys = Object.keys(data).filter(
//         (key) => !allowedFields.includes(key),
//       );
//       extraKeys.forEach((key) => {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: `Unexpected field '${key}' is not allowed.`,
//           path: [key],
//         });
//       });
//     }),
//   update: <
//     T extends
//       | ZodObject<Record<string, ZodTypeAny>>
//       | ZodEffects<ZodObject<Record<string, ZodTypeAny>>>,
//   >(
//     schema: T,
//   ) =>
//     schema.refine((data) => Object.keys(data).length > 0, {
//       path: ['update'],
//       message: 'At least one field must be updated',
//     }),
// };

export const strict = {
  extraKeys: <T extends ZodObject<ZodRawShape>>(schema: T) =>
    schema.passthrough().superRefine((data, ctx) => {
      const allowedFields = Object.keys(schema.shape); // Ini harusnya sekarang aman
      const extraKeys = Object.keys(data).filter(
        (key) => !allowedFields.includes(key),
      );

      extraKeys.forEach((key) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unexpected field '${key}' is not allowed.`,
          path: [key],
        });
      });
    }),
  update: <
    T extends ZodObject<ZodRawShape> | z.ZodEffects<ZodObject<ZodRawShape>>,
  >(
    schema: T,
  ) =>
    schema.refine((data) => Object.keys(data).length > 0, {
      path: ['update'],
      message: 'At least one field must be updated',
    }),
};

export const noExtraKeys = <T extends z.ZodObject<any>>(schema: T) =>
  schema.passthrough().superRefine((data, ctx) => {
    const allowedFields = Object.keys(schema.shape as ZodObject<any>); // Ambil fields yang valid
    const extraKeys = Object.keys(data).filter(
      (key) => !allowedFields.includes(key),
    );

    extraKeys.forEach((key) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unexpected field '${key}' is not allowed.`,
        path: [key],
      });
    });
  });
