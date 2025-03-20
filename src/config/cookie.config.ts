import * as moment from 'moment-timezone';

export const maxAge = {
  access: 15 * 60 * 1000,
  refresh: 7 * 24 * 60 * 60 * 1000,
};

export const cookieConfig = {
  access: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    expires: moment()
      .tz('Asia/Jakarta')
      .add(maxAge.access, 'milliseconds')
      .toDate(),
  },
  refresh: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    expires: moment()
      .tz('Asia/Jakarta')
      .add(maxAge.refresh, 'milliseconds')
      .toDate(),
  },
};
