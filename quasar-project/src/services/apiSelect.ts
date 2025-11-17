import { api } from 'src/boot/axios';

export interface ApiSelectOption {
  label: string;
  value: string | number;
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

interface ResponseExtractorResult<T> {
  items: T[];
  total: number;
}

export interface ApiSelectFetcherConfig<T = unknown> {
  endpoint: string;
  method?: 'get' | 'post';
  searchEndpoint?: string;
  mapItem: (item: T) => ApiSelectOption;
  responseExtractor?: (data: unknown) => ResponseExtractorResult<T>;
  itemsPath?: string;
  totalPath?: string;
  staticParams?: Record<string, unknown>;
  pagination?: {
    mode?: 'offset' | 'page';
    limitParam?: string;
    skipParam?: string;
    pageParam?: string;
    pageSizeParam?: string;
    startPage?: number;
    pageSize?: number;
  };
  searchParam?: string;
}

const DEFAULT_PAGE_SIZE = 10;

const getValueByPath = <T = unknown>(source: unknown, path?: string): T | undefined => {
  if (!source || !path) return undefined;
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source) as T | undefined;
};

export function createApiSelectFetcher<T = unknown>(
  config: ApiSelectFetcherConfig<T>
): ApiSelectFetcher {
  const {
    endpoint,
    method = 'get',
    searchEndpoint,
    mapItem,
    responseExtractor,
    itemsPath = 'items',
    totalPath = 'total',
    staticParams = {},
    pagination: paginationConfig = {},
    searchParam = 'q',
  } = config;

  const pagination = {
    mode: paginationConfig.mode ?? 'offset',
    limitParam: paginationConfig.limitParam ?? 'limit',
    skipParam: paginationConfig.skipParam ?? 'skip',
    pageParam: paginationConfig.pageParam ?? 'page',
    pageSizeParam: paginationConfig.pageSizeParam ?? 'pageSize',
    startPage: paginationConfig.startPage ?? 1,
    pageSize: paginationConfig.pageSize ?? DEFAULT_PAGE_SIZE,
  };

  return async ({
    page = pagination.startPage,
    pageSize = pagination.pageSize,
    search = '',
  }: ApiSelectFetcherParams = {}): Promise<ApiSelectFetchResult> => {
    const params: Record<string, unknown> = { ...staticParams };

    const safePage = Math.max(page, 1);
    const safePageSize = Math.max(pageSize, 1);

    if (pagination.mode === 'offset') {
      params[pagination.limitParam] = safePageSize;
      params[pagination.skipParam] = Math.max(0, (safePage - 1) * safePageSize);
    } else {
      params[pagination.pageParam] = safePage;
      params[pagination.pageSizeParam] = safePageSize;
    }

    if (search && searchParam) {
      params[searchParam] = search;
    }

    const url = search && searchEndpoint ? searchEndpoint : endpoint;

    const { data } = await api.request({ url, method, params });

    let items: T[] = [];
    let total = 0;

    if (responseExtractor) {
      ({ items, total } = responseExtractor(data));
    } else {
      const extractedItems = getValueByPath<T[]>(data, itemsPath);
      items = Array.isArray(extractedItems) ? extractedItems : [];
      const extractedTotal = getValueByPath<number>(data, totalPath);
      total = typeof extractedTotal === 'number' ? extractedTotal : items.length;
    }

    const options = items.map(mapItem);

    const hasMore =
      pagination.mode === 'offset'
        ? ((params[pagination.skipParam] as number) ?? 0) + safePageSize < total
        : safePage * safePageSize < total;

    return { options, hasMore, total };
  };
}
