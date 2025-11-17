<!-- components/StepperRenderer.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import type { StepperNode } from 'src/types/form-nodes';
import type { FieldConfig } from 'src/types/form-types';
import type { FieldValue, FormValue, FormValues } from 'src/types/form-values';
import NodeRenderer from './NodeRenderer.vue';

const props = defineProps<{
  node: StepperNode;
  formId: string;
  values: FormValues;
  fields: Record<string, FieldConfig>;
}>();

const emits = defineEmits<{
  (e: 'update-field', name: string, value: FieldValue): void;
  (e: 'update-complex-field', name: string, value: FormValue): void;
}>();

const current = ref(props.node.steps[0]?.name ?? '');

function goToStep(index: number, offset: number) {
  const target = props.node.steps[index + offset];
  if (target) {
    current.value = target.name;
  }
}
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
      v-for="(step, index) in node.steps"
      :key="step.name"
      :name="step.name"
      :title="step.label"
    >
      <NodeRenderer
        v-for="child in step.children"
        :key="child.id"
        :node="child"
        :form-id="formId"
        :values="values"
        :fields="fields"
        @update-field="(name, value) => emits('update-field', name, value)"
        @update-complex-field="(name, value) => emits('update-complex-field', name, value)"
      />

      <div class="row justify-between q-mt-md">
        <q-btn
          v-if="step !== node.steps[0]"
          flat
          label="Voltar"
          color="primary"
          @click="goToStep(index, -1)"
        />
        <q-btn
          v-if="step !== node.steps[node.steps.length - 1]"
          label="Próximo"
          color="primary"
          class="q-ml-auto"
          @click="goToStep(index, 1)"
        />
      </div>
    </q-step>
  </q-stepper>
</template>
