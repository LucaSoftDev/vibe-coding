import 'reflect-metadata';
import { defineStore } from 'pinia';
import { httpClient } from '../services/httpClient.js';
import { productMapper } from '../domain/product/product.mapper.js';
import type { Product } from '../domain/product/product.model.js';

interface ProductApiState {
  currentProduct: Product | null;
  loading: boolean;
}

export const useProductStore = defineStore('productApi', {
  state: (): ProductApiState => ({
    currentProduct: null,
    loading: false,
  }),

  actions: {
    async fetchById(id: number): Promise<Product> {
      this.loading = true;
      try {
        const { data } = await httpClient.get(`/products/${id}`);
        const entity = productMapper.dtoToDomain(data);
        this.currentProduct = entity;
        return entity;
      } finally {
        this.loading = false;
      }
    },

    async save(product: Product): Promise<Product> {
      this.loading = true;
      try {
        const payload = productMapper.domainToDto(product);
        const { data } = await httpClient.put(`/products/${product.id}`, payload);
        const updated = productMapper.dtoToDomain(data);
        this.currentProduct = updated;
        return updated;
      } finally {
        this.loading = false;
      }
    },
  },
});
