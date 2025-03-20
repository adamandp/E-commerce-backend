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
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { WebResponse } from '../../common/common.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { ProductCreateDto, ProductUpdateDto } from './product.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('product')
export class ProductController {
  constructor(private service: ProductService) {}

  @Post()
  @Roles('Admin')
  create(
    @Body() request: ProductCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse> {
    return this.service.create(request, file);
  }

  @Get()
  @Public()
  async findAll(
    @Query() request: PaginationDto,
  ): Promise<WebResponse<Partial<Product>[]>> {
    return await this.service.findAll(request);
  }

  @Get(':id')
  @Public()
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Partial<Product>>> {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('Admin')
  async update(
    @Body() request: ProductUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse> {
    return this.service.update(request, file);
  }

  @Delete(':id')
  @Roles('Admin')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.service.delete(id);
  }
}
