import { ProductDiscountEntity } from "../entities/productDiscount.entity";

export interface ResponseAllProducts{
    page: number;
    lastPage: number;
    limit: number;
    total: number;
    data: ProductDiscountEntity[];
}