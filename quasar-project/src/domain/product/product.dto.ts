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

const coerceNumber = (value: unknown, fallback?: number) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback ?? value;
};

const coerceBoolean = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
  }
  return undefined;
};

const coerceSupplierId = (value: unknown) => {
  if (value === null) return null;
  return coerceNumber(value);
};

const coerceIsoDate = (value: unknown): string | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

@Expose()
export class ProductDto {
  @Expose()
  @Transform(({ value }) => coerceNumber(value, 0), { toClassOnly: true })
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
  @Transform(({ value }) => coerceNumber(value, 0), { toClassOnly: true })
  @IsNumber()
  @Min(0)
  price!: number;

  @Expose()
  @Transform(({ value }) => coerceNumber(value), { toClassOnly: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @Expose()
  @Transform(({ value }) => coerceNumber(value, 0), { toClassOnly: true })
  @IsNumber()
  @Min(0)
  stock!: number;

  @Expose()
  @Transform(({ value }) => coerceBoolean(value), { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Expose()
  @Transform(({ value }) => coerceBoolean(value), { toClassOnly: true })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @Expose()
  @Transform(({ value }) => coerceSupplierId(value), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  supplierId?: number | null;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => coerceIsoDate(value), { toClassOnly: true })
  releaseDate?: string | undefined;
}
