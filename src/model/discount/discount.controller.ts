import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { WebResponse } from 'src/common/common.interface';
import { Discount } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { DiscountCreateDTO, DiscountUpdateDTO } from './discount.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Roles('Admin')
  create(@Body() request: DiscountCreateDTO): Promise<WebResponse> {
    return this.discountService.create(request);
  }

  @Get()
  @Roles('Admin')
  findAll(@Query() request: PaginationDto): Promise<WebResponse<Discount[]>> {
    return this.discountService.findAll(request);
  }

  @Get(':id')
  @Roles('Admin')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Discount>> {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: DiscountUpdateDTO,
  ) {
    return this.discountService.update(id, request);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.discountService.remove(id);
  }
}
