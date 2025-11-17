<!-- components/TabsRenderer.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import type { TabsNode } from 'src/types/form-nodes';
import NodeRenderer from './NodeRenderer.vue';

const props = defineProps<{
  node: TabsNode;
  modelValue: Record<string, any>;
}>();

const emits = defineEmits<{
  (e: 'update-field', name: string, value: any): void;
  (e: 'update-complex-field', name: string, value: any): void;
}>();

const current = ref(props.node.tabs[0]?.name ?? '');
</script>

<template>
  <div class="q-mb-md">
    <q-tabs
      v-model="current"
      dense
      class="text-primary"
      align="left"
      indicator-color="primary"
    >
      <q-tab
        v-for="tab in node.tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="current" animated>
      <q-tab-panel
        v-for="tab in node.tabs"
        :key="tab.name"
        :name="tab.name"
      >
        <NodeRenderer
          v-for="child in tab.children"
          :key="child.id"
          :node="child"
          :model-value="modelValue"
          @update-field="(name, value) => emits('update-field', name, value)"
          @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
