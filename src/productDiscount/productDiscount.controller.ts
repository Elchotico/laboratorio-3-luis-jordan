import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductDiscountService } from './productDiscount.service';
import { CreateProductDiscountDto } from './dto/create-productDiscount.dto';
import { UpdateProductDiscountDto } from './dto/update-productDiscount.dto';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';

@Controller('productDiscount')
export class ProductDiscountController {
  constructor(private readonly productDiscountService: ProductDiscountService) {}

  @Post()
  create(@Body() createProductDiscountDto: CreateProductDiscountDto) {
    return this.productDiscountService.create(createProductDiscountDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productDiscountService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDiscountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDiscountDto: UpdateProductDiscountDto) {
    return this.productDiscountService.update(id, updateProductDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDiscountService.remove(id);
  }
}
