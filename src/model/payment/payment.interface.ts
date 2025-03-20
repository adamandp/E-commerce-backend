export interface Action {
  name?: string;
  method?: string;
  url?: string;
}

export interface ChargeResponse {
  message?: string;

  validation_messages?: string[];
  id?: string;
  gross_amount?: string;
  transaction_time?: string;
  transaction_status?: string;
  actions?: Action[];
  qr_string?: string;
  acquirer?: string;
  expiry_time?: string;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  va_numbers?: {
    bank: string;
    va_number: string;
  }[];
  payment_code?: string;
  store?: string;
}

export interface getTokenResponse {
  status_code: string;
  status_message: string;
  id: string;
}

export interface WebhookResponse {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  masked_card: string;
  gross_amount: string;
  fraud_status: string;
  eci: string;
  currency: string;
  channel_response_message: string;
  channel_response_code: string;
  card_type: string;
  bank: string;
  approval_code: string;
}
