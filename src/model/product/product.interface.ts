import { Decimal } from '@prisma/client/runtime/library';

export interface ProductResponse {
  id: string;
  name: string;
  description?: string | null;
  price: Decimal;
  stock: number;
  rate?: number | null;
  views?: number | null;
  status?: boolean | null;
  slug: string;
  categoryId?: string | null;
  discountId?: string | null;
  imageUrl?: string | null;
}
