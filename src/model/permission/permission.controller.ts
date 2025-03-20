import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { WebResponse } from 'src/common/common.interface';
import { Permission as PermissionType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { PaginationDto } from 'src/common/common.validation';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get()
  @Roles('Admin')
  async findAll(
    @Query() request: PaginationDto,
  ): Promise<WebResponse<Partial<PermissionType>[]>> {
    return await this.service.findAll(request);
  }

  @Get('search')
  @Roles('Admin')
  findByName(
    @Query('name') name: string,
  ): Promise<WebResponse<Partial<PermissionType>>> {
    return this.service.findByName(name);
  }

  @Get(':id')
  @Roles('Admin')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Partial<PermissionType>>> {
    return this.service.findById(id);
  }
}
