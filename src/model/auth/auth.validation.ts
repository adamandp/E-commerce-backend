import { z } from 'zod';
import { basePassword, createDTO, stringMinMax } from 'src/utils/zodQuick';

const login = z
  .object({
    identifier: stringMinMax('Username/Email/Phone number', 4, 100),
    password: basePassword,
  })
  .strict();

export class LoginDto extends createDTO(login) {}
