<!-- components/FieldRenderer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { FieldConfig } from 'src/types/form-types';
import type { FieldNode } from 'src/types/form-nodes';
import type { FieldValue } from 'src/types/form-values';

const props = defineProps<{
  node: FieldNode;
  field: FieldConfig;
  value: FieldValue;
}>();

const emits = defineEmits<{
  (e: 'update-value', value: FieldValue): void;
}>();

const validationRules = computed(() =>
  props.field.required ? [(val: FieldValue) => !!val || 'Obrigatório'] : []
);

function normalizeInputValue(val: FieldValue): string | number | null {
  if (typeof val === 'string' || typeof val === 'number') {
    return val;
  }
  if (val instanceof Date) {
    const [datePart] = val.toISOString().split('T');
    return datePart ?? '';
  }
  return val == null ? null : null;
}
</script>

<template>
  <div class="q-mb-md">
    <q-input
      v-if="field.type === 'text' || field.type === 'number'"
      :type="field.type === 'number' ? 'number' : 'text'"
      :label="field.label"
      :placeholder="field.placeholder"
      :model-value="normalizeInputValue(value) ?? ''"
      :rules="validationRules"
      outlined
      dense
      @update:model-value="val => emits('update-value', val)"
    />

    <q-select
      v-else-if="field.type === 'select'"
      :label="field.label"
      :options="field.options || []"
      option-label="label"
      option-value="value"
      emit-value
      map-options
      :model-value="normalizeInputValue(value)"
      :rules="validationRules"
      outlined
      dense
      @update:model-value="val => emits('update-value', val)"
    />

    <q-checkbox
      v-else-if="field.type === 'checkbox'"
      :label="field.label"
      :model-value="!!value"
      @update:model-value="val => emits('update-value', val)"
    />

    <q-input
      v-else-if="field.type === 'date'"
      :label="field.label"
      :model-value="normalizeInputValue(value) ?? ''"
      outlined
      dense
      @update:model-value="val => emits('update-value', val)"
    />
  </div>
</template>
