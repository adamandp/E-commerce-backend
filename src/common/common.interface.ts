import { Request } from 'express';

export class WebResponse<T = unknown> {
  status?: number;
  token?: string;
  message?: string;
  errors?: string;
  data?: T;
  paging?: Paging;
}

export class Paging {
  current_page: number;
  total_items: number;
  total_pages: number;
  limit: number;
}

export interface JwtPayload {
  sub: string;
  role: string;
  permissions: string[];
}

export interface customRequest extends Request {
  cookies: {
    refreshToken?: string;
    accessToken?: string;
  };
  user: JwtPayload;
  body: {
    userId?: string;
  };
}
