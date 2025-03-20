import { Params } from 'nestjs-pino';
import type { Request, Response } from 'express';

export const loggerOptions: Params = {
  pinoHttp: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:mm:ss',
        ignore: 'pid,hostname',
        messageFormat: '{msg}',
      },
    },
    serializers: {
      req(req: Request) {
        return {
          id: req.id, // Trace ID
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          headers: {
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type'],
          },
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage || '',
        };
      },
    },
    // hooks: {
    //   logMethod(args, method, level) {
    //     if (level === 30) return;
    //     method.apply(this, args);
    //   },
    // },
  },
};

// import { Params } from 'nestjs-pino';
// import type { Request, Response } from 'express';

// export const loggerOptions: Params = {
//   pinoHttp: {
//     level: 'debug', // Tetap 'debug' biar semua log bisa di-handle
//     transport: {
//       target: 'pino-pretty',
//       options: {
//         colorize: true,
//         translateTime: 'yyyy-mm-dd HH:mm:ss',
//         pid: false,
//         sync: true,
//         ignore: 'pid,hostname',
//         messageFormat: '{msg}',
//       },
//     },
//     serializers: {
//       req(req: Request) {
//         return {
//           method: req.method,
//           url: req.url,
//           query: req.query,
//           params: req.params,
//           // headers: req.headers,
//         };
//       },
//       res(res: Response) {
//         return {
//           statusCode: res.statusCode,
//           statusMessage: res.statusMessage || '',
//         };
//       },
//     },
//     hooks: {
//       logMethod(args, method, level) {
//         if (level === 30) return; // Level 'info' = 30, jadi kita skip
//         method.apply(this, args);
//       },
//     },
//   },
// };
