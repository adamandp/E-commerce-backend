import { z } from 'zod';
import { baseUUID, createDTO, numberMinMax } from 'src/utils/zodQuick';

const cart = z
  .object({
    userId: baseUUID('User ID'),
    productId: baseUUID('Product ID'),
    quantity: numberMinMax('Quantity', 1, 50),
  })
  .strict();

export class CartDto extends createDTO(cart) {}
