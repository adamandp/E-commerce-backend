import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WebResponse } from 'src/common/common.interface';
import { ShippingData, ShippingResponse } from './shipment.interface';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ErrorMessage, Messages } from 'src/utils/messages';
import { Shipment } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { secret } from 'src/config/secret.config';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { CostDto } from './shipment.validation';
import { ShipmentCreateDTO } from '../order/order.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class ShipmentService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
    private logger: PinoLogger,
    private user: UserService,
  ) {
    logger.setContext(ShipmentService.name);
  }

  async cost(request: CostDto): Promise<WebResponse<ShippingData[]>> {
    const data = {
      ...request,
      courier:
        'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse',
    };
    return await firstValueFrom(
      this.httpService.post<ShippingResponse>(
        `${secret.baseurl.rajaongkir}/calculate/domestic-cost`,
        data,
        {
          headers: {
            key: secret.key.rajaongkir,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    )
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(
          ErrorMessage.create('Shipping cost'),
        );
      })
      .then((response) => {
        return {
          message: response.data.meta.message,
          status: response.data.meta.code,
          data: response.data.data,
        };
      });
  }

  async create(request: ShipmentCreateDTO) {
    return await this.prisma.shipment
      .create({ data: { status: 'ON_PROCESS', ...request } })
      .then(() => ({ message: Messages.create('Shipment') }));
  }

  async findAll({
    page,
    limit,
  }: PaginationDto): Promise<WebResponse<Shipment[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return Promise.all([
      this.prisma.shipment.findMany({
        skip,
        take: limit,
      }),
      this.prisma.shipment.count(),
    ]).then(([discounts, total]) => {
      return {
        message: Messages.get('Shipment'),
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

  async findShipmentByUser(
    userId: string,
    { page, limit }: PaginationDto,
  ): Promise<WebResponse<Partial<Shipment>[]>> {
    await this.user.findByIdentifier(userId);
    const skip = Math.max((page - 1) * limit, 0);
    return await this.prisma.shipment
      .findMany({
        skip,
        take: limit,
        where: { Order: { userId } },
      })
      .then((items) => {
        return {
          message: Messages.get('Cart'),
          data: items,
          paging: {
            current_page: page,
            total_items: items.length,
            total_pages: Math.ceil(items.length / limit),
            limit,
          },
        };
      });
  }
}
