import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { customRequest } from '../common.interface';
import { publics } from 'src/config/public.config';
import { ErrorMessage } from 'src/utils/messages';
import { RolesService } from 'src/model/roles/roles.service';
import { throwError } from 'src/utils/throwError';
import { OwnerGuard } from './owner.guard';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => OwnerGuard)) private owner: OwnerGuard,
    private logger: PinoLogger,
    private reflector: Reflector,
    private roles: RolesService,
  ) {
    this.logger.setContext(RolesGuard.name);
  }

  async findRolesName(rolesId: string, notFound: string): Promise<string> {
    return await this.roles
      .findById(rolesId)
      .then((r) => r.data?.name ?? throwError(notFound, NotFoundException));
  }

  async checkRoles(context: ExecutionContext): Promise<boolean> {
    const notFound = ErrorMessage.notFound('Role');
    const request = context.switchToHttp().getRequest<customRequest>();
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const rolesId =
      request.user.role ?? throwError(notFound, NotFoundException);
    const rolesName = await this.findRolesName(rolesId, notFound);

    return requiredRoles.includes(rolesName);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicConfig = publics.config(this.reflector, context);
    const checkOwner = this.owner.checkOwner(context);
    const checkRoles = await this.checkRoles(context);

    if (publicConfig || checkOwner || checkRoles) return true;

    throwError(ErrorMessage.accessDenied('Role'), ForbiddenException);
  }
}
