import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createPinia, setActivePinia } from 'pinia';
import type { AxiosResponse } from 'axios';
import { useProductStore } from '../src/stores/productStore.js';
import { workflowApi } from '../src/services/workflowApi.js';
import type { ProductFormValues } from '../src/types/product.js';

const apiProduct = {
  id: 42,
  title: 'Gaming Laptop',
  sku: 'NB-900',
  category: 'laptops',
  description: 'Powerful machine',
  price: 4299.9,
  cost: 3200,
  stock: 12,
  isActive: true,
  hasVariants: false,
  supplierId: 8,
  releaseDate: '2024-01-05T00:00:00.000Z',
};

describe('productStore', () => {
  let originalGet: typeof workflowApi.get;
  let originalPut: typeof workflowApi.put;

  beforeEach(() => {
    setActivePinia(createPinia());
    originalGet = workflowApi.get;
    originalPut = workflowApi.put;
  });

  afterEach(() => {
    workflowApi.get = originalGet;
    workflowApi.put = originalPut;
  });

  it('loadProductForForm fetches data and maps it to form values', async () => {
    const store = useProductStore();

    workflowApi.get = (async (url: string) => {
      assert.equal(url, `/products/${apiProduct.id}`);
      return { data: apiProduct } as AxiosResponse<typeof apiProduct>;
    }) as typeof workflowApi.get;

    const values = await store.loadProductForForm(apiProduct.id);

    assert.equal(store.currentProduct?.name, apiProduct.title);
    assert.equal(values.name, apiProduct.title);
    assert.equal(values.supplier, apiProduct.supplierId);
    assert.ok(values.releaseDate instanceof Date);
    assert.equal(values.releaseDate?.toISOString(), apiProduct.releaseDate);
    assert.equal(store.loading, false);
  });

  it('saveProductFromForm sends the transformed payload and stores the response', async () => {
    const store = useProductStore();

    const formValues: ProductFormValues = {
      name: 'Desk Lamp',
      teste: '',
      sku: 'LMP-100',
      category: 'office',
      releaseDate: new Date('2024-03-10T00:00:00.000Z'),
      description: 'Adjustable lamp',
      supplier: 5,
      price: 120.5,
      cost: 60.25,
      stock: 30,
      isActive: true,
      hasVariants: false,
      variants: [],
    };

    const apiResponse = {
      id: 7,
      title: formValues.name,
      sku: formValues.sku,
      category: formValues.category,
      description: formValues.description,
      price: formValues.price,
      cost: formValues.cost,
      stock: formValues.stock,
      isActive: formValues.isActive,
      hasVariants: formValues.hasVariants,
      supplierId: formValues.supplier,
      releaseDate: formValues.releaseDate?.toISOString(),
    };

    let receivedPayload: unknown;

    workflowApi.put = (async (url: string, payload: unknown) => {
      assert.equal(url, `/products/${apiResponse.id}`);
      receivedPayload = payload;
      return { data: apiResponse } as AxiosResponse<typeof apiResponse>;
    }) as typeof workflowApi.put;

    const result = await store.saveProductFromForm(apiResponse.id, formValues);

    assert.deepEqual(receivedPayload, {
      id: apiResponse.id,
      title: formValues.name,
      sku: formValues.sku,
      category: formValues.category,
      description: formValues.description,
      price: formValues.price,
      cost: formValues.cost,
      stock: formValues.stock,
      isActive: formValues.isActive,
      hasVariants: formValues.hasVariants,
      supplierId: formValues.supplier,
      releaseDate: formValues.releaseDate?.toISOString(),
    });

    assert.equal(store.currentProduct?.id, apiResponse.id);
    assert.equal(store.currentProduct?.name, apiResponse.title);
    assert.equal(result.name, apiResponse.title);
    assert.equal(store.loading, false);
  });
});
