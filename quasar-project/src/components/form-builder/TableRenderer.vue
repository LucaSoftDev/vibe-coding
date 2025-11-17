<!-- components/TableRenderer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { FieldConfig } from 'src/types/form-types';
import type { TableNode } from 'src/types/form-nodes';
import type { FieldValue, TableRow } from 'src/types/form-values';

const props = defineProps<{
  node: TableNode;
  rows: TableRow[];
  fields: Record<string, FieldConfig>;
}>();

const emits = defineEmits<{
  (e: 'update-rows', rows: TableRow[]): void;
}>();

function addRow() {
  const newRow: TableRow = {};
  props.node.columnKeys.forEach(key => {
    newRow[key] = undefined;
  });
  emits('update-rows', [...props.rows, newRow]);
}

function removeRow(index: number) {
  const copy = [...props.rows];
  copy.splice(index, 1);
  emits('update-rows', copy);
}

function updateCell(rowIndex: number, fieldName: string, value: FieldValue) {
  const copy = props.rows.map(row => ({ ...row }));
  const targetRow = copy[rowIndex];
  if (!targetRow) {
    return;
  }
  targetRow[fieldName] = value;
  emits('update-rows', copy);
}

const columns = computed(() =>
  props.node.columnKeys.map(key => {
    const field = props.fields[key];
    return {
      name: key,
      label: field?.label ?? key,
      field: (row: TableRow) => row[key],
      align: 'left' as const,
    };
  })
);

function getColumnType(columnName: string): FieldConfig['type'] | undefined {
  return props.fields[columnName]?.type;
}
</script>

<template>
  <div class="q-mb-md">
    <div class="row items-center q-mb-sm">
      <div class="text-subtitle2">
        {{ node.label ?? 'Tabela' }}
      </div>
      <q-space />
      <q-btn
        v-if="node.allowAdd !== false"
        dense
        icon="add"
        label="Adicionar"
        color="primary"
        @click="addRow"
      />
    </div>

    <q-table
      flat
      dense
      :rows="rows"
      :columns="columns"
      row-key="__idx"
    >
      <template #body-cell="propsSlot">
        <q-td :props="propsSlot">
          <q-input
            v-if="getColumnType(propsSlot.col.name) === 'text' || getColumnType(propsSlot.col.name) === 'number'"
            dense
            borderless
            :type="getColumnType(propsSlot.col.name) === 'number' ? 'number' : 'text'"
            :model-value="propsSlot.value ?? ''"
            @update:model-value="val => updateCell(propsSlot.rowIndex, propsSlot.col.name, val)"
          />
          <!-- você pode adicionar lógicas pra number, checkbox etc -->
        </q-td>
      </template>

      <template #body-cell-actions="propsSlot">
        <q-td :props="propsSlot">
          <q-btn
            v-if="node.allowRemove !== false"
            dense
            flat
            icon="delete"
            color="negative"
            @click="removeRow(propsSlot.rowIndex)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>
