<!-- components/NodeRenderer.vue -->
<script setup lang="ts">
import type {
  FormNode,
  FieldNode,
  GroupNode,
  TabsNode,
  StepperNode,
  TableNode,
  VisibleWhen,
  ComponentNode,
} from 'src/types/form-nodes';
import type { FieldConfig, FieldColSpan } from 'src/types/form-types';
import type { FieldValue, FormValue, FormValues, TableRow } from 'src/types/form-values';

import FieldRenderer from './FieldRenderer.vue';
import TabsRenderer from './TabsRenderer.vue';
import StepperRenderer from './StepperRenderer.vue';
import TableRenderer from './TableRenderer.vue';
import SelectComponent from 'src/components/SelectComponent.vue';
import ApiSelect from 'src/components/ApiSelect.vue';

const customComponents: Record<string, unknown> = {
  SelectComponent,
  ApiSelect,
};

const props = defineProps<{
  node: FormNode;
  formId: string;
  values: FormValues;
  fields: Record<string, FieldConfig>;
}>();

const emits = defineEmits<{
  (e: 'update-field', name: string, value: FieldValue): void;
  (e: 'update-complex-field', name: string, value: FormValue): void;
}>();

function getTableRows(fieldName: string): TableRow[] {
  const value = props.values[fieldName];
  return Array.isArray(value) ? (value as TableRow[]) : [];
}

function getFieldValue(fieldKey: string): FieldValue {
  const value = props.values[fieldKey];

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return undefined;
  }

  if (value !== null && typeof value === 'object') {
    return undefined;
  }

  return value as FieldValue;
}

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

function clampSpan(value?: number): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(12, Math.max(1, Math.round(value)));
}

function normalizeColSpan(colSpan: FieldColSpan | undefined): Record<Breakpoint, number | undefined> {
  const defaultSpan = 12;
  if (typeof colSpan === 'number') {
    return {
      base: clampSpan(colSpan) ?? defaultSpan,
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    };
  }

  if (typeof colSpan === 'object' && colSpan !== null) {
    const normalized: Record<Breakpoint, number | undefined> = {
      base: clampSpan(colSpan.base),
      sm: clampSpan(colSpan.sm),
      md: clampSpan(colSpan.md),
      lg: clampSpan(colSpan.lg),
      xl: clampSpan(colSpan.xl),
    };

    if (!normalized.base) {
      normalized.base =
        normalized.sm ??
        normalized.md ??
        normalized.lg ??
        normalized.xl ??
        defaultSpan;
    }

    return normalized;
  }

  return {
    base: defaultSpan,
    sm: undefined,
    md: undefined,
    lg: undefined,
    xl: undefined,
  };
}

function isNodeVisible(node: FormNode): boolean {
  const condition = (node as FormNode & { visibleWhen?: VisibleWhen }).visibleWhen;
  if (!condition) {
    return true;
  }
  const value = props.values[condition.field];
  if (typeof value !== 'boolean') {
    return false;
  }
  return value === condition.equals;
}

function getFieldWrapperClasses(fieldKey: string): string[] {
  const colSpan = normalizeColSpan(props.fields[fieldKey]?.colSpan);
  const classes: string[] = ['form-grid__item', `form-grid__item--span-${colSpan.base ?? 12}`];
  (['sm', 'md', 'lg', 'xl'] as Breakpoint[]).forEach((bp) => {
    const span = colSpan[bp];
    if (span) {
      classes.push(`form-grid__item--span-${bp}-${span}`);
    }
  });
  return classes;
}

function getComponentWrapperClasses(node: ComponentNode): string[] {
  const colSpan = normalizeColSpan(node.colSpan);
  const classes: string[] = ['form-grid__item', `form-grid__item--span-${colSpan.base ?? 12}`];
  (['sm', 'md', 'lg', 'xl'] as Breakpoint[]).forEach((bp) => {
    const span = colSpan[bp];
    if (span) {
      classes.push(`form-grid__item--span-${bp}-${span}`);
    }
  });
  return classes;
}

function resolveCustomComponent(name: string) {
  return customComponents[name] ?? null;
}

function getComponentProps(node: ComponentNode) {
  return node.props ?? {};
}
</script>

<template>
  <!-- Campo -->
  <div
    v-if="node.type === 'field' && isNodeVisible(node)"
    :class="getFieldWrapperClasses((node as FieldNode).fieldKey)"
  >
    <FieldRenderer
      :node="node as FieldNode"
      :field="fields[(node as FieldNode).fieldKey]!"
      :value="getFieldValue((node as FieldNode).fieldKey)"
      @update-value="(val) => emits('update-field', (node as FieldNode).fieldKey, val)"
    />
  </div>

  <!-- Componente customizado -->
  <div
    v-else-if="node.type === 'component' && isNodeVisible(node)"
    :class="getComponentWrapperClasses(node as ComponentNode)"
  >
    <component
      :is="resolveCustomComponent((node as ComponentNode).component)"
      v-if="resolveCustomComponent((node as ComponentNode).component)"
      v-bind="getComponentProps(node as ComponentNode)"
      :model-value="getFieldValue((node as ComponentNode).fieldKey)"
      @update:model-value="(val: FieldValue) => emits('update-field', (node as ComponentNode).fieldKey, val)"
    />
    <div v-else class="text-negative">
      Componente "{{ (node as ComponentNode).component }}" não encontrado.
    </div>
  </div>

  <!-- Grupo -->
  <div
    v-else-if="node.type === 'group' && isNodeVisible(node)"
    class="q-pa-md q-mb-md bg-grey-2 rounded-borders form-grid__item form-grid__item--span-12"
  >
    <div v-if="(node as GroupNode).label" class="text-subtitle2 q-mb-sm">
      {{ (node as GroupNode).label }}
    </div>

    <div class="form-grid">
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
  </div>

  <!-- Tabs -->
  <div
    v-else-if="node.type === 'tabs' && isNodeVisible(node)"
    class="form-grid__item form-grid__item--span-12"
  >
    <TabsRenderer
      :node="node as TabsNode"
      :form-id="formId"
      :values="values"
      :fields="fields"
      @update-field="(name, value) => emits('update-field', name, value)"
      @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
    />
  </div>

  <!-- Stepper -->
  <div
    v-else-if="node.type === 'stepper' && isNodeVisible(node)"
    class="form-grid__item form-grid__item--span-12"
  >
    <StepperRenderer
      :node="node as StepperNode"
      :form-id="formId"
      :values="values"
      :fields="fields"
      @update-field="(name, value) => emits('update-field', name, value)"
      @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
    />
  </div>

  <!-- Tabela -->
  <div
    v-else-if="node.type === 'table' && isNodeVisible(node)"
    class="form-grid__item form-grid__item--span-12"
  >
    <TableRenderer
      :node="node as TableNode"
      :rows="getTableRows((node as TableNode).fieldName)"
      :fields="fields"
      @update-rows="rows => emits('update-complex-field', (node as TableNode).fieldName, rows)"
    />
  </div>
</template>
