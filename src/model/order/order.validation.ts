import { z } from 'zod';
import {
  baseEnum,
  baseString,
  baseUUID,
  createDTO,
  numberMinMax,
  priceMinMax,
  stringMinMax,
} from 'src/utils/zodQuick';

const status = baseString('Status');
const orderId = baseUUID('Order ID');
const paymentMethodType = [
  'permata',
  'bca',
  'mandiri',
  'bni',
  'bri',
  'cimb',
  'qris',
  'alfamart',
  'indomaret',
] as const;

const order = z.object({
  id: baseUUID('Order ID'),
  userId: baseUUID('User ID'),
  status,
  totalPrice: priceMinMax('Total Price', 1, 10000000),
  addressId: baseUUID('Address ID'),
});

const orderItem = z.object({
  id: baseUUID('Order Item Id'),
  orderId,
  productId: baseUUID('Product ID'),
  quantity: numberMinMax('Quantity', 1, 50),
  price: numberMinMax('Price', 1000, 100000),
});

const shipment = z.object({
  id: baseUUID('Order Item Id'),
  orderId,
  status: stringMinMax('Status', 1, 50),
  courier: stringMinMax('Courier', 1, 50),
  service: stringMinMax('Service', 1, 50),
  cost: numberMinMax('Cost', 1, 1000000),
  estimated: stringMinMax('Estimated', 1, 50),
  description: stringMinMax('Description', 1, 50),
});

const payment = z.object({
  id: baseUUID('Payment Id'),
  orderId,
  paymentMethod: baseEnum('Payment Method', paymentMethodType),
  status,
  amount: priceMinMax('Amount', 1, 10000000),
  transactionCode: baseString('Transaction Code'),
  transactionId: baseString('Transaction ID'),
  expiryDate: baseString('Expiry Date'),
  paymentDate: baseString('Payment Date'),
});

const orderItemRequest = orderItem.pick({ productId: true, quantity: true });
const paymentPayload = payment.pick({
  orderId: true,
  paymentMethod: true,
  amount: true,
});

const orderRequest = z.object({
  order: order.pick({ userId: true, addressId: true }),
  orderItem: z.array(orderItemRequest),
  shipment: shipment.omit({ orderId: true, status: true, id: true }),
  payment: payment.pick({ paymentMethod: true }),
});
const orderUpdate = order.pick({ id: true, status: true });
const paymentCreate = payment.omit({ id: true });
const orderItemCreate = orderItem.omit({ id: true });

export class OrderCreateDTO extends createDTO(orderRequest) {}
export class OrderUpdateDTO extends createDTO(orderUpdate) {}
export class OrderItemCreateDTO extends createDTO(orderItemCreate) {}
export class OrderItemRequestDTO extends createDTO(orderItemRequest) {}
export class PaymentPayloadDTO extends createDTO(paymentPayload) {}
export class PaymentCreateDTO extends createDTO(paymentCreate) {}
