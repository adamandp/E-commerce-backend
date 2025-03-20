import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { ShipmentModule } from '../shipment/shipment.module';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [ProductModule, ShipmentModule, PaymentModule, CartModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
