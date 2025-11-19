import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ProductDto } from './product.dto.js';
import { Product, type ProductInit } from './product.model.js';

const transformOptions = {
  exposeDefaultValues: true,
  enableImplicitConversion: true,
  excludeExtraneousValues: true,
};

export const productMapper = {
  dtoToDomain(raw: unknown): Product {
    const dto = plainToInstance(ProductDto, raw, transformOptions);
    const errors = validateSync(dto, { whitelist: true });

    if (errors.length > 0) {
      throw errors;
    }

    const init = {
      id: dto.id,
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
      supplierId: dto.supplierId ?? null,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      isActive: dto.isActive ?? undefined,
      hasVariants: dto.hasVariants ?? undefined,
    } as ProductInit;

    if (dto.sku !== undefined) init.sku = dto.sku;
    if (dto.category !== undefined) init.category = dto.category;
    if (dto.description !== undefined) init.description = dto.description;
    if (dto.cost !== undefined) init.cost = dto.cost;

    return new Product(init);
  },

  domainToDto(product: Product) {
    return {
      id: product.id,
      title: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      isActive: product.isActive,
      hasVariants: product.hasVariants,
      supplierId: product.supplierId ?? undefined,
      releaseDate: product.releaseDate?.toISOString(),
    };
  },
};
