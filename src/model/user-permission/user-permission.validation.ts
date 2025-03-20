import { z } from 'zod';
import { baseString, baseUUID, createDTO } from 'src/utils/zodQuick';

const userPermission = z
  .object({
    name: baseString('Name'),
    userId: baseUUID('User ID'),
  })
  .strict();

export class UserPermissionDto extends createDTO(userPermission) {}
