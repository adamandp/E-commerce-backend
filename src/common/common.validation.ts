import { createZodDto } from 'nestjs-zod';
import { coerceMinMax, stringMinMax } from 'src/utils/zodQuick';
import { z } from 'zod';

const pagination = z.object({
  page: coerceMinMax('Page', 1, 100)
    .default(1)
    .transform((val) => Number(val)),
  limit: coerceMinMax('Limit', 1, 100)
    .default(10)
    .transform((val) => Number(val)),
  query: stringMinMax('Query', 1, 100).optional(),
});

export class PaginationDto extends createZodDto(pagination) {}
