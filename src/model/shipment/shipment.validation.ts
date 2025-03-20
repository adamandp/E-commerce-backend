import { z } from 'zod';
import { coerceNumber, createDTO } from 'src/utils/zodQuick';

const cost = z
  .object({
    origin: coerceNumber('origin').transform((val) => Number(val)),
    destination: coerceNumber('destination').transform((val) => Number(val)),
    weight: coerceNumber('weight').transform((val) => Number(val)),
  })
  .strict();

export class CostDto extends createDTO(cost) {}
