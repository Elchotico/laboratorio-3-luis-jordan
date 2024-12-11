import { DiscountEntity } from "../entities/discount.entity";

export interface ResponseAllProducts{
    page: number;
    lastPage: number;
    limit: number;
    total: number;
    data: DiscountEntity[];
}