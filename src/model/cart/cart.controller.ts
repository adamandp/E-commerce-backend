import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { WebResponse } from '../../common/common.interface';
import { CartItem } from '@prisma/client';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CartDto } from './cart.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Post('')
  @Roles('E-Commerce')
  @UseGuards(OwnerGuard)
  async create(@Body() request: CartDto): Promise<WebResponse> {
    return await this.service.create(request);
  }

  @Get('')
  @Roles('Admin')
  async findAllCartItem(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<Partial<CartItem>[]>> {
    return await this.service.findAllCartItem(pagination);
  }

  @Get(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async findCartByUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse> {
    return await this.service.findCartByUser(id, pagination);
  }

  @Delete('')
  @UseGuards(OwnerGuard)
  async deleteProduct(@Body() request: CartDto): Promise<WebResponse> {
    return await this.service.deleteProduct(request);
  }
}
