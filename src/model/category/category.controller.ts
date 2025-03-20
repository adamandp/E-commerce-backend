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
} from '@nestjs/common';
import { WebResponse } from '../../common/common.interface';
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { PaginationDto } from 'src/common/common.validation';
import { CategoryCreateDTO, CategoryUpdateDTO } from './category.validation';

@Controller('category')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Post()
  @Roles('Admin')
  async create(@Body() request: CategoryCreateDTO) {
    return await this.service.create(request);
  }

  @Get()
  @Public()
  async findAll(
    @Query() request: PaginationDto,
  ): Promise<WebResponse<Partial<Category>[]>> {
    return await this.service.findAll(request);
  }

  @Get(':id')
  @Public()
  async findByid(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Partial<Category>>> {
    return await this.service.findByid(id);
  }

  @Put(':id')
  @Roles('Admin')
  async update(@Body() request: CategoryUpdateDTO): Promise<WebResponse> {
    return this.service.update(request);
  }

  @Delete(':id')
  @Roles('Admin')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<WebResponse> {
    return this.service.delete(id);
  }
}
