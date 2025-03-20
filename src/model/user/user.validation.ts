import { z } from 'zod';
import { ZodErrorMessages } from '../../utils/messages';
import { regex } from 'src/utils/regex';
import {
  baseBoolean,
  baseEnum,
  baseName,
  basePassword,
  createDTO,
  stringMinMax,
} from 'src/utils/zodQuick';

const genderType = ['MAN', 'WOMAN', 'OTHER'] as const;

const user = z
  .object({
    id: stringMinMax('User ID', 1, 100),
    identifier: stringMinMax('Username/Email/Phone number', 4, 100),
    username: baseName('Username', 5, 100),
    email: stringMinMax('Email', 4, 100).email({
      message: ZodErrorMessages.invalidEmail,
    }),
    password: basePassword,
    confirmPassword: basePassword,
    fullName: stringMinMax('Full Name', 1, 100),
    imageUrl: stringMinMax('Image URL', 1, 100).regex(regex.imageUrl, {
      message: ZodErrorMessages.invalidURL('Image URL'),
    }),
    phoneNumber: stringMinMax('Phone number', 4, 100).regex(regex.phone, {
      message: ZodErrorMessages.invalidPhone,
    }),
    isActice: baseBoolean('Is Active').default(true),
    genderType: baseEnum('Gender', genderType),
    role: stringMinMax('Role', 1, 100),
    permission: z.array(stringMinMax('Permission', 1, 100)),
  })
  .strict();

const userCreate = user
  .omit({
    id: true,
    email: true,
    imageUrl: true,
    phoneNumber: true,
    genderType: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Whoa! Passwords don't match. Try again, champ! 🔐",
    path: ['confirmPassword'],
  });

const userUpdate = user.omit({ id: true }).partial().required();

export class UserCreateDto extends createDTO(userCreate) {}
export class UserUpdateDto extends createDTO(userUpdate) {}
