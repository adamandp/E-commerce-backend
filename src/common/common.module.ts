import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { loggerOptions } from '../config/logger.config';
import { PrismaService } from './prisma.service';
import { CommonMiddleware } from './common.middleware';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CommonFilter } from './common.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/model/user/user.service';
import { RolesService } from 'src/model/roles/roles.service';
import { PermissionService } from 'src/model/permission/permission.service';
import { OwnerGuard } from './guards/owner.guard';
import { AuthModule } from 'src/model/auth/auth.module';
import { UploadService } from './upload.service';
import { ZodValidationPipe } from 'nestjs-zod';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    HttpModule.register({ global: true }),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    PinoLogger,
    PrismaService,
    JwtStrategy,
    UserService,
    RolesService,
    PermissionService,
    RolesGuard,
    PermissionsGuard,
    OwnerGuard,
    UploadService,
  ],
  exports: [
    LoggerModule,
    PrismaService,
    PinoLogger,
    UserService,
    RolesService,
    PermissionService,
    RolesGuard,
    PermissionsGuard,
    OwnerGuard,
    UploadService,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CommonMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        { path: 'product/:id', method: RequestMethod.GET },
        { path: 'product', method: RequestMethod.GET },
        { path: 'category', method: RequestMethod.GET },
        { path: 'category/:id', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
