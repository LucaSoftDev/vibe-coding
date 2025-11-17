<!-- components/FormRenderer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useFormStore } from 'src/stores/formStore';
import NodeRenderer from './NodeRenderer.vue';

const props = defineProps<{
  formId: string;
}>();

const emits = defineEmits<{
  (e: 'submit', value: Record<string, any>): void;
  (e: 'cancel'): void;
}>();

const formStore = useFormStore();

const def = computed(() => formStore.getDefinition(props.formId));
const values = computed(() => formStore.getValues(props.formId));

function updateField(name: string, value: any) {
  formStore.updateField(props.formId, name, value);
}

function updateComplexField(name: string, value: any) {
  formStore.updateComplexField(props.formId, name, value);
}

function onSubmit() {
  emits('submit', { ...values.value });
}
</script>

<template>
  <q-form v-if="def" @submit.prevent="onSubmit" class="q-gutter-md">
    <div v-if="def.title" class="text-h6 q-mb-md">
      {{ def.title }}
    </div>

    <NodeRenderer
      v-for="node in def.layout"
      :key="node.id"
      :node="node"
      :form-id="formId"
      :values="values"
      :fields="def.fields"
      @update-field="updateField"
      @update-complex-field="updateComplexField"
    />

    <div class="row q-col-gutter-sm q-mt-md justify-end">
      <q-btn flat label="Cancelar" color="secondary" @click="$emit('cancel')" />
      <q-btn label="Salvar" type="submit" color="primary" />
    </div>
  </q-form>
</template>
