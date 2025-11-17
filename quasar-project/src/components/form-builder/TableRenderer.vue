<!-- components/TableRenderer.vue -->
<script setup lang="ts">
import type { TableNode } from 'src/types/form-nodes';

const props = defineProps<{
  node: TableNode;
  rows: Record<string, any>[];
}>();

const emits = defineEmits<{
  (e: 'update-rows', rows: Record<string, any>[]): void;
}>();

function addRow() {
  emits('update-rows', [...props.rows, {}]);
}

function removeRow(index: number) {
  const copy = [...props.rows];
  copy.splice(index, 1);
  emits('update-rows', copy);
}

function updateCell(rowIndex: number, fieldName: string, value: any) {
  const copy = props.rows.map(r => ({ ...r }));
  copy[rowIndex][fieldName] = value;
  emits('update-rows', copy);
}

const columns = props.node.columns.map(col => ({
  name: col.name,
  label: col.label,
  field: (row: any) => row[col.name],
  align: 'left',
}));
</script>

<template>
  <div class="q-mb-md">
    <div class="row items-center q-mb-sm">
      <div class="text-subtitle2">
        {{ node.label }}
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
            v-if="node.columns.find(c => c.name === propsSlot.col.name)?.type === 'text'"
            dense
            borderless
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
