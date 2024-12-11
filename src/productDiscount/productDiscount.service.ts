import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateProductDiscountDto } from './dto/create-productDiscount.dto';
import { UpdateProductDiscountDto } from './dto/update-productDiscount.dto';
import { ProductDiscountEntity } from './entities/productDiscount.entity';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interfaces';
import { ManagerError } from 'src/common/errors/manager.error';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ApiAllResponse, ApiOneResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class ProductDiscountService {

  constructor(
    @InjectRepository(ProductDiscountEntity)
    private readonly productRepository: Repository<ProductDiscountEntity>,
  ) { }

  async create(createProductDto: CreateProductDiscountDto): Promise<ApiOneResponse<ProductDiscountEntity>> {
    try {
      const product = await this.productRepository.save(createProductDto);
      if (!product) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Product not created!',
        });
      }
      return {
        status: {
          statusMsg: "CREATED",
          statusCode: HttpStatus.CREATED,
          error: null,
        },
        data: product,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiAllResponse<ProductDiscountEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.productRepository.count({ where: { isActive: true } }),
        this.productRepository.createQueryBuilder('product')
          .where({ isActive: true })
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('product.supplier', 'supplier')
          .take(limit)
          .skip(skip)
          .getMany()
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        meta: {
          page,
          limit,
          lastPage,
          total,
        },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<ApiOneResponse<ProductDiscountEntity>> {
    try {
      const product = await this.productRepository.createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('product.supplier', 'supplier')
        .leftJoinAndSelect('product.category', 'category')
        .getOne()

      if (!product) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product discount not found!',
        })
      }

      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: product,
      }
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDiscountDto): Promise<ApiOneResponse<UpdateResult>> {
    try {
      const product = await this.productRepository.update({ id, isActive: true }, updateProductDto);
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product discount not found!',
        })
      }

      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: product,
      }
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<ApiOneResponse<UpdateResult>> {
    try {
      const product = await this.productRepository.update({ id, isActive: true }, { isActive: false });
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product discount not found',
        });
      }

      return {
        status: {
          statusMsg: "OK",
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: product,
      }
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
