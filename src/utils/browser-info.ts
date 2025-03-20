import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export const browserInfo = (request: Request) => {
  const userAgent = request.headers['user-agent'] || 'Tidak terdeteksi';
  const ip = request.ip || 'Unknown';
  const acceptLanguage = request.headers['accept-language'] || 'Unknown';

  const ua = UAParser(userAgent);
  return {
    ip,
    browser: `${ua.browser?.name ?? 'Unknown'} ${ua.browser?.version ?? 'Unknown'}`,
    os: `${ua.os?.name ?? 'Unknown'} ${ua.os?.version ?? 'Unknown'}`,
    device: ua.device?.type ?? 'Unknown',
    language: acceptLanguage,
  };
};
