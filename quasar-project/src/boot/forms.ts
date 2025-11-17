// src/boot/forms.ts
import { boot } from 'quasar/wrappers';
import { useFormStore } from 'src/stores/formStore';

// importe seus schemas
import { userAdvancedForm } from 'src/forms/userAdvancedForm';

export default boot(({ store }) => {
  const formStore = useFormStore(store);

  // Registre quantos forms quiser
  formStore.registerForm(userAdvancedForm);
});
