import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { WebResponse } from 'src/common/common.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { PaginationDto } from 'src/common/common.validation';
import { RolesResponse } from './roles.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @Roles('Admin')
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<RolesResponse[]>> {
    return this.service.findAll(pagination);
  }

  @Get('search')
  @Roles('Admin')
  findByName(@Query('name') name: string): Promise<WebResponse<RolesResponse>> {
    return this.service.findByName(name);
  }

  @Get(':id')
  @Roles('Admin')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<RolesResponse>> {
    return this.service.findById(id);
  }
}
