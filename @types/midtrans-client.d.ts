declare module 'midtrans-client' {
  export class CoreApi {
    constructor(options: MidtransConfig);
    charge(
      transaction: MidtransTransactionRequest,
    ): Promise<MidtransTransactionResponse>;
    capture(transactionId: string): Promise<MidtransTransactionResponse>;
    refund(
      transactionId: string,
      params?: object,
    ): Promise<MidtransTransactionResponse>;
    cancel(transactionId: string): Promise<MidtransTransactionResponse>;
    status(transactionId: string): Promise<MidtransTransactionResponse>;
  }

  export class Snap {
    constructor(options: MidtransConfig);
    createTransaction(
      payload: MidtransTransactionRequest,
    ): Promise<MidtransTransactionResponse>;
  }

  export interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface MidtransTransactionRequest {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    item_details?: {
      id?: string;
      price: number;
      quantity: number;
      name: string;
      brand?: string;
      category?: string;
      merchant_name?: string;
    }[];
    credit_card?: {
      secure?: boolean;
    };
    bank_transfer?: {
      bank: 'bca' | 'bni' | 'bri' | 'permata';
    };
    echannel?: {
      bill_info1?: string;
      bill_info2?: string;
    };
    custom_expiry?: {
      start_time: string;
      unit: 'minute' | 'hour' | 'day';
      duration: number;
    };
  }

  export interface MidtransTransactionResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status: string;
    pdf_url?: string;
  }
}
