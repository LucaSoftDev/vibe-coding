<!-- components/FieldRenderer.vue -->
<script setup lang="ts">
import type { FieldConfig } from 'src/types/form-types';
import type { FieldNode } from 'src/types/form-nodes';

const props = defineProps<{
  node: FieldNode;
  field: FieldConfig;
  value: any;
}>();

const emits = defineEmits<{
  (e: 'update-value', value: any): void;
}>();
</script>

<template>
  <div class="q-mb-md">
    <q-input
      v-if="field.type === 'text' || field.type === 'number'"
      :type="field.type === 'number' ? 'number' : 'text'"
      :label="field.label"
      :placeholder="field.placeholder"
      :model-value="value ?? ''"
      :rules="field.required ? [val => !!val || 'Obrigatório'] : []"
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
      :model-value="value ?? null"
      :rules="field.required ? [val => !!val || 'Obrigatório'] : []"
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
      :model-value="value ?? ''"
      outlined
      dense
      @update:model-value="val => emits('update-value', val)"
    />
  </div>
</template>
