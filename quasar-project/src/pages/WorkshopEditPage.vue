<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFormStore } from 'src/stores/formStore';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';
import { workshopForm } from 'src/forms/workshopForm';
import type { FormValues } from 'src/types/form-values';
import type { WorkshopFormDto } from 'src/domain/workshop/workshop.form-dto';
import { Workshop } from 'src/domain/workshop/workshop.model';
import { workshopService } from 'src/services/workshopService';

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();

const formId = workshopForm.id ?? 'workshop';
const isLoading = ref(true);
const loadError = ref<string | null>(null);
const currentWorkshop = ref<Workshop | null>(null);

function ensureFormRegistered() {
  const existing = formStore.getDefinition(formId);
  if (!existing) {
    formStore.registerForm(workshopForm);
  }
}

async function loadWorkshop(id: string) {
  isLoading.value = true;
  loadError.value = null;
  try {
    const workshop = await workshopService.fetchById(id);
    currentWorkshop.value = workshop;
    formStore.initFormValues(formId, workshop.toFormDto());
  } catch (error) {
    console.error('Failed to load workshop', error);
    loadError.value = 'Não foi possível carregar o workshop.';
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit(values: FormValues) {
  if (!currentWorkshop.value) {
    return;
  }
  try {
    const dto = values as WorkshopFormDto;
    const updatedEntity = Workshop.fromFormDto(dto, currentWorkshop.value);
    const saved = await workshopService.save(updatedEntity);
    currentWorkshop.value = saved;
    formStore.initFormValues(formId, saved.toFormDto());
  } catch (error) {
    console.error('Failed to save workshop', error);
  }
}

const workshopId = computed(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});

onMounted(() => {
  ensureFormRegistered();
  if (!workshopId.value) {
    loadError.value = 'ID do workshop não informado.';
    isLoading.value = false;
    return;
  }
  void loadWorkshop(workshopId.value);
});
</script>

<template>
  <q-page padding class="column q-gutter-lg">
    <div class="row items-center justify-between">
      <div>
        <div class="text-h5">Editar Workshop</div>
        <div class="text-caption text-grey">
          ID: {{ workshopId || 'novo' }}
        </div>
      </div>
      <q-btn flat color="primary" label="Voltar" @click="$router.back()" />
    </div>

    <q-banner
      v-if="loadError"
      class="bg-negative text-white"
      rounded
    >
      {{ loadError }}
    </q-banner>

    <div v-else-if="isLoading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="lg" />
    </div>

    <FormRenderer
      v-else
      :form-id="formId"
      @submit="handleSubmit"
      @cancel="$router.back()"
    />
  </q-page>
</template>
