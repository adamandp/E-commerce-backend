import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    try {
      const { username, password, full_name, identifier, identifier_type } =
        this.validationService.validate(UserValidation.REGISTER, request);

      const existingUser = await this.prismaService.users.findFirst({
        where: {
          OR: [
            { username },
            { email: identifier_type === 'email' ? identifier : undefined },
            {
              phone_number:
                identifier_type === 'phone' ? identifier : undefined,
            },
          ],
        },
      });

      if (existingUser) {
        const message =
          existingUser.username === username
            ? 'Username already exists'
            : identifier_type === 'email'
              ? 'Email already exists'
              : 'Phone number already exists';

        this.logger.warn(`Registration failed: ${message}`);
        throw new ConflictException(message);
      }

      this.logger.debug(`Hashing password for user ${username}`);
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prismaService.users.create({
        data: {
          username,
          full_name,
          password: hashedPassword,
          email: identifier_type === 'email' ? identifier : null,
          phone_number: identifier_type === 'phone' ? identifier : null,
          user_permissions: {
            create: {},
          },
          roles: {},
        },
      });

      return {
        message: 'Registration successful. Please log in.',
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`Login user ${JSON.stringify(request)}`);

    try {
      const { identifier, identifier_type, password }: LoginUserRequest =
        this.validationService.validate(UserValidation.LOGIN, request);

      const user = await this.prismaService.users.findFirst({
        where: {
          OR: [
            { username: identifier === 'username' ? identifier : undefined },
            { email: identifier_type === 'email' ? identifier : undefined },
            {
              phone_number:
                identifier_type === 'phone' ? identifier : undefined,
            },
          ],
        },
      });

      if (user) {
        const message =
          identifier === 'username'
            ? 'Username already exists'
            : identifier_type === 'email'
              ? 'Email already exists'
              : 'Phone number already exists';

        this.logger.warn(`Registration failed: ${message}`);
        throw new ConflictException(message);
      }

      const isPasswordValid = await bcrypt.compare(password, user!.password);

      if (!isPasswordValid) {
        throw new HttpException('Username or password is invalid', 401);
      }

      await this.prismaService.users.update({
        where: {
          username: identifier_type === 'username' ? identifier : undefined,
          email: identifier_type === 'email' ? identifier : undefined,
          phone_number: identifier_type === 'phone' ? identifier : undefined,
        },
        data: {
          token: 'token',
        },
      });

      return {
        message: 'Registration successful. Please log in.',
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }
}
