// src/boot/forms.ts
import { boot } from 'quasar/wrappers';
import { useFormStore } from 'src/stores/formStore';

// importe seus schemas
import { userAdvancedForm } from 'src/forms/userAdvancedForm';
import { workshopForm } from 'src/forms/workshopForm';
import { productForm } from 'src/forms/productForm';
import { customerForm } from 'src/forms/customerForm';

export default boot(({ store }) => {
  const formStore = useFormStore(store);

  // Registre quantos forms quiser
  formStore.registerForm(userAdvancedForm);
  formStore.registerForm(workshopForm);
  formStore.registerForm(productForm);
  formStore.registerForm(customerForm);
});
