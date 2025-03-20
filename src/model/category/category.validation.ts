import { z } from 'zod';
import { baseName, baseUUID, createDTO } from 'src/utils/zodQuick';

const category = z
  .object({
    id: baseUUID('Category ID'),
    name: baseName('Name', 1, 100),
  })
  .strict();

const categoryCreate = category.omit({ id: true });

export class CategoryCreateDTO extends createDTO(categoryCreate) {}
export class CategoryUpdateDTO extends createDTO(category) {}
