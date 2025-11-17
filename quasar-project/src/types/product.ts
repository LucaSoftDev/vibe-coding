import type { FormValues, TableRow } from './form-values';

export type ProductFormValues = FormValues & {
  name: string;
  teste: string;
  sku: string;
  category: string;
  releaseDate: Date | null;
  description: string;
  supplier: number | null;
  price: number;
  cost: number;
  stock: number;
  isActive: boolean;
  hasVariants: boolean;
  variants: TableRow[];
};
