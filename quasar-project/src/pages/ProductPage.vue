<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';
import { useFormStore } from 'src/stores/formStore';
import { useProductStore } from 'src/stores/productStore';
import { productFormAdapter } from 'src/forms/productForm.adapter';
import type { Product } from 'src/domain/product/product.model';
import type { ProductFormValues } from 'src/types/product';
import type { FormValues } from 'src/types/form-values';

const formStore = useFormStore();
const productStore = useProductStore();
const formId = 'productRegistration';
const productId = 1;
const isLoading = ref(true);
const loadError = ref<string | null>(null);
const currentProduct = ref<Product | null>(null);

async function initializeForm() {
  try {
    const entity = await productStore.fetchById(productId);
    currentProduct.value = entity;
    const values = productFormAdapter.toFormValues(entity);
    formStore.initFormValues(formId, values);
  } catch (error) {
    console.error('Failed to load product', error);
    loadError.value = 'Não foi possível carregar o produto.';
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit(values: FormValues) {
  if (!currentProduct.value) {
    return;
  }

  try {
    const entity = productFormAdapter.toDomain(currentProduct.value, values as ProductFormValues);
    const saved = await productStore.save(entity);
    currentProduct.value = saved;
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
