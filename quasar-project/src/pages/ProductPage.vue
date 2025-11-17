<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';
import { useFormStore } from 'src/stores/formStore';
import { useProductStore } from 'src/stores/productStore';
import type { ProductFormValues } from 'src/types/product';
import type { FormValues } from 'src/types/form-values';

const formStore = useFormStore();
const productApiStore = useProductStore();
const formId = 'productRegistration';
const productId = 1;
const isLoading = ref(true);
const loadError = ref<string | null>(null);

async function initializeForm() {
  try {
    const values = await productApiStore.loadProductForForm(productId);
    formStore.initFormValues(formId, values);
  } catch (error) {
    console.error('Failed to load product', error);
    loadError.value = 'Não foi possível carregar o produto.';
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit(values: FormValues) {
  try {
    await productApiStore.saveProductFromForm(productId, values as ProductFormValues);
  } catch (error) {
    console.error('Failed to save product', error);
  }
}

onMounted(() => {
  void initializeForm();
});
</script>

<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-banner
        v-if="loadError"
        rounded
        class="bg-negative text-white"
      >
        {{ loadError }}
      </q-banner>
    </div>

    <div v-if="isLoading" class="row justify-center q-my-xl">
      <q-spinner size="lg" color="primary" />
    </div>

    <FormRenderer
      v-else
      :form-id="formId"
      @submit="handleSubmit"
      @cancel="$router.back()"
    />
  </q-page>
</template>
