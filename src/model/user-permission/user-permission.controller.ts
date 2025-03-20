import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { WebResponse } from 'src/common/common.interface';
import { UserPermissionResponse } from './user-permission.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { UserPermissionDto } from './user-permission.validation';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly service: UserPermissionService) {}

  @Post()
  @Roles('Admin')
  async create(request: UserPermissionDto): Promise<WebResponse> {
    return this.service.create(request);
  }

  @Get('/:id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async findByUserId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<UserPermissionResponse>> {
    return this.service.findByUserId(id);
  }

  @Delete('')
  @Roles('Admin')
  async delete(@Body() request: UserPermissionDto) {
    return this.service.delete(request);
  }
}
