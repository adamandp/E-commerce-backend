import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const secret = {
  cookie: configService.get<string>('COOKIE_SECRET_KEY'),
  cloudinary: {
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api: configService.get<string>('CLOUDINARY_API_KEY'),
    secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  },
  baseurl: {
    web: configService.get<string>('BASE_URL'),
    midtrans: configService.get<string>('MIDTRANS_BASE_URL'),
    rajaongkir: configService.get<string>('RAJAONGKIR_BASE_URL'),
    region: configService.get<string>('REGION_BASE_URL'),
  },
  key: {
    rajaongkir: configService.get<string>('RAJAONGKIR_API_KEY'),
    midtrans: {
      server: configService.get<string>('MIDTRANS_SERVER_KEY'),
      client: configService.get<string>('MIDTRANS_CLIENT_KEY'),
    },
    jwt: {
      access: configService.get<string>('ACCESS_JWT_SECRET'),
      refresh: configService.get<string>('REFRESH_JWT_SECRET'),
    },
  },
  internalRequest: { 'x-internal-request': 'true' },
};
