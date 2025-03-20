import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { WebResponse } from '../../common/common.interface';
import { Permission, Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class PermissionService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(PermissionService.name);
  }

  private permissionOmit = {
    createdAt: true,
    updatedAt: true,
  };

  private searchCondition(query?: string): Prisma.PermissionWhereInput {
    return query
      ? {
          name: { contains: query, mode: 'insensitive' },
        }
      : {};
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Partial<Permission>[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.permission.findMany({
        skip,
        take: limit,
        omit: this.permissionOmit,
        where: this.searchCondition(query),
      }),
      this.prisma.permission.count({
        where: this.searchCondition(query),
      }),
    ]).then(([permission, total]) => {
      if (total === 0) {
        this.logger.error(ErrorMessage.notFound('Permission'));
        throw new NotFoundException(ErrorMessage.notFound('Permission'));
      }
      return {
        message: Messages.get('Permission'),
        data: permission,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findByName(name: string): Promise<WebResponse<Partial<Permission>>> {
    return {
      message: Messages.get('Permission'),
      data: await this.prisma.permission.findUniqueOrThrow({
        where: { name },
        omit: this.permissionOmit,
      }),
    };
  }

  async findById(id: string): Promise<WebResponse<Partial<Permission>>> {
    return {
      message: Messages.get('Permission'),
      data: await this.prisma.permission.findUniqueOrThrow({
        where: { id },
        omit: this.permissionOmit,
      }),
    };
  }
}
