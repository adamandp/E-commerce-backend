import { z } from 'zod';
import {
  baseBoolean,
  baseEnum,
  baseNumber,
  baseString,
  baseUUID,
  createDTO,
} from 'src/utils/zodQuick';

const transaction_details = z.object({
  order_id: baseUUID('Order ID'),
  gross_amount: baseNumber('Gross Amount'),
});

const paymentType = ['bank_transfer', 'echannel', 'cimb_va', 'cstore'] as const;
const bankType = ['permata', 'bca', 'bni', 'bri'] as const;

const payment_type = baseEnum('Payment Type', paymentType);
const va_number = baseString('VA Number');

const bank_transfer = z
  .object({ bank: baseEnum('Bank', bankType), va_number })
  .optional();

const echannel = z
  .object({
    bill_info1: baseString('Bill info 1'),
    bill_info2: baseString('Bill info 2'),
  })
  .optional();

const cstore = z.object({ store: baseString('Store') }).optional();

const cimb_va = z.object({ va_number }).optional();

const credit_card = z
  .object({
    token_id: baseString('Token ID'),
    authentication: baseBoolean('Authentication'),
  })
  .optional();

const qris = z.object({ acquirer: baseString('Acquirer') }).optional();

const shopeepay = z
  .object({ callback_url: baseString('Callback URL') })
  .optional();

export const charge = z.object({
  payment_type,
  bank_transfer,
  transaction_details,
  echannel,
  cstore,
  cimb_va,
  qris,
  shopeepay,
});

const CreditCardCharge = z.object({
  payment_type,
  credit_card,
  transaction_details,
});

const update = z.object({
  orderId: baseUUID('Order ID'),
  status: baseString('Status'),
});

export class ChargeDTO extends createDTO(charge) {}
export class PaymentUpdateDTO extends createDTO(update) {}
export class CreditCardChargeDTO extends createDTO(CreditCardCharge) {}
