import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type {
  ApiSelectFetchResult,
  ApiSelectFetcherParams,
  ApiSelectOption,
} from 'src/types/api-select';

interface SupplierApiUser {
  id: number;
  firstName: string;
  lastName: string;
  company?: {
    name?: string;
  };
}

interface SupplierApiResponse {
  users: SupplierApiUser[];
  total: number;
  skip: number;
  limit: number;
}

const mapSupplierToOption = (user: SupplierApiUser): ApiSelectOption => ({
  label: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
  value: user.id,
  description: user.company?.name || 'No company name provided',
});

export const useSupplierStore = defineStore('suppliers', {
  actions: {
    async fetchSupplierOptions(
      params: ApiSelectFetcherParams = {}
    ): Promise<ApiSelectFetchResult> {
      const page = Math.max(1, params.page ?? 1);
      const pageSize = Math.max(1, params.pageSize ?? 10);
      const skip = Math.max(0, (page - 1) * pageSize);

      const endpoint = params.search ? '/users/search' : '/users';
      const query: Record<string, number | string> = {
        limit: pageSize,
        skip,
      };

      if (params.search) {
        query.q = params.search;
      }

      const { data } = await api.get<SupplierApiResponse>(endpoint, { params: query });
      const total = data.total ?? 0;
      const options = (data.users ?? []).map(mapSupplierToOption);
      const hasMore = skip + pageSize < total;

      return {
        options,
        hasMore,
        total,
      };
    },
  },
});
