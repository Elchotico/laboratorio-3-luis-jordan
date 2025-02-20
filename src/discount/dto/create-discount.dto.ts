import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateDiscountDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)    
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number = 0;

    @IsNumber()
    @IsOptional()
    @Min(0)
    unit?: number = 0;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    supplier: string;
}
