// stores/formStore.ts
import { defineStore } from 'pinia';
import type { FormDefinition } from 'src/types/form-nodes';
import type { FieldValue, FormValue, FormValues } from 'src/types/form-values';

interface FormState {
  definitions: Record<string, FormDefinition>;
  values: Record<string, FormValues>;
}

export const useFormStore = defineStore('forms', {
  state: (): FormState => ({
    definitions: {},
    values: {},
  }),

  getters: {
    getDefinition: (state) => (formId: string) => state.definitions[formId],
    getValues: (state) => (formId: string): FormValues =>
      state.values[formId] ?? {},
  },

  actions: {
    registerForm(def: FormDefinition) {
      this.definitions[def.id] = def;
      if (!this.values[def.id]) {
        this.values[def.id] = {};
      }
    },

    initFormValues(formId: string, initial?: FormValues) {
      this.values[formId] = initial ? { ...initial } : {};
    },

    updateField(formId: string, fieldName: string, value: FieldValue) {
      if (!this.values[formId]) this.values[formId] = {};
      this.values[formId][fieldName] = value;
    },

    updateComplexField(formId: string, fieldName: string, value: FormValue) {
      if (!this.values[formId]) this.values[formId] = {};
      this.values[formId][fieldName] = value;
    },

    resetForm(formId: string) {
      this.values[formId] = {};
    },
  },
});
