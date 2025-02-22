import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../common/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      await prisma.users.deleteMany({});
      const result = await service.register({
        username: 'testuser',
        full_name: 'Test User',
        password: 'password123',
        identifier: 'test@example.com',
      });

      expect(result).toEqual({ username: 'testuser', full_name: 'Test User' });
    });

    it('should throw ConflictException if username already exists', async () => {
      await expect(
        service.register({
          username: 'testuser',
          full_name: 'Test User',
          password: 'password123',
          identifier: 'test@example.com',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if identifier is invalid', async () => {
      await expect(
        service.register({
          username: 'testuser',
          full_name: 'Test User',
          password: 'password123',
          identifier: 'invalid-identifier',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if bcrypt.hash fails', async () => {
      await prisma.users.deleteMany({});
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hashing failed'));
      await expect(
        service.register({
          username: 'testuser',
          full_name: 'Test User',
          password: 'password123',
          identifier: 'test@example.com',
        }),
      ).rejects.toThrow('Hashing failed');
    });
  });
});
