import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
