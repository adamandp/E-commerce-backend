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
import { OrderService } from './order.service';
import { OrderCreateDTO, OrderUpdateDTO } from './order.validation';
import { WebResponse } from 'src/common/common.interface';
import { PaginationDto } from 'src/common/common.validation';
import { OrderFindRes } from './order.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  async create(@Body() request: OrderCreateDTO): Promise<WebResponse> {
    return await this.service.create(request);
  }

  @Get()
  @Roles('Admin')
  async findAll(
    @Query() request: PaginationDto,
  ): Promise<WebResponse<OrderFindRes[]>> {
    return await this.service.findAll(request);
  }

  @Get(':id')
  @UseGuards(OwnerGuard)
  async findOrderByUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<OrderFindRes>> {
    return await this.service.findByUserId(id, pagination);
  }

  @Put()
  async updateOrder(@Body() request: OrderUpdateDTO): Promise<WebResponse> {
    return await this.service.update(request);
  }
}
