import { createApiSelectFetcher, type ApiSelectOption } from 'src/services/apiSelect';

interface SupplierApiUser {
  id: number;
  firstName: string;
  lastName: string;
  company?: {
    name?: string;
  };
}

const mapSupplierToOption = (user: SupplierApiUser): ApiSelectOption => ({
  label: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
  value: user.id,
  description: user.company?.name,
});

export const supplierSelectFetcher = createApiSelectFetcher<SupplierApiUser>({
  endpoint: '/users',
  searchEndpoint: '/users/search',
  itemsPath: 'users',
  totalPath: 'total',
  mapItem: mapSupplierToOption,
  pagination: {
    mode: 'offset',
    limitParam: 'limit',
    skipParam: 'skip',
    pageSize: 10,
  },
  searchParam: 'q',
});
