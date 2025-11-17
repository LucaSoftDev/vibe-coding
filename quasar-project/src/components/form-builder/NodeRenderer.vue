<!-- components/NodeRenderer.vue -->
<script setup lang="ts">
import type {
  FormNode,
  FieldNode,
  GroupNode,
  TabsNode,
  StepperNode,
  TableNode,
} from 'src/types/form-nodes';
import type { FieldConfig } from 'src/types/form-types';

import FieldRenderer from './FieldRenderer.vue';
import TabsRenderer from './TabsRenderer.vue';
import StepperRenderer from './StepperRenderer.vue';
import TableRenderer from './TableRenderer.vue';

const props = defineProps<{
  node: FormNode;
  formId: string;
  values: Record<string, any>;
  fields: Record<string, FieldConfig>;
}>();

const emits = defineEmits<{
  (e: 'update-field', name: string, value: any): void;
  (e: 'update-complex-field', name: string, value: any): void;
}>();
</script>

<template>
  <!-- Campo -->
  <FieldRenderer
    v-if="node.type === 'field'"
    :node="node as FieldNode"
    :field="fields[(node as FieldNode).fieldKey]"
    :value="values[(node as FieldNode).fieldKey]"
    @update-value="(val) => emits('update-field', (node as FieldNode).fieldKey, val)"
  />

  <!-- Grupo -->
  <div v-else-if="node.type === 'group'" class="q-pa-md q-mb-md bg-grey-2 rounded-borders">
    <div v-if="(node as GroupNode).label" class="text-subtitle2 q-mb-sm">
      {{ (node as GroupNode).label }}
    </div>

    <NodeRenderer
      v-for="child in (node as GroupNode).children"
      :key="child.id"
      :node="child"
      :form-id="formId"
      :values="values"
      :fields="fields"
      @update-field="(name, value) => emits('update-field', name, value)"
      @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
    />
  </div>

  <!-- Tabs -->
  <TabsRenderer
    v-else-if="node.type === 'tabs'"
    :node="node as TabsNode"
    :form-id="formId"
    :values="values"
    :fields="fields"
    @update-field="(name, value) => emits('update-field', name, value)"
    @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
  />

  <!-- Stepper -->
  <StepperRenderer
    v-else-if="node.type === 'stepper'"
    :node="node as StepperNode"
    :form-id="formId"
    :values="values"
    :fields="fields"
    @update-field="(name, value) => emits('update-field', name, value)"
    @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
  />

  <!-- Tabela -->
  <TableRenderer
    v-else-if="node.type === 'table'"
    :node="node as TableNode"
    :values="values"
    :fields="fields"
    @update-rows="rows => emits('update-complex-field', (node as TableNode).fieldName, rows)"
  />
</template>
