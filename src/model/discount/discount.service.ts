import { Injectable } from '@nestjs/common';
import { WebResponse } from 'src/common/common.interface';
import { PrismaService } from '../../common/prisma.service';
import { Messages } from 'src/utils/messages';
import { Discount, Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { DiscountCreateDTO, DiscountUpdateDTO } from './discount.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(DiscountService.name);
  }

  private searchCondition(query?: string): Prisma.DiscountWhereInput {
    return query ? { name: { contains: query, mode: 'insensitive' } } : {};
  }

  async create(request: DiscountCreateDTO): Promise<WebResponse> {
    return await this.prisma.discount
      .create({ data: request })
      .then(() => ({ message: Messages.create('Discount') }));
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Discount[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return Promise.all([
      this.prisma.discount.findMany({
        skip,
        take: limit,
        where: this.searchCondition(query),
      }),
      this.prisma.discount.count({ where: this.searchCondition(query) }),
    ]).then(([discounts, total]) => {
      return {
        message: Messages.get('Discount'),
        data: discounts,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findOne(id: string): Promise<WebResponse<Discount>> {
    return {
      message: Messages.create('Discount'),
      data: await this.prisma.discount.findUniqueOrThrow({ where: { id } }),
    };
  }

  async update(id: string, request: DiscountUpdateDTO): Promise<WebResponse> {
    return await this.prisma.discount
      .update({ where: { id }, data: request })
      .then(() => ({ message: Messages.update('Discount') }));
  }

  async remove(id: string): Promise<WebResponse> {
    return await this.prisma.discount
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete('Discount') }));
  }
}
