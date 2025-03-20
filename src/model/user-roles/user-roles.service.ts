import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { WebResponse } from 'src/common/common.interface';
import { UserRolesResponse } from './user-roles.interface';
import { RolesService } from '../roles/roles.service';
import { UserService } from '../user/user.service';
import { PinoLogger } from 'nestjs-pino';
import { UserRolesUpdateDto } from './user-roles.validation';
import { throwError } from 'src/utils/throwError';

@Injectable()
export class UserRolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly roles: RolesService,
    private readonly user: UserService,
  ) {
    this.logger.setContext(UserRolesService.name);
  }

  async findByUserId(userId: string): Promise<WebResponse<UserRolesResponse>> {
    await this.user.findByIdentifier(userId);
    return {
      message: Messages.get('User Permission'),
      data: await this.prisma.userRoles.findFirstOrThrow({
        where: { userId },
        select: {
          id: true,
          user: { select: { id: true, username: true } },
          roles: { select: { id: true, name: true } },
        },
      }),
    };
  }

  async update({ name, userId }: UserRolesUpdateDto): Promise<WebResponse> {
    await this.user.findById(userId);
    const roles = await this.roles.findByName(name);
    const exsitingRoles = (await this.findByUserId(userId)).data?.roles?.name;
    if (exsitingRoles === name)
      throwError(ErrorMessage.alreadyExist('User Roles'), ConflictException);
    return await this.prisma.userRoles
      .update({
        where: { userId },
        data: { rolesId: roles.data?.id },
      })
      .then(() => ({ message: Messages.update('User Roles') }));
  }
}
