import { z } from 'zod';
import {
  baseBoolean,
  baseDate,
  baseEnum,
  baseName,
  baseUUID,
  createDTO,
} from 'src/utils/zodQuick';

const DiscountType = ['PRECENTAGE', 'FIX'] as const;

const discount = z
  .object({
    id: baseUUID('Discount ID'),
    name: baseName('Name', 1, 100),
    status: baseBoolean('Status'),
    discountType: baseEnum('Discount Type', DiscountType),
    startDate: baseDate('Start Date'),
    endDate: baseDate('End Date'),
  })
  .strict();

const discountCreate = discount.omit({ id: true });
const discountUpdate = discount.partial().required();

export class DiscountCreateDTO extends createDTO(discountCreate) {}
export class DiscountUpdateDTO extends createDTO(discountUpdate) {}
