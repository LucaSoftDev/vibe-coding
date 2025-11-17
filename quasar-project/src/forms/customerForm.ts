import { FormBuilder } from 'src/core/FormBuilder';

export const customerForm = new FormBuilder('customer')
  .setTitle('Cadastro de Cliente')
  .addField('name', 'text', {
    label: 'Nome do cliente',
    required: true,
    placeholder: 'Digite o nome completo',
    colSpan: { base: 12, md: 8 },
  })
  .addTable(
    'variants',
    ['variantName', 'skuSuffix', 'additionalCost'],
    'Variações',
    {  }
  )
  .build();
