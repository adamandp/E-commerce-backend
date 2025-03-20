import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { AddressService } from './address.service';
import { WebResponse } from '../../common/common.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import {
  AddressCreateDTO,
  AddressDeleteDTO,
  AddressUpdateDTO,
} from './address.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('address')
export class AddressController {
  constructor(private service: AddressService) {}

  @Post()
  @UseGuards(OwnerGuard)
  create(@Body() request: AddressCreateDTO): Promise<WebResponse> {
    return this.service.create(request);
  }

  @Get('')
  @Roles('Admin')
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<Address[]>> {
    return await this.service.findAll(pagination);
  }

  @Get(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async findByUserId(
    @Param('userId', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Address[]>> {
    return this.service.findByUserId(id);
  }

  @Put()
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async update(@Body() request: AddressUpdateDTO): Promise<WebResponse> {
    return this.service.update(request);
  }

  @Delete('')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async delete(@Body() request: AddressDeleteDTO): Promise<WebResponse> {
    return this.service.delete(request);
  }
}
