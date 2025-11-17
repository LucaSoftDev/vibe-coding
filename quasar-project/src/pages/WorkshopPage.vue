<!-- pages/WorkshopPage.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useFormStore } from 'src/stores/formStore';
import FormRenderer from 'src/components/form-builder/FormRenderer.vue';

const formStore = useFormStore();
const formId = 'workshop';
const isDialogOpen = ref(false);

function openDialog() {
  formStore.initFormValues(formId, {
    role: 'user',
  });
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

openDialog();
</script>

<template>
  <q-page padding class="column q-gutter-md">
    <div class="row justify-end">
      <q-btn color="primary" label="Novo Workshop" @click="openDialog" />
    </div>

    <q-dialog v-model="isDialogOpen" persistent maximized>
      <q-card>
        <q-btn icon="close" flat round dense @click="closeDialog" />

        <q-card-section>
          <FormRenderer
            :form-id="formId"
            @submit="values => {
              console.log('Submit workshop', values);
              closeDialog();
            }"
            @cancel="closeDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
