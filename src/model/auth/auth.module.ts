import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { UserRolesModule } from '../user-roles/user-roles.module';

@Module({
  imports: [UserPermissionModule, UserRolesModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
