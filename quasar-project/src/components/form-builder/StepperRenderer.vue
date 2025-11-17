<!-- components/StepperRenderer.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import type { StepperNode } from 'src/types/form-nodes';
import NodeRenderer from './NodeRenderer.vue';

const props = defineProps<{
  node: StepperNode;
  modelValue: Record<string, any>;
}>();

const emits = defineEmits<{
  (e: 'update-field', name: string, value: any): void;
  (e: 'update-complex-field', name: string, value: any): void;
}>();

const current = ref(props.node.steps[0]?.name ?? '');
</script>

<template>
  <q-stepper
    v-model="current"
    flat
    animated
    header-nav
    color="primary"
    class="q-pa-none q-mb-md"
  >
    <q-step
      v-for="step in node.steps"
      :key="step.name"
      :name="step.name"
      :title="step.label"
    >
      <NodeRenderer
        v-for="child in step.children"
        :key="child.id"
        :node="child"
        :model-value="modelValue"
        @update-field="(name, value) => emits('update-field', name, value)"
        @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
      />

      <div class="row justify-between q-mt-md">
        <q-btn
          v-if="step !== node.steps[0]"
          flat
          label="Voltar"
          color="primary"
          @click="current = node.steps[node.steps.indexOf(step) - 1].name"
        />
        <q-btn
          v-if="step !== node.steps[node.steps.length - 1]"
          label="Próximo"
          color="primary"
          class="q-ml-auto"
          @click="current = node.steps[node.steps.indexOf(step) + 1].name"
        />
      </div>
    </q-step>
  </q-stepper>
</template>
