import 'reflect-metadata';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { ProductFormValues } from '../types/product.js';

export class ProductDto {
  @Expose()
  @IsInt()
  id!: number;

  @Expose({ name: 'title' })
  @IsString()
  @MinLength(2)
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  sku?: string;

  @Expose()
  @IsOptional()
  @IsString()
  category?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsNumber()
  @Min(0)
  price!: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @Expose()
  @IsNumber()
  @Min(0)
  stock!: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @Expose()
  @IsOptional()
  @IsInt()
  supplierId?: number | null;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  releaseDate?: string | undefined;

  toFormValues(): ProductFormValues {
    return {
      name: this.name,
      teste: '',
      sku: this.sku ?? `SKU-${this.id}`,
      category: this.category ?? 'general',
      releaseDate: this.releaseDate ? new Date(this.releaseDate) : null,
      description: this.description ?? '',
      supplier: this.supplierId ?? null,
      price: this.price,
      cost: this.cost ?? Math.max(0, this.price * 0.7),
      stock: this.stock,
      isActive: this.isActive ?? true,
      hasVariants: this.hasVariants ?? false,
      variants: [],
    };
  }

  static fromFormValues(id: number, values: ProductFormValues): ProductDto {
    const dto = new ProductDto();
    dto.id = id;
    dto.name = values.name;
    dto.sku = values.sku;
    dto.category = values.category;
    dto.description = values.description;
    dto.price = Number(values.price ?? 0);
    dto.cost = Number(values.cost ?? 0);
    dto.stock = Number(values.stock ?? 0);
    dto.isActive = Boolean(values.isActive);
    dto.hasVariants = Boolean(values.hasVariants);
    dto.supplierId = values.supplier ?? null;
    dto.releaseDate = values.releaseDate ? values.releaseDate.toISOString() : undefined;
    return dto;
  }

  toApiPayload() {
    return {
      id: this.id,
      title: this.name,
      sku: this.sku,
      category: this.category,
      description: this.description,
      price: this.price,
      cost: this.cost,
      stock: this.stock,
      isActive: this.isActive,
      hasVariants: this.hasVariants,
      supplierId: this.supplierId,
      releaseDate: this.releaseDate,
    };
  }
}
