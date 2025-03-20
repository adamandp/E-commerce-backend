import { z } from 'zod';
import { ZodErrorMessages } from '../../utils/messages';
import { regex } from 'src/utils/regex';
import {
  baseBoolean,
  baseNumber,
  baseString,
  baseUUID,
  createDTO,
  priceMinMax,
  stringMinMax,
} from 'src/utils/zodQuick';

const product = z
  .object({
    id: baseUUID('Product ID'),
    name: stringMinMax('Name', 1, 100),
    categoryId: baseUUID('Category ID'),
    imageUrl: baseString('Image URL')
      .regex(regex.imageUrl, {
        message: ZodErrorMessages.invalidURL('Image URL'),
      })
      .optional(),
    description: stringMinMax('Description', 1, 1000).optional(),
    price: priceMinMax('Price', 1000, 1000000),
    stock: baseNumber('Stock'),
    status: baseBoolean('Status').optional(),
  })
  .strict();

const productCreate = product.omit({ id: true });
const productUpdate = product.partial().required();

export class ProductCreateDto extends createDTO(productCreate) {}
export class ProductUpdateDto extends createDTO(productUpdate) {}
