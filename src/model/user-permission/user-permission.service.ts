import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
import { PrismaService } from 'src/common/prisma.service';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { UserPermissionResponse } from './user-permission.interface';
import { UserService } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';
import { throwError } from 'src/utils/throwError';
import { UserPermissionDto } from './user-permission.validation';
import { userPermission } from '@prisma/client';

@Injectable()
export class UserPermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly permission: PermissionService,
    private readonly user: UserService,
  ) {
    this.logger.setContext(UserPermissionService.name);
  }

  private async validateExisiting({
    name,
    userId,
  }: UserPermissionDto): Promise<userPermission> {
    return await this.prisma.userPermission.findFirstOrThrow({
      where: { userId, permission: { name } },
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<WebResponse<UserPermissionResponse>> {
    const user = await this.user.findByIdentifier(userId);
    const userPermission = await this.prisma.userPermission.findMany({
      where: { userId },
      select: {
        id: true,
        permission: { select: { id: true, name: true } },
      },
    });
    if (userPermission.length === 0)
      throwError(ErrorMessage.notFound('User Permission'), NotFoundException);
    return {
      message: Messages.get('User Permission'),
      data: {
        user: { id: user.id, username: user.username },
        userPermission,
      },
    };
  }

  async create({ name, userId }: UserPermissionDto): Promise<WebResponse> {
    await this.user.findById(userId);
    const permission = (await this.permission.findByName(name)).data;
    const up = await this.validateExisiting({ name, userId });
    if (up)
      return throwError(
        ErrorMessage.alreadyExist('User Permission'),
        ConflictException,
      );
    return await this.prisma.userPermission
      .create({ data: { userId, permissionId: permission?.id } })
      .then(() => ({ message: Messages.create('User Permission') }));
  }

  async delete({ name, userId }: UserPermissionDto) {
    await this.user.findById(userId);
    await this.permission.findByName(name);
    const up = await this.validateExisiting({ name, userId });

    return await this.prisma
      .$transaction(async (tx) => {
        await tx.userPermission.count({ where: { userId } }).then((count) => {
          if (count <= 1)
            throwError(
              ErrorMessage.alreadyExist('User Permission'),
              ConflictException,
            );
        });
        await tx.userPermission.delete({ where: { id: up.id } });
      })
      .then(() => ({ message: Messages.delete('User Permission') }));
  }
}
