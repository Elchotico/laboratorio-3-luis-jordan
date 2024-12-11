import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountEntity } from './entities/discount.entity';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-discount.interface';
import { ManagerError } from 'src/common/errors/manager.error';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ApiAllResponse, ApiOneResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class DiscountService {

  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) { }

  async create(createDiscountDto: CreateDiscountDto): Promise<ApiOneResponse<DiscountEntity>> {
    try {
      const product = await this.discountRepository.save(createDiscountDto);
      if (!product) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Discount not created!',
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

  async findAll(paginationDto: PaginationDto): Promise<ApiAllResponse<DiscountEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.discountRepository.count({ where: { isActive: true } }),
        this.discountRepository.createQueryBuilder('product')
          .where({ isActive: true })
          .leftJoinAndSelect('discount.category', 'category')
          .leftJoinAndSelect('discount.supplier', 'supplier')
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

  async findOne(id: string): Promise<ApiOneResponse<DiscountEntity>> {
    try {
      const product = await this.discountRepository.createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('product.supplier', 'supplier')
        .leftJoinAndSelect('product.category', 'category')
        .getOne()

      if (!product) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product not found!',
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

  async update(id: string, updateProductDto: UpdateDiscountDto): Promise<ApiOneResponse<UpdateResult>> {
    try {
      const product = await this.discountRepository.update({ id, isActive: true }, UpdateDiscountDto);
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product not found!',
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
      const product = await this.discountRepository.update({ id, isActive: true }, { isActive: false });
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Product not found',
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
