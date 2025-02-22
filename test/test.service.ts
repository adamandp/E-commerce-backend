import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.users.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUserByEmail() {
    await this.prismaService.users.create({
      data: {
        email: 'test@gmail.com',
        username: 'test',
        full_name: 'test',
        password: await bcrypt.hash('test', 10),
      },
    });
  }

  async createUserByPhoneNumber() {
    await this.prismaService.users.create({
      data: {
        username: 'test',
        full_name: 'test',
        password: await bcrypt.hash('test', 10),
      },
    });
  }
}
