import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ErrorMessage } from 'src/utils/messages';
import { Response } from 'express';
import { cookieConfig } from 'src/config/cookie.config';
import { customRequest } from './common.interface';
import { AuthService } from 'src/model/auth/auth.service';

@Injectable()
export class CommonMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(CommonMiddleware.name)
    private logger: PinoLogger,
    private auth: AuthService,
  ) {}

  async use(req: customRequest, res: Response, next: (error?: any) => void) {
    if (req.headers['x-internal-request'] === 'true') {
      return next();
    }

    if (!req.cookies.refreshToken) {
      const message = ErrorMessage.notLoggedIn;
      this.logger.error(message);
      throw new UnauthorizedException(message);
    }

    if (!req.cookies.accessToken) {
      const accessToken = await this.auth.refreshAccessToken(req);
      res.cookie('accessToken', accessToken, cookieConfig.access);
      req.cookies.accessToken = accessToken;
    }
    next();
  }
}
