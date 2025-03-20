import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { customRequest } from '../common.interface';
import { RolesGuard } from './role.guard';
import { PermissionsGuard } from './permission.guard';
import { throwError } from 'src/utils/throwError';
import { publics } from 'src/config/public.config';
import { Reflector } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => RolesGuard)) private rolesGuard: RolesGuard,
    @Inject(forwardRef(() => PermissionsGuard))
    private permission: PermissionsGuard,
    private logger: PinoLogger,
    private reflector: Reflector,
  ) {
    logger.setContext(OwnerGuard.name);
  }

  checkOwner(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<customRequest>();
    const requestparams = request.params?.id;
    const requestBody = request.body?.userId;

    if (!requestparams && !requestBody) return false;

    const user = request?.user;
    const userId = user?.sub;

    return userId === requestparams || userId === requestBody;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicConfig = publics.config(this.reflector, context);
    const checkOwner = this.checkOwner(context);
    const checkRoles = await this.rolesGuard.checkRoles(context);
    const checkPermission = await this.permission.checkPermission(context);

    if (publicConfig || checkOwner || checkRoles || checkPermission)
      return true;

    throwError(
      '🔒 Access Denied! you does not have permission to access this resource. 🚫',
      ForbiddenException,
    );
  }
}
