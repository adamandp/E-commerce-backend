import { Injectable, NotFoundException } from '@nestjs/common';
import { Address, Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { WebResponse } from '../../common/common.interface';
import { Messages, ErrorMessage } from '../../utils/messages';
import { checkUpdate } from 'src/utils/updatedFields';
import { UserService } from '../user/user.service';
import { throwError } from 'src/utils/throwError';
import {
  AddressCreateDTO,
  AddressDeleteDTO,
  AddressUpdateDTO,
} from './address.validation';
import { PaginationDto } from 'src/common/common.validation';

@Injectable()
export class AddressService {
  constructor(
    private logger: PinoLogger,
    private prisma: PrismaService,
    private user: UserService,
  ) {
    this.logger.setContext(AddressService.name);
  }

  private searchCondition(query?: string): Prisma.AddressWhereInput {
    return query
      ? {
          OR: [
            { province: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { subdistrict: { contains: query, mode: 'insensitive' } },
            { village: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
            { users: { username: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : {};
  }

  private async findAddress(
    userId?: string,
    addressId?: string,
  ): Promise<Address> {
    return await this.prisma.address.findFirstOrThrow({
      where: { OR: [{ id: addressId }, { userId }] },
    });
  }

  async create(address: AddressCreateDTO): Promise<WebResponse> {
    await this.user.findById(address.userId);
    return await this.prisma
      .$transaction(async (tx) => {
        await tx.address
          .count({ where: { userId: address.userId } })
          .then((count) => {
            address.isPrimary = count === 0 ? true : false;
          });
        await tx.address.create({ data: address });
      })
      .then(() => ({ message: Messages.create('Address') }));
  }

  async findAll({
    page,
    limit,
    query,
  }: PaginationDto): Promise<WebResponse<Address[]>> {
    const skip = Math.max((page - 1) * limit, 0);
    return await Promise.all([
      this.prisma.address.findMany({
        skip,
        take: limit,
        where: this.searchCondition(query),
      }),
      this.prisma.address.count({ where: this.searchCondition(query) }),
    ]).then(([address, total]) => {
      if (!total)
        throwError(ErrorMessage.notFound('Address'), NotFoundException);
      return {
        message: Messages.get('Address'),
        data: address,
        paging: {
          current_page: page,
          total_items: total,
          total_pages: Math.ceil(total / limit),
          limit,
        },
      };
    });
  }

  async findByUserId(id: string): Promise<WebResponse<Address[]>> {
    await this.user.findById(id);
    return {
      message: Messages.get('User Address'),
      data: await this.prisma.address
        .findMany({ where: { userId: id } })
        .then((address) => {
          if (!address.length)
            throwError(
              ErrorMessage.notFound('User Address'),
              NotFoundException,
            );
          return address;
        }),
    };
  }

  async update(request: AddressUpdateDTO): Promise<WebResponse> {
    const exsitingAddress = await this.findAddress(request.userId, request.id);
    return await this.prisma.address
      .update({
        where: { id: request.id },
        data: checkUpdate(request, exsitingAddress),
      })
      .then(() => ({ message: Messages.update('Address') }));
  }

  async delete({
    id,
    userId,
  }: AddressDeleteDTO): Promise<WebResponse<Address>> {
    await this.findAddress(userId, id);
    return await this.prisma.address
      .delete({ where: { id } })
      .then(() => ({ message: Messages.delete('Address') }));
  }
}
