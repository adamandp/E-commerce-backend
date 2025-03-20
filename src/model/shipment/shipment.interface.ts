interface ShippingMeta {
  message: string;
  code: number;
  status: string;
}

export interface ShippingData {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingResponse {
  meta: ShippingMeta;
  data: ShippingData[];
}
