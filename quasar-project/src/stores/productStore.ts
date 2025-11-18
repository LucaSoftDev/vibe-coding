import 'reflect-metadata';
import { defineStore } from 'pinia';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { workflowApi } from '../services/workflowApi.js';
import { ProductDto } from '../models/ProductDto.js';
import type { ProductFormValues } from '../types/product.js';

interface ProductApiState {
  currentProduct: ProductDto | undefined;
  loading: boolean;
}

async function transformAndValidate(payload: unknown): Promise<ProductDto> {
  const instance = plainToInstance(ProductDto, payload, {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
  });
  await validateOrReject(instance, { whitelist: true });
  return instance;
}

export const useProductStore = defineStore('productApi', {
  state: (): ProductApiState => ({
    currentProduct: undefined,
    loading: false,
  }),

  actions: {
    async loadProductForForm(id: number): Promise<ProductFormValues> {
      this.loading = true;
      try {
        const { data } = await workflowApi.get(`/products/${id}`);
        const dto = await transformAndValidate(data);
        this.currentProduct = dto;
        return dto.toFormValues();
      } finally {
        this.loading = false;
      }
    },

    async saveProductFromForm(id: number, values: ProductFormValues): Promise<ProductDto> {
      this.loading = true;
      try {
        const dto = ProductDto.fromFormValues(id, values);
        await validateOrReject(dto, { whitelist: true });
        const payload = dto.toApiPayload();
        const { data } = await workflowApi.put(`/products/${id}`, payload);
        const updated = await transformAndValidate(data);
        this.currentProduct = updated;
        return updated;
      } finally {
        this.loading = false;
      }
    },
  },
});
