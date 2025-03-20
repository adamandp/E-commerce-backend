import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { getTokenResponse, WebhookResponse } from './payment.interface';
import { WebResponse } from '../../common/common.interface';
import { PaymentService } from './payment.service';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { Payment } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { CreditCardChargeDTO, PaymentUpdateDTO } from './payment.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get('token')
  @UseGuards(OwnerGuard)
  async getToken(
    @Body() request: CreditCardChargeDTO,
  ): Promise<getTokenResponse> {
    return await this.service.getToken(request);
  }

  @Post('webhook')
  async handleMidtransWebhook(@Body() payload: WebhookResponse) {
    return this.service.webhook(payload);
  }

  @Get()
  @Roles('Admin')
  async findAll(
    @Query() request: PaginationDto,
  ): Promise<WebResponse<Payment[]>> {
    return await this.service.findAll(request);
  }

  @Get(':id')
  @UseGuards(OwnerGuard)
  async findByUserId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<Payment[]>> {
    return await this.service.findByUserId(id, pagination);
  }

  @Put()
  async update(@Body() request: PaymentUpdateDTO): Promise<WebResponse> {
    return await this.service.update(request);
  }
}
