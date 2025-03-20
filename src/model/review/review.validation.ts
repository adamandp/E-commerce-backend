import { z } from 'zod';
import {
  baseUUID,
  createDTO,
  numberMinMax,
  stringMinMax,
} from 'src/utils/zodQuick';

const review = z
  .object({
    id: baseUUID('Review ID'),
    userId: baseUUID('User ID'),
    productId: baseUUID('Product ID'),
    rating: numberMinMax('Rating', 1, 5),
    review: stringMinMax('Review', 1, 255),
  })
  .strict();

const reviewCreate = review.omit({ id: true });
const reviewUpdate = review.partial().required();
const reviewDelete = review.pick({ id: true, userId: true });

export class ReviewCreateDto extends createDTO(reviewCreate) {}
export class ReviewUpdateDto extends createDTO(reviewUpdate) {}
export class ReviewDeleteDto extends createDTO(reviewDelete) {}
