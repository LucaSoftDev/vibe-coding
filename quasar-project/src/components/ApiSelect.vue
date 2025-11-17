<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SelectComponent from 'src/components/SelectComponent.vue';
import type { FieldValue } from 'src/types/form-values';
import type {
  ApiSelectFetcher,
  ApiSelectFetcherParams,
  ApiSelectFetchResult,
} from 'src/types/api-select';

const props = withDefaults(
  defineProps<{
    modelValue?: FieldValue;
    label?: string;
    fetcher: ApiSelectFetcher;
    pageSize?: number;
    immediate?: boolean;
  }>(),
  {
    modelValue: null,
    label: 'Seleção',
    pageSize: 10,
    immediate: true,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: FieldValue | null): void;
}>();

const options = ref<ApiSelectFetchResult['options']>([]);
const loading = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const hasMore = ref(true);

const resolvedLabel = computed(() => props.label ?? 'Seleção');

function isValidResult(result: unknown): result is ApiSelectFetchResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    Array.isArray((result as ApiSelectFetchResult).options) &&
    typeof (result as ApiSelectFetchResult).hasMore === 'boolean'
  );
}

async function fetchOptions(
  params: ApiSelectFetcherParams & { reset?: boolean } = { reset: false }
) {
  if (!props.fetcher || loading.value) return;
  if (!params.reset && !hasMore.value) return;

  loading.value = true;
  const targetPage = params.reset ? 1 : currentPage.value;
  const searchSnapshot = params.search ?? searchTerm.value;

  try {
    const result = await props.fetcher({
      page: targetPage,
      pageSize: props.pageSize,
      search: searchSnapshot,
    });

    if (!isValidResult(result)) {
      console.error(
        '[ApiSelect] fetcher must return { options: Option[], hasMore: boolean, total?: number }',
        result
      );
      return;
    }

    if (searchSnapshot !== searchTerm.value) {
      return;
    }

    if (params.reset) {
      options.value = result.options;
      currentPage.value = result.hasMore ? 2 : 1;
    } else {
      options.value = [...options.value, ...result.options];
      currentPage.value += 1;
    }

    hasMore.value = result.hasMore;
  } catch (error) {
    console.error('ApiSelect: failed to load options', error);
  } finally {
    loading.value = false;
  }
}

function handleUpdate(value: FieldValue | undefined) {
  emit('update:modelValue', value ?? null);
}

function handleFilter(value: string) {
  searchTerm.value = value;
  hasMore.value = true;
  currentPage.value = 1;
  void fetchOptions({ reset: true, search: value });
}

function handleScrollToBottom() {
  void fetchOptions();
}

watch(
  () => props.fetcher,
  () => {
    options.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    if (props.immediate) {
      void fetchOptions({ reset: true });
    }
  },
  { immediate: true }
);
</script>

<template>
  <SelectComponent
    :model-value="modelValue ?? null"
    :label="resolvedLabel"
    :options="options"
    :loading="loading"
    emit-value
    map-options
    clearable
    @update:model-value="handleUpdate"
    @on-scroll-to-bottom="handleScrollToBottom"
    @on-filter="handleFilter"
  />
</template>
