import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { customRequest, JwtPayload } from '../common.interface';
import { ErrorMessage } from 'src/utils/messages';
import { secret } from 'src/config/secret.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly logger: PinoLogger) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: customRequest) => {
          const accessToken = request.cookies.accessToken ?? null;
          if (accessToken) {
            return accessToken;
          } else {
            const message = ErrorMessage.sessionExpired();
            this.logger.error(message);
            throw new UnauthorizedException(message);
          }
        },
      ]),
      secretOrKey: secret.key.jwt.access as string,
    });
    logger.setContext(JwtStrategy.name);
  }

  validate(payload: JwtPayload): JwtPayload {
    try {
      return payload;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(ErrorMessage.sessionExpired());
    }
  }
}
