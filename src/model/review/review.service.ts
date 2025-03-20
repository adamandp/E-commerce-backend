import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
import { PrismaService } from 'src/common/prisma.service';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { checkUpdate } from 'src/utils/updatedFields';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { throwError } from 'src/utils/throwError';
import {
  ReviewCreateDto,
  ReviewDeleteDto,
  ReviewUpdateDto,
} from './review.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly user: UserService,
    private readonly product: ProductService,
  ) {
    this.logger.setContext(ReviewService.name);
  }

  private async findReviewById(id: string): Promise<Partial<Review>> {
    return await this.prisma.review.findFirstOrThrow({ where: { id } });
  }

  async create(request: ReviewCreateDto): Promise<WebResponse> {
    await this.user.findById(request.userId);
    await this.product.findById(request.productId);
    return await this.prisma
      .$transaction(async (tx) => {
        await tx.review
          .findFirst({
            where: { userId: request.userId, productId: request.productId },
          })
          .then((r) => {
            if (r)
              throwError(
                ErrorMessage.alreadyExist('Review'),
                ConflictException,
              );
          });
        await this.prisma.review.create({ data: request });
      })
      .then(() => ({ message: Messages.create('Review') }));
  }

  async findRatingByProductId(productId: string): Promise<number> {
    await this.product.findById(productId);
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((avg) => avg._avg.rating || 0);
  }

  async findByProductId(
    productId: string,
    { page, limit }: PaginationDto,
  ): Promise<WebResponse<Partial<Review>[]>> {
    await this.product.findById(productId);
    const skip = Math.max((page - 1) * limit, 0);
    return Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
        where: { productId },
        orderBy: { createdAt: 'desc' },
        omit: { productId: true },
      }),
      this.prisma.review.count({ where: { productId } }),
    ]).then(([reviews, total]) => {
      if (!total)
        throwError(ErrorMessage.notFound('Review'), NotFoundException);
      return {
        message: Messages.get('Review'),
        data: reviews,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async update(request: ReviewUpdateDto): Promise<WebResponse> {
    const review = await this.findReviewById(request.id);
    return await this.prisma.review
      .update({ where: { id: request.id }, data: checkUpdate(request, review) })
      .then(() => ({ message: Messages.update('Review') }));
  }

  async remove({ id }: ReviewDeleteDto): Promise<WebResponse> {
    await this.findReviewById(id);
    return await this.prisma.review
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete('Review') }));
  }
}
