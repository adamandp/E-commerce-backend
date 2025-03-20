import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { WebResponse } from '../../common/common.interface';
import { Cart, CartItem } from '@prisma/client';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { CartDto } from './cart.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class CartService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private readonly product: ProductService,
  ) {
    logger.setContext(CartService.name);
  }

  private async findCart(userId: string): Promise<Cart> {
    return await this.prisma.cart.findUniqueOrThrow({ where: { userId } });
  }

  private async findCartItem(
    cartId: string,
    productId: string,
  ): Promise<CartItem | null> {
    return await this.prisma.cartItem.findFirst({
      where: { CartId: cartId, productId: productId },
    });
  }

  async create({ userId, productId, quantity }: CartDto): Promise<WebResponse> {
    await this.user.findByIdentifier(userId);
    await this.product.findById(productId);
    const cart = await this.findCart(userId);
    const item = await this.findCartItem(cart.id, productId);
    if (item) {
      return this.prisma.cartItem
        .update({
          where: { id: item.id },
          data: { quantity: Number(item.quantity) + quantity },
        })
        .then(() => {
          return { message: Messages.update('Cart') };
        });
    } else {
      return this.prisma.cartItem
        .create({
          data: {
            CartId: cart.id,
            productId: productId,
            quantity: quantity,
          },
        })
        .then(() => {
          return { message: Messages.create('Cart') };
        });
    }
  }

  async findAllCartItem({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Partial<CartItem>[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await this.prisma.cartItem
      .groupBy({
        by: ['productId'],
        orderBy: { productId: 'asc' },
        _sum: { quantity: true },
        skip,
        take: limit,
        where: { products: { name: query } },
      })
      .then((items) => {
        return {
          message: Messages.get('Cart'),
          data: items.map(
            (item: { productId: string; _sum: { quantity: number } }) => {
              return {
                productId: item.productId,
                quantity: item._sum.quantity,
              };
            },
          ),
          paging: {
            current_page: page,
            total_items: items.length,
            total_pages: Math.ceil(items.length / limit),
            limit,
          },
        };
      });
  }

  async findCartByUser(id: string, { page, limit }: PaginationDto) {
    await this.user.findByIdentifier(id);
    const skip = Math.max((page - 1) * limit, 0);
    return await this.prisma.cartItem
      .groupBy({
        by: ['productId'],
        where: { CartId: (await this.findCart(id)).id },
        _sum: { quantity: true },
        orderBy: { productId: 'asc' },
        skip,
        take: limit,
      })
      .then((items) => {
        return {
          message: Messages.get('Cart'),
          data: items.map(
            (item: { productId: string; _sum: { quantity: number } }) => {
              return {
                productId: item.productId,
                quantity: item._sum.quantity,
              };
            },
          ),
          paging: {
            current_page: page,
            total_items: items.length,
            total_pages: Math.ceil(items.length / limit),
            limit,
          },
        };
      });
  }

  async deleteProduct({
    productId,
    quantity,
    userId,
  }: CartDto): Promise<WebResponse> {
    await this.user.findById(userId ?? '');
    await this.product.findById(productId ?? '');
    const cart = await this.findCart(userId ?? '');
    const item = await this.findCartItem(cart.id, productId ?? '');
    const validate = Number(item?.quantity) - Number(quantity);
    if (validate < 0) {
      return { message: ErrorMessage.delete('Cart') };
    }
    if (item?.quantity === quantity) {
      return await this.prisma.cartItem
        .delete({ where: { id: item?.id } })
        .then(() => {
          return { message: Messages.delete('Cart') };
        });
    } else {
      return await this.prisma.cartItem
        .update({
          where: { id: item?.id },
          data: { quantity: Number(item?.quantity) - Number(quantity) },
        })
        .then(() => {
          return { message: Messages.update('Cart') };
        });
    }
  }
}
