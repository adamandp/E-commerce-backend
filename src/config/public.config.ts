import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

export const publics = {
  config: (reflector: Reflector, context: ExecutionContext) => {
    return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  },
  header: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.headers['x-internal-request'] === 'true') {
      return true;
    }
  },
};
