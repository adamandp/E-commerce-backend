import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { Messages, ErrorMessage } from 'src/utils/messages';
import { WebResponse } from '../../common/common.interface';
import { slugMaker } from 'src/utils/slug';
import { checkUpdate } from 'src/utils/updatedFields';
import { PinoLogger } from 'nestjs-pino';
import { CategoryService } from '../category/category.service';
import { UploadService } from 'src/common/upload.service';
import { ProductCreateDto, ProductUpdateDto } from './product.validation';
import { PaginationDto } from 'src/common/common.validation';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductResponse } from './product.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly category: CategoryService,
    private readonly upload: UploadService,
  ) {
    this.logger.setContext(ProductService.name);
  }

  private searchCondition(query?: string): Prisma.ProductWhereInput {
    return query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { Category: { name: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : {};
  }

  private productOmit = { createdAt: true, updatedAt: true, tags: true };

  async create(
    request: ProductCreateDto,
    file?: Express.Multer.File,
  ): Promise<WebResponse> {
    await this.category.findByid(request.categoryId);
    if (file) {
      const fileName = request.name?.trim();
      const result = await this.upload.uploadImage(file, fileName);
      request.imageUrl = result.secure_url;
    }
    return await this.prisma.product
      .create({
        data: {
          ...request,
          slug: slugMaker(request.name),
        },
      })
      .then(() => ({ message: Messages.create('Product') }));
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Partial<Product>[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        omit: this.productOmit,
        where: this.searchCondition(query),
      }),
      this.prisma.product.count({ where: this.searchCondition(query) }),
    ]).then(([products, total]) => {
      if (!total) throw new NotFoundException(ErrorMessage.notFound('Product'));
      return {
        message: Messages.get('Product'),
        data: products,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findById(id: string): Promise<WebResponse<ProductResponse>> {
    return {
      message: Messages.get('User'),
      data: await this.prisma.product.findUniqueOrThrow({
        where: { id },
        omit: this.productOmit,
      }),
    };
  }

  async update(
    request: ProductUpdateDto,
    file?: Express.Multer.File,
  ): Promise<WebResponse> {
    const product = await this.findById(request.id);
    if (file) {
      const fileName =
        request.name?.trim() ||
        product.data?.name?.trim() ||
        `product_${request.id}`;
      const result = await this.upload.uploadImage(file, fileName);
      request.imageUrl = result.secure_url;
    }
    const data = (await this.findById(request.id)).data;
    checkUpdate(request, { ...data, price: Number(data?.price) });
    const updatedData = {
      ...request,
      price: Decimal(request.price),
      slug: slugMaker(request.name),
    };
    return await this.prisma.product
      .update({
        where: { id: request.id },
        data: updatedData,
      })
      .then(() => ({ message: Messages.update('Product') }));
  }

  async delete(id: string): Promise<WebResponse> {
    return await this.prisma.product
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete('Product') }));
  }
}
