import type { FieldValue } from './form-values';

export interface ApiSelectOption {
  label: string;
  value: FieldValue;
  description?: string;
  [key: string]: unknown;
}

export interface ApiSelectFetcherParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiSelectFetchResult {
  options: ApiSelectOption[];
  hasMore: boolean;
  total?: number;
}

export type ApiSelectFetcher = (params?: ApiSelectFetcherParams) => Promise<ApiSelectFetchResult>;
