import { Params } from 'nestjs-pino';
import type { Request, Response } from 'express';

export const loggerOptions: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              pid: false,
              sync: true,
            },
          }
        : undefined,
    serializers: {
      req(req: Request) {
        return {
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          headers: req.headers,
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage || '',
        };
      },
    },
  },
};
