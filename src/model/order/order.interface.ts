import { Decimal } from '@prisma/client/runtime/library';

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  totalPrice: Decimal;
  OrderItem: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: Decimal;
}

export interface OrderFindRes {
  id: string;
  User: {
    id: string;
    username: string;
  };
  totalPrice: Decimal;
  status: string;
}
