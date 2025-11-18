import type { Product } from 'src/domain/product/product.model';
import type { ProductFormValues } from 'src/types/product';

const defaultValues: ProductFormValues = {
  name: '',
  teste: '',
  sku: '',
  category: 'general',
  releaseDate: null,
  description: '',
  supplier: null,
  price: 0,
  cost: 0,
  stock: 0,
  isActive: true,
  hasVariants: false,
  variants: [],
};

export const productFormAdapter = {
  toFormValues(product: Product | null): ProductFormValues {
    if (!product) {
      return { ...defaultValues };
    }

    return {
      name: product.name,
      teste: '',
      sku: product.sku ?? `SKU-${product.id}`,
      category: product.category ?? 'general',
      releaseDate: product.releaseDate ?? null,
      description: product.description ?? '',
      supplier: product.supplierId ?? null,
      price: product.price,
      cost: product.cost ?? Math.max(0, product.price * 0.7),
      stock: product.stock,
      isActive: product.isActive ?? true,
      hasVariants: product.hasVariants ?? false,
      variants: [],
    };
  },

  toDomain(current: Product | null, values: ProductFormValues): Product {
    return new Product({
      id: current?.id ?? 0,
      name: values.name,
      sku: values.sku,
      category: values.category,
      description: values.description,
      price: Number(values.price ?? 0),
      cost: values.cost === undefined ? undefined : Number(values.cost ?? 0),
      stock: Number(values.stock ?? 0),
      isActive: Boolean(values.isActive),
      hasVariants: Boolean(values.hasVariants),
      supplierId: values.supplier ?? null,
      releaseDate: values.releaseDate ?? null,
    });
  },
};
