import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createPinia, setActivePinia } from 'pinia';
import type { AxiosResponse } from 'axios';
import { useProductStore } from '../src/stores/productStore.js';
import { httpClient } from '@/services/httpClient.js';
import { Product } from '../src/domain/product/product.model.js';

const apiProduct = {
  id: '42',
  title: 'Gaming Laptop',
  sku: 'NB-900',
  category: 'laptops',
  description: 'Powerful machine',
  price: '4299.9',
  cost: '3200',
  stock: '12',
  isActive: 'true',
  hasVariants: false,
  supplierId: '8',
  releaseDate: '2024-01-05T00:00:00.000Z',
};

describe('productStore', () => {
  let originalGet: typeof httpClient.get;
  let originalPut: typeof httpClient.put;

  beforeEach(() => {
    setActivePinia(createPinia());
    originalGet = httpClient.get;
    originalPut = httpClient.put;
  });

  afterEach(() => {
    httpClient.get = originalGet;
    httpClient.put = originalPut;
  });

  it('fetchById fetches data and maps it to a domain entity', async () => {
    const store = useProductStore();

    httpClient.get = (async (url: string) => {
      assert.equal(url, `/products/${apiProduct.id}`);
      return { data: apiProduct } as AxiosResponse<typeof apiProduct>;
    }) as typeof httpClient.get;

    const entity = await store.fetchById(Number(apiProduct.id));

    assert.equal(store.currentProduct?.name, apiProduct.title);
    assert.equal(entity.name, apiProduct.title);
    assert.equal(entity.price, Number(apiProduct.price));
    assert.equal(entity.stock, Number(apiProduct.stock));
    assert.equal(entity.supplierId, Number(apiProduct.supplierId));
    assert.equal(entity.releaseDate?.toISOString(), apiProduct.releaseDate);
    assert.equal(store.loading, false);
  });

  it('save serializes the domain entity, calls the API, and updates the cache', async () => {
    const store = useProductStore();

    const entity = new Product({
      id: 7,
      name: 'Desk Lamp',
      sku: 'LMP-100',
      category: 'office',
      description: 'Adjustable lamp',
      price: 120.5,
      cost: 60.25,
      stock: 30,
      isActive: true,
      hasVariants: false,
      supplierId: 5,
      releaseDate: new Date('2024-03-10T00:00:00.000Z'),
    });

    const apiResponse = {
      id: entity.id,
      title: entity.name,
      sku: entity.sku,
      category: entity.category,
      description: entity.description,
      price: entity.price,
      cost: entity.cost,
      stock: entity.stock,
      isActive: entity.isActive,
      hasVariants: entity.hasVariants,
      supplierId: entity.supplierId,
      releaseDate: entity.releaseDate?.toISOString(),
    };

    let sentPayload: unknown;

    httpClient.put = (async (url: string, payload: unknown) => {
      assert.equal(url, `/products/${entity.id}`);
      sentPayload = payload;
      return { data: apiResponse } as AxiosResponse<typeof apiResponse>;
    }) as typeof httpClient.put;

    const saved = await store.save(entity);

    assert.deepEqual(sentPayload, apiResponse);
    assert.equal(saved.id, entity.id);
    assert.equal(store.currentProduct?.name, entity.name);
    assert.equal(store.loading, false);
  });
});
