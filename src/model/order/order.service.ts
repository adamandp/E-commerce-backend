import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WebResponse } from '../../common/common.interface';
import { Prisma } from '@prisma/client';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { throwError } from 'src/utils/throwError';
import { OrderFindRes } from './order.interface';
import { ShipmentService } from '../shipment/shipment.service';
import { PaymentService } from '../payment/payment.service';
import { CartService } from '../cart/cart.service';
import { Decimal } from '@prisma/client/runtime/library';
import {
  OrderCreateDTO,
  OrderItemCreateDTO,
  OrderItemRequestDTO,
  OrderUpdateDTO,
} from './order.validation';
import { PaginationDto } from 'src/common/common.validation';
import { ProductResponse } from '../product/product.interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private readonly product: ProductService,
    private readonly shipment: ShipmentService,
    private readonly payment: PaymentService,
    private readonly cart: CartService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  private orderSelect: Prisma.OrderSelect = {
    id: true,
    User: { select: { id: true, username: true } },
    totalPrice: true,
    status: true,
  };

  private async findManyProduct(
    productId: string[],
  ): Promise<ProductResponse[]> {
    return await Promise.all(
      productId.map(async (id) => {
        return await this.product
          .findById(id)
          .then(
            (res) =>
              res.data ??
              throwError(ErrorMessage.notFound('Product'), NotFoundException),
          );
      }),
    );
  }

  private async deleteManyCartItem(
    userId: string,
    orderItem: OrderItemRequestDTO[],
  ) {
    await Promise.all(
      orderItem.map(async (item) => {
        await this.cart.deleteProduct({
          userId: userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }),
    );
  }

  async createManyOrderItem(orderItem: OrderItemCreateDTO[]) {
    return await this.prisma.orderItem.createMany({
      data: orderItem.map((item) => ({
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  async create(request: OrderCreateDTO) {
    const {
      order: orderRequest,
      orderItem: OrderItemRequest,
      shipment: shipmentRequest,
      payment: paymentRequest,
    } = request;
    await this.user.findByIdentifier(orderRequest.userId);
    const productId: string[] = OrderItemRequest.map((item) => item.productId);
    const products = await this.findManyProduct(productId);
    const totalPrice = OrderItemRequest.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return Number(product?.price) * item.quantity;
    }).reduce((total, item) => total + item, 0);

    const order = {
      ...orderRequest,
      totalPrice: Decimal(totalPrice),
      status: 'pending',
    };

    const { id } = await this.prisma.order.create({
      data: order,
    });

    const orderitems = OrderItemRequest.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: product ? Number(product.price) : 0,
      };
    });

    const shipment = {
      orderId: id,
      ...shipmentRequest,
    };

    const payment = {
      orderId: id,
      amount: totalPrice,
      ...paymentRequest,
    };

    await Promise.all([
      this.createManyOrderItem(orderitems),
      this.payment.create(payment),
      this.shipment.create(shipment),
      this.deleteManyCartItem(orderRequest.userId, OrderItemRequest),
    ]);

    return { message: Messages.create('Order') };
  }

  async findAll({
    page,
    limit,
  }: PaginationDto): Promise<WebResponse<OrderFindRes[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      await this.prisma.order.findMany({
        skip,
        take: limit,
        select: this.orderSelect,
      }),
      await this.prisma.cart.count({}),
    ]).then(([order, total]) => {
      if (!total) {
        throwError(ErrorMessage.notFound('Product'), NotFoundException);
      }
      return {
        message: Messages.get('Product'),
        data: order,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / (limit || 1)),
          limit,
        },
      };
    });
  }

  async findByUserId(
    userId: string,
    { page, limit }: PaginationDto,
  ): Promise<WebResponse<OrderFindRes>> {
    const skip = Math.max((page - 1) * limit, 0);
    await this.user.findByIdentifier(userId);
    return await this.prisma.order
      .findFirstOrThrow({
        skip,
        take: limit,
        select: this.orderSelect,
        where: { userId },
      })
      .then((order) => {
        return {
          message: Messages.get('Product'),
          data: order,
        };
      });
  }

  async update(request: OrderUpdateDTO): Promise<WebResponse> {
    return await this.prisma
      .$transaction(async (tx) => {
        await tx.order.findFirstOrThrow({ where: { id: request.id } });
        await tx.order.update({
          where: { id: request.id },
          data: request,
        });
      })
      .then(() => ({ message: Messages.update('Order') }));
  }
}
