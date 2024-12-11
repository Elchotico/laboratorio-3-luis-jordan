import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDiscountDto } from './create-productDiscount.dto';

export class UpdateProductDiscountDto extends PartialType(CreateProductDiscountDto) {}
