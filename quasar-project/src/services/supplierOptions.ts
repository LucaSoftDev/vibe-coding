import type { ApiSelectFetcher, ApiSelectFetcherParams } from 'src/types/api-select';
import { useSupplierStore } from 'src/stores/supplierStore';

export const supplierSelectFetcher: ApiSelectFetcher = (params?: ApiSelectFetcherParams) => {
  const supplierStore = useSupplierStore();
  return supplierStore.fetchSupplierOptions(params);
};
