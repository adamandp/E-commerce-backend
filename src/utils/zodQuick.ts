import { z } from 'zod';
import { ZodErrorMessages } from './messages';
import { createZodDto } from 'nestjs-zod';

export const createDTO = <T extends z.ZodType<any, any>>(schema: T) =>
  createZodDto<z.infer<T>>(schema);

export const baseString = (name: string) =>
  z.string({
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidString(name),
  });

export const baseNumber = (name: string) =>
  z.number({
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidNumber(name),
  });

export const baseUUID = (name: string) =>
  baseString(name).uuid({ message: ZodErrorMessages.invalidUUID(name) });

export const stringMinMax = (name: string, min: number, max: number) =>
  baseString(name)
    .min(min, ZodErrorMessages.minLength(name, min))
    .max(max, ZodErrorMessages.maxLength(name, max));

export const numberMinMax = (name: string, min: number, max: number) =>
  baseNumber(name)
    .min(min, ZodErrorMessages.minLength(name, min))
    .max(max, ZodErrorMessages.maxLength(name, max));

export const coerceNumber = (name: string) =>
  z.coerce.number({
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidNumber(name),
  });

export const coerceMinMax = (name: string, min: number, max: number) =>
  coerceNumber(name)
    .min(min, ZodErrorMessages.minLength(name, min))
    .max(max, ZodErrorMessages.maxLength(name, max));

export const baseBoolean = (name: string) =>
  z.boolean({
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidBoolean(name),
  });

export const baseDate = (name: string) =>
  z.coerce.date({
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidDate(name),
  });

export const priceMinMax = (name: string, min: number, max: number) =>
  baseNumber(name)
    .min(min, ZodErrorMessages.priceTooLow(name))
    .max(max, ZodErrorMessages.priceTooHigh(name));

export const baseName = (name: string, min: number, max: number) =>
  stringMinMax(name, min, max).regex(/^[A-Za-z\s]+$/, {
    message: ZodErrorMessages.nameOnlyLetters,
  });

export const baseEnum = <T extends readonly [string, ...string[]]>(
  name: string,
  options: T,
) =>
  z.enum(options, {
    required_error: ZodErrorMessages.required(name),
    invalid_type_error: ZodErrorMessages.invalidEnum(name, options),
  });

export const basePassword = stringMinMax('Password', 8, 100)
  .min(8, { message: ZodErrorMessages.minLength('Password', 8) })
  .regex(/[a-z]/, { message: ZodErrorMessages.lowercase('Password') })
  .regex(/[A-Z]/, { message: ZodErrorMessages.uppercase('Password') })
  .regex(/\d/, { message: ZodErrorMessages.number('Password') })
  .regex(/[!@#$%^&*]/, { message: ZodErrorMessages.specialChar('Password') });
