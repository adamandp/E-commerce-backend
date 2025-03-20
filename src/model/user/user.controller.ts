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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../../common/common.interface';
import { User } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { NotAuthenticatedGuard } from 'src/common/guards/not-authenticated.guard';
import { Public } from 'src/decorators/public.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { UserCreateDto, UserUpdateDto } from './user.validation';
import { PaginationDto } from 'src/common/common.validation';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @Public()
  @UseGuards(NotAuthenticatedGuard)
  async register(@Body() request: UserCreateDto): Promise<WebResponse> {
    return await this.service.create(request);
  }

  @Get('')
  @Roles('Admin')
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<WebResponse<Partial<User>[]>> {
    return await this.service.findAll(pagination);
  }

  @Get(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<Partial<User>>> {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UserUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse> {
    return this.service.update(id, request, file);
  }

  @Delete(':id')
  @Roles('Admin')
  @UseGuards(OwnerGuard)
  async delete(@Param('id') id: string): Promise<WebResponse> {
    return this.service.delete(id);
  }
}
