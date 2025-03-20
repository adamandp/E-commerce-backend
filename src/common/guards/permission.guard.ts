import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  forwardRef,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { customRequest } from '../common.interface';
import { ErrorMessage } from 'src/utils/messages';
import { publics } from 'src/config/public.config';
import { PermissionService } from 'src/model/permission/permission.service';
import { throwError } from 'src/utils/throwError';
import { OwnerGuard } from './owner.guard';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => OwnerGuard)) private owner: OwnerGuard,
    private logger: PinoLogger,
    private reflector: Reflector,
    private permissions: PermissionService,
  ) {
    logger.setContext(PermissionsGuard.name);
  }

  async findPermissionsName(permissionsId: string[]): Promise<string[]> {
    const notFound = ErrorMessage.notFound('Permission');
    return Promise.all(
      permissionsId.map(async (id) => {
        const permission = await this.permissions.findById(id);
        if (!permission?.data?.name) throwError(notFound, NotFoundException);
        return permission.data.name;
      }),
    );
  }

  async checkPermission(context: ExecutionContext): Promise<boolean> {
    const notFound = ErrorMessage.notFound('Permission');
    const req = context.switchToHttp().getRequest<customRequest>();
    const requiredPermission = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermission) return true;

    const permissionsId: string[] =
      req.user.permissions ?? throwError(notFound, NotFoundException);
    const permissionName = await this.findPermissionsName(permissionsId);

    return requiredPermission.every((p) => permissionName.includes(p));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicConfig = publics.config(this.reflector, context);
    const checkOwner = this.owner.checkOwner(context);
    const checkPermission = await this.checkPermission(context);

    if (publicConfig || checkOwner || checkPermission) return true;

    throwError(ErrorMessage.accessDenied('Permission'), ForbiddenException);
  }
}
