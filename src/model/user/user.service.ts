import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from '../../common/common.interface';
import { Prisma, User } from '@prisma/client';
import { Messages, ErrorMessage } from '../../utils/messages';
import { regex } from 'src/utils/regex';
import { UserCreateDto, UserUpdateDto } from './user.validation';
import { PaginationDto } from 'src/common/common.validation';
import { checkUpdate } from 'src/utils/updatedFields';
import { UploadService } from 'src/common/upload.service';
import { RolesService } from '../roles/roles.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
    private readonly roles: RolesService,
    private readonly permission: PermissionService,
  ) {
    this.logger.setContext(UserService.name);
  }

  private userOmit: Prisma.UserOmit = {
    password: true,
    regionId: true,
    createdAt: true,
    updatedAt: true,
  };

  private userSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    fullName: true,
    email: true,
    phoneNumber: true,
    imageUrl: true,
    isActive: true,
    gender: true,
    userRoles: {
      select: {
        id: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    userPermissions: {
      select: {
        id: true,
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    Cart: {
      select: {
        id: true,
      },
    },
  };

  private searchCondition(query?: string): Prisma.UserWhereInput {
    return query
      ? {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { phoneNumber: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};
  }

  private validateIdentifierType(identifier: string): 'email' | 'phone' {
    let message: string = 'identifier';
    if (regex.email.test(identifier)) return (message = 'email');
    if (regex.phone.test(identifier)) return (message = 'phone');

    throw new BadRequestException(ErrorMessage.validation(message));
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException(
        ErrorMessage.create('Hashed password'),
      );
    });
  }

  async create({
    identifier,
    username,
    fullName,
    password,
    role,
    permission,
  }: UserCreateDto): Promise<WebResponse> {
    const identifierType = this.validateIdentifierType(identifier);
    const roles = await this.roles.findByName(role);
    const permissions = await Promise.all(
      permission.map((p) => this.permission.findByName(p)),
    );
    return await this.prisma
      .$transaction(async (tx) => {
        const u = await tx.user.create({
          data: {
            username,
            fullName,
            password: await this.hashPassword(password),
            email: identifierType === 'email' ? identifier : null,
            phoneNumber: identifierType === 'phone' ? identifier : null,
            userRoles: { create: {} },
            Cart: { create: {} },
          },
        });
        await tx.userRoles.update({
          where: { userId: u.id },
          data: { roles: { connect: { id: roles.data?.id } } },
        });
        await tx.userPermission.createMany({
          data: permissions.map((p) => ({
            userId: u.id,
            permissionId: p.data?.id,
          })),
        });
      })
      .then(() => ({ message: Messages.create('User') }));
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Partial<User>[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      await this.prisma.user.findMany({
        skip,
        take: limit,
        // select: this.userSelect,
        omit: this.userOmit,
        where: this.searchCondition(query),
      }),
      await this.prisma.user.count({ where: this.searchCondition(query) }),
    ]).then(([users, total]) => {
      if (!total) throw new NotFoundException(ErrorMessage.notFound('User'));
      return {
        message: Messages.get('User'),
        data: users,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / (limit || 1)),
          limit,
        },
      };
    });
  }

  async findByIdentifier(identifier: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: {
        OR: [
          { id: identifier },
          { username: identifier },
          { email: identifier },
          { fullName: identifier },
        ],
      },
    });
  }

  async findById(id: string): Promise<WebResponse<Partial<User>>> {
    return {
      message: Messages.get('User'),
      data: await this.prisma.user.findUniqueOrThrow({
        where: { id },
        omit: this.userOmit,
      }),
    };
  }

  async update(
    id: string,
    request: UserUpdateDto,
    file?: Express.Multer.File,
  ): Promise<WebResponse> {
    if (request.password)
      request.password = await this.hashPassword(request.password);
    if (file) {
      const fileName = request.fullName?.trim() || `user_${id}`;
      const result = await this.upload.uploadImage(file, fileName);
      request.imageUrl = result.secure_url;
    }
    return this.prisma.user
      .update({
        where: { id },
        data: checkUpdate(request, (await this.findById(id)).data),
      })
      .then(() => ({ message: Messages.update('User') }));
  }

  async delete(id: string): Promise<WebResponse> {
    return this.prisma.user
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete('User') }));
  }
}
