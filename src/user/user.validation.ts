import { z, ZodType } from 'zod';

const phoneRegex = /^\d{10,15}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i;
const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;

export class UserValidation {
  static readonly REGISTER: ZodType = z
    .object({
      identifier: z.string().min(1, { message: 'Identifier is required' }),
      username: z.string().min(1, { message: 'Username is required' }),
      password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
      confirm_password: z.string(),
      full_name: z.string().min(1, { message: 'Full Name is required' }),
    })
    .superRefine((data, ctx) => {
      if (
        data.identifier.trim() &&
        !emailRegex.test(data.identifier) &&
        !phoneRegex.test(data.identifier)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email or phone number',
          path: ['identifier'],
        });
      }
    })
    .transform((data) => ({
      ...data,
      identifier_type: emailRegex.test(data.identifier) ? 'email' : 'phone',
    }))
    .refine((data) => data.password === data.confirm_password, {
      message: "Password doesn't match",
      path: ['confirm_password'],
    });

  static readonly LOGIN: ZodType = z
    .object({
      identifier: z
        .string()
        .min(1)
        .max(100, { message: 'Username/Email/Phone number is required' }),
      password: z.string().min(1).max(100, { message: 'Password is required' }),
    })
    .superRefine((data, ctx) => {
      if (
        data.identifier.trim() &&
        !emailRegex.test(data.identifier) &&
        !phoneRegex.test(data.identifier) &&
        !usernameRegex.test(data.identifier)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email, username, or phone number',
          path: ['identifier'],
        });
      }
    })
    .transform((data) => ({
      ...data,
      identifier_type: emailRegex.test(data.identifier)
        ? 'email'
        : phoneRegex.test(data.identifier)
          ? 'phone'
          : usernameRegex.test(data.identifier)
            ? 'username'
            : 'invalid email, username, or phone number',
    }));

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
