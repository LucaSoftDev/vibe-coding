<!-- pages/UserAdvancedPage.vue -->
<script setup lang="ts">
import { useFormStore } from 'src/stores/formStore';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';

const formStore = useFormStore();
const formId = 'userAdvanced';

// se quiser inicializar valores:
formStore.initFormValues(formId, {
  role: 'user',
});
</script>

<template>
  <q-page padding>
    <FormRenderer
      :form-id="formId"
      @submit="values => console.log('Submit page', values)"
      @cancel="$router.back()"
    />
  </q-page>
</template>
