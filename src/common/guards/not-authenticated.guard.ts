import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { customRequest } from '../common.interface';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { ErrorMessage } from 'src/utils/messages';

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
  constructor(private logger: PinoLogger) {
    this.logger.setContext(NotAuthenticatedGuard.name);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<customRequest>();
    const token = request.cookies.accessToken;
    const message: string =
      request.url === '/auth/login'
        ? ErrorMessage.alreadyLoggedIn
        : '🔒 Access Denied! you does not have permission to access this resource. 🚫';

    if (token) {
      this.logger.error(message);
      throw new ConflictException(message);
    } else {
      return true;
    }
  }
}
