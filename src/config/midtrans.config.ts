import { secret } from './secret.config';

export const midtransConfig = {
  baseUrl: secret.baseurl.midtrans,
  clientKey: secret.key.midtrans.client,
  serverKey: secret.key.midtrans.server,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${Buffer.from(secret.key.midtrans.server + ':').toString('base64')}`,
  },
};
