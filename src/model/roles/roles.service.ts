import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ErrorMessage, HttpMessage } from 'src/utils/messages';
import { WebResponse } from '../../common/common.interface';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { throwError } from 'src/utils/throwError';
import { PaginationDto } from 'src/common/common.validation';
import { RolesResponse } from './roles.interface';

@Injectable()
export class RolesService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    logger.setContext(RolesService.name);
  }

  private rolesOmit = { createdAt: true, updatedAt: true };

  private searchCondition(query?: string): Prisma.RolesWhereInput {
    return query ? { name: { contains: query, mode: 'insensitive' } } : {};
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<RolesResponse[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.roles.findMany({
        skip,
        take: limit,
        omit: { createdAt: true, updatedAt: true },
        where: this.searchCondition(query),
      }),
      this.prisma.roles.count({ where: this.searchCondition(query) }),
    ]).then(([roles, total]) => {
      if (total === 0)
        throwError(ErrorMessage.notFound('Roles'), NotFoundException);
      return {
        message: HttpMessage.getMessage('Category'),
        data: roles,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findByName(name: string): Promise<WebResponse<RolesResponse>> {
    return {
      message: HttpMessage.getMessage('Roles'),
      data: await this.prisma.roles.findUniqueOrThrow({
        where: { name },
        omit: this.rolesOmit,
      }),
    };
  }

  async findById(id: string): Promise<WebResponse<RolesResponse>> {
    return {
      message: HttpMessage.getMessage('Roles'),
      data: await this.prisma.roles.findUniqueOrThrow({
        where: { id },
        omit: this.rolesOmit,
      }),
    };
  }
}
