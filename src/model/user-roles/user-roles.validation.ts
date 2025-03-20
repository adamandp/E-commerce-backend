import { z } from 'zod';
import { baseUUID, createDTO, stringMinMax } from 'src/utils/zodQuick';

const userRoles = z
  .object({
    name: stringMinMax('Name', 1, 100),
    userId: baseUUID('User ID'),
  })
  .strict();

export class UserRolesUpdateDto extends createDTO(userRoles) {}
