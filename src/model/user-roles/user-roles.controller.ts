import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { WebResponse } from 'src/common/common.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRolesResponse } from './user-roles.interface';
import { UserRolesUpdateDto } from './user-roles.validation';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly service: UserRolesService) {}

  @Put()
  @Roles('Admin')
  update(@Body() request: UserRolesUpdateDto): Promise<WebResponse> {
    return this.service.update(request);
  }

  @Get('/:id')
  @Roles('Admin')
  findUserRolesByUserId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<UserRolesResponse>> {
    return this.service.findByUserId(id);
  }
}
