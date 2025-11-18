export interface ProductInit {
  id: number;
  name: string;
  sku?: string;
  category?: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  isActive?: boolean;
  hasVariants?: boolean;
  supplierId?: number | null;
  releaseDate?: Date | null;
}

export class Product {
  id: number;
  name: string;
  sku: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: number;
  cost: number | undefined;
  stock: number;
  isActive: boolean;
  hasVariants: boolean;
  supplierId: number | null;
  releaseDate: Date | null;

  constructor(init: ProductInit) {
    this.id = init.id;
    this.name = init.name;
    this.sku = init.sku;
    this.category = init.category;
    this.description = init.description;
    this.price = init.price;
    this.cost = init.cost;
    this.stock = init.stock;
    this.isActive = init.isActive ?? true;
    this.hasVariants = init.hasVariants ?? false;
    this.supplierId = init.supplierId ?? null;
    this.releaseDate = init.releaseDate ?? null;
  }
}
