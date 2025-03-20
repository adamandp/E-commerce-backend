import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { WebResponse } from '../../common/common.interface';
import { Messages } from 'src/utils/messages';
import { checkUpdate } from 'src/utils/updatedFields';
import { PinoLogger } from 'nestjs-pino';
import { CategoryCreateDTO, CategoryUpdateDTO } from './category.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CategoryService.name);
  }

  async create(categories: CategoryCreateDTO): Promise<WebResponse> {
    return await this.prisma.category
      .create({ data: categories })
      .then(() => ({ message: Messages.create('User') }));
  }

  async findAll({
    page,
    limit,
  }: PaginationDto): Promise<WebResponse<Partial<Category>[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        select: { id: true, name: true },
      }),
      this.prisma.category.count(),
    ]).then(([categories, total]) => {
      return {
        message: Messages.get('Category'),
        data: categories,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findByid(id: string): Promise<WebResponse<Partial<Category>>> {
    return {
      message: Messages.get('Category'),
      data: await this.prisma.category.findUniqueOrThrow({
        where: { id },
        select: { id: true, name: true },
      }),
    };
  }

  async update({ id, name }: CategoryUpdateDTO): Promise<WebResponse> {
    checkUpdate({ name }, (await this.findByid(id)).data);
    return await this.prisma.category
      .update({ where: { id }, data: name })
      .then(() => ({ message: Messages.delete('Category') }));
  }

  async delete(id: string): Promise<WebResponse> {
    return await this.prisma.category
      .delete({ where: { id: (await this.findByid(id)).data?.id } })
      .then(() => ({ message: Messages.delete('Category') }));
  }
}
