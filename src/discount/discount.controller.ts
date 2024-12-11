import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';

@Controller('products')
export class DiscountController {
  constructor(private readonly DiscountService: DiscountService) {}

  @Post()
  create(@Body() createProductDto: CreateDiscountDto) {
    return this.DiscountService.create(createProductDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.DiscountService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.DiscountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.DiscountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.DiscountService.remove(id);
  }
}
