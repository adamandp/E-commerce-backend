import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ShipmentController],
  providers: [ShipmentService],
  exports: [ShipmentService],
})
export class ShipmentModule {}
