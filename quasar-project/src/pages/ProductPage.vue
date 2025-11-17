<script setup lang="ts">
import { useFormStore } from 'src/stores/formStore';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';

const formStore = useFormStore();
const formId = 'productRegistration';

formStore.initFormValues(formId, {
  isActive: true,
  hasVariants: false,
  variants: [],
  supplier: null,
});
</script>

<template>
  <q-page padding>
    <FormRenderer
      :form-id="formId"
      @submit="values => console.log('Submit product', values)"
      @cancel="$router.back()"
    />
  </q-page>
</template>
