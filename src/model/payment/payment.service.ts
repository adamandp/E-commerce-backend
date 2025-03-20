import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  charge,
  ChargeDTO,
  CreditCardChargeDTO,
  PaymentUpdateDTO,
} from './payment.validation';
import {
  ChargeResponse,
  getTokenResponse,
  WebhookResponse,
} from './payment.interface';
import { omit } from 'lodash';
import { ErrorMessage, Messages } from 'src/utils/messages';
import * as midtransClient from 'midtrans-client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/common/prisma.service';
import { WebResponse } from '../../common/common.interface';
import { secret } from 'src/config/secret.config';
import { PinoLogger } from 'nestjs-pino';
import { throwError } from 'src/utils/throwError';
import { UserService } from '../user/user.service';
import { Payment } from '@prisma/client';
import { validateWithZod } from 'src/utils/validation';
import { createPayload, updatePayload } from 'src/utils/midtrans';
import { PaymentPayloadDTO } from '../order/order.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class PaymentService {
  private core: midtransClient.CoreApi;
  constructor(
    private readonly logger: PinoLogger,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {
    this.logger.setContext(PaymentService.name);
    this.core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: secret.key.midtrans.server as string,
      clientKey: secret.key.midtrans.client as string,
    });
  }

  async getToken(request: CreditCardChargeDTO): Promise<getTokenResponse> {
    return await firstValueFrom(
      this.httpService.get<getTokenResponse>(
        `${secret.baseurl.midtrans}/v2/token`,
        {
          params: {
            ...request,
            client_key: secret.key.midtrans.client,
          },
          headers: {
            Accept: 'application/json',
          },
        },
      ),
    )
      .then((response) => response.data)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(ErrorMessage.get('Token'));
      });
  }
  async charge(request: ChargeDTO): Promise<ChargeResponse> {
    const payload = validateWithZod(charge, request);
    return await this.core
      .charge(payload)
      .then((response) =>
        omit(response, [
          'currency',
          'payment_type',
          'status_code',
          'status_message',
          'transaction_id',
          'order_id',
          'merchant_id',
          'fraud_status',
        ]),
      )
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(ErrorMessage.create('Order'));
      });
  }

  async webhook(payload: WebhookResponse) {
    const { order_id, transaction_status, fraud_status } = payload;
    const statusMap: Record<string, string> = {
      capture: fraud_status === 'accept' ? 'success' : 'pending',
      settlement: 'success',
      cancel: 'failure',
      deny: 'failure',
      expire: 'failure',
      pending: 'waiting payment',
    };
    const status = statusMap[transaction_status] || 'pending';

    return await this.prisma.order
      .update({
        where: { id: order_id },
        data: { status },
      })
      .then(() => ({ message: 'Payment status updated', status }));
  }

  async create(request: PaymentPayloadDTO) {
    const payload = createPayload(request);
    const response = await this.charge(payload);

    const data = updatePayload(response, request);

    return await this.prisma.payment.create({ data });
  }

  async findAll({
    page,
    limit,
  }: PaginationDto): Promise<WebResponse<Payment[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      await this.prisma.payment.findMany({
        skip,
        take: limit,
      }),
      await this.prisma.payment.count({}),
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
  ): Promise<WebResponse<Payment[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    await this.user.findByIdentifier(userId);
    return {
      message: Messages.get('Product'),
      data: await this.prisma.payment
        .findMany({
          skip,
          take: limit,
          where: { order: { userId } },
        })
        .then((p) => {
          if (!p.length)
            throwError(ErrorMessage.notFound('Product'), NotFoundException);
          return p;
        }),
    };
  }

  async update(request: PaymentUpdateDTO): Promise<WebResponse> {
    return await this.prisma
      .$transaction(async (tx) => {
        await tx.order.findFirstOrThrow({ where: { id: request.orderId } });
        await tx.order.update({
          where: { id: request.orderId },
          data: request,
        });
      })
      .then(() => ({ message: Messages.update('Order') }));
  }
}
