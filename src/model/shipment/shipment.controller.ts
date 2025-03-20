import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { WebResponse } from 'src/common/common.interface';
import { ShippingData } from './shipment.interface';
import { Shipment } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { CostDto } from './shipment.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly service: ShipmentService) {}

  @Post('cost')
  @UsePipes()
  async cost(@Body() request: CostDto): Promise<WebResponse<ShippingData[]>> {
    return await this.service.cost(request);
  }

  @Get()
  @Roles('Admin')
  findAll(@Query() request: PaginationDto): Promise<WebResponse<Shipment[]>> {
    return this.service.findAll(request);
  }

  @Get(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  findShipmentByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() request: PaginationDto,
  ): Promise<WebResponse<Partial<Shipment>[]>> {
    return this.service.findShipmentByUser(userId, request);
  }
}
