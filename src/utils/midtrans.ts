import {
  PaymentCreateDTO,
  PaymentPayloadDTO,
} from 'src/model/order/order.validation';
import { ChargeResponse } from 'src/model/payment/payment.interface';
import { ChargeDTO } from 'src/model/payment/payment.validation';

export const createPayload = (request: PaymentPayloadDTO): ChargeDTO => {
  const va_number = '12345678';
  const transaction_details = {
    order_id: request.orderId,
    gross_amount: Number(request.amount),
  };

  const bank_transfer = (bank: 'permata' | 'bca' | 'bni' | 'bri') => ({
    bank: bank,
    va_number,
  });
  const cstore = {
    store: request.paymentMethod,
  };

  switch (request.paymentMethod) {
    // bank transfer
    case 'permata':
      return {
        payment_type: 'bank_transfer',
        bank_transfer: bank_transfer(request.paymentMethod),
        transaction_details,
      };
    case 'bca':
      return {
        payment_type: 'bank_transfer',
        bank_transfer: bank_transfer(request.paymentMethod),
        transaction_details,
      };
    case 'mandiri':
      return {
        payment_type: 'echannel',
        transaction_details,
        echannel: {
          bill_info1: 'Payment For:',
          bill_info2: 'order',
        },
      };
    case 'bni':
      return {
        payment_type: 'bank_transfer',
        bank_transfer: bank_transfer(request.paymentMethod),
        transaction_details,
      };
    case 'bri':
      return {
        payment_type: 'bank_transfer',
        bank_transfer: bank_transfer(request.paymentMethod),
        transaction_details,
      };
    case 'cimb':
      return {
        payment_type: 'cimb_va',
        cimb_va: {
          va_number,
        },
        transaction_details,
      };

    // QRIS
    case 'qris':
      return {
        payment_type: 'cstore',
        transaction_details,
        qris: {
          acquirer: 'gopay',
        },
      };

    // Retail Payments (Alfamart, Indomaret)
    case 'alfamart':
      return {
        payment_type: 'cstore',
        transaction_details,
        cstore,
      };
    case 'indomaret':
      return {
        payment_type: 'cstore',
        transaction_details,
        cstore,
      };
    default:
      throw new Error(`Unsupported payment method`);
  }
};

export const updatePayload = (
  response: ChargeResponse,
  request: PaymentPayloadDTO,
): PaymentCreateDTO => {
  const payload = {
    ...request,
    status: '',
    transactionCode: '',
    transactionId: '',
    expiryDate: '',
    paymentDate: '',
  };
  payload.expiryDate = response.expiry_time as string;
  payload.status = response.transaction_status as string;
  switch (payload.paymentMethod) {
    // Bank Transfer
    case 'permata':
      payload.transactionId = response.permata_va_number as string;
      break;
    case 'bca':
      payload.transactionId = response.va_numbers?.[0]?.va_number as string;
      break;
    case 'cimb':
      payload.transactionId = response.permata_va_number as string;
      break;
    case 'mandiri':
      payload.transactionId = response.bill_key as string;
      payload.transactionCode = response.biller_code as string;
      break;
    case 'bni':
      payload.transactionId = response.va_numbers?.[0]?.va_number as string;
      break;
    case 'bri':
      payload.transactionId = response.va_numbers?.[0]?.va_number as string;
      break;
    // QRIS
    case 'qris':
      payload.transactionId = response.qr_string as string;
      break;
    // Retail Payments (Alfamart, Indomaret)
    case 'alfamart':
      payload.transactionId = response.payment_code as string;
      break;
    case 'indomaret':
      payload.transactionId = response.payment_code as string;
      break;
    default:
      throw new Error(`Unsupported payment method`);
  }
  return payload;
};
