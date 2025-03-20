import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './model/auth/auth.module';
import { UserModule } from './model/user/user.module';
import { ProductModule } from './model/product/product.module';
import { CategoryModule } from './model/category/category.module';
import { AddressModule } from './model/address/address.module';
import { CartModule } from './model/cart/cart.module';
import { RegionModule } from './model/region/region.module';
import { OrderModule } from './model/order/order.module';
import { PaymentModule } from './model/payment/payment.module';
import { RoleModule } from './model/roles/roles.module';
import { PermissionModule } from './model/permission/permission.module';
import { HttpModule } from '@nestjs/axios';
import { UserRolesModule } from './model/user-roles/user-roles.module';
import { UserPermissionModule } from './model/user-permission/user-permission.module';
import { ReviewModule } from './model/review/review.module';
import { DiscountModule } from './model/discount/discount.module';
import { ShipmentModule } from './model/shipment/shipment.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    AddressModule,
    CartModule,
    RegionModule,
    OrderModule,
    PaymentModule,
    RoleModule,
    PermissionModule,
    HttpModule,
    UserRolesModule,
    UserPermissionModule,
    ReviewModule,
    DiscountModule,
    ShipmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
