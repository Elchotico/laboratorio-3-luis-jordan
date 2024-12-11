import { Module } from '@nestjs/common';

import { ProductDiscountService } from './productDiscount.service';
import { ProductDiscountController } from './ProductDiscount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDiscountEntity } from './entities/productDiscount.entity';

@Module({
  controllers: [ProductDiscountController],
  providers: [ProductDiscountService],
  imports: [
    TypeOrmModule.forFeature([ ProductDiscountEntity ])
  ]
})
export class ProductDiscountModule {}
