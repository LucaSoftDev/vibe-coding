import { FormBuilder } from 'src/core/FormBuilder';
import type { FormDefinitionInput } from 'src/types/form-nodes';

const supplierOptions = [
  { label: 'Fornecedor A', value: 'supplier_a' },
  { label: 'Fornecedor B', value: 'supplier_b' },
  { label: 'Fornecedor C', value: 'supplier_c' },
];

const customerFormDefinition: FormDefinitionInput = {
  id: 'customer',
  title: 'Cadastro de Cliente',
  fields: {
    name: {
      name: 'name',
      label: 'Nome do cliente',
      type: 'text',
      required: true,
      placeholder: 'Digite o nome completo',
      colSpan: { base: 12, md: 6 },
    },
    email: {
      name: 'email',
      label: 'E-mail',
      type: 'text',
      required: true,
      placeholder: 'cliente@email.com',
      colSpan: { base: 12, md: 6 },
    },
    phone: {
      name: 'phone',
      label: 'Telefone',
      type: 'text',
      placeholder: '(11) 99999-9999',
      colSpan: { base: 12, md: 4 },
    },
    loyaltyStatus: {
      name: 'loyaltyStatus',
      label: 'Status fidelidade',
      type: 'select',
      colSpan: { base: 12, md: 4 },
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'Prata', value: 'silver' },
        { label: 'Ouro', value: 'gold' },
      ],
    },
    preferredSupplier: {
      name: 'preferredSupplier',
      label: 'Fornecedor preferido',
      type: 'text',
      colSpan: { base: 12, md: 6 },
    },
    newsletter: {
      name: 'newsletter',
      label: 'Receber novidades',
      type: 'checkbox',
      colSpan: { base: 12, md: 3 },
    },
  },
  layout: [
    {
      type: 'group',
      id: 'customer-basic-info',
      label: 'Informações básicas',
      children: [
        { type: 'field', fieldKey: 'name' },
        { type: 'field', fieldKey: 'email' },
        { type: 'field', fieldKey: 'phone' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          type: 'tab',
          name: 'preferences',
          label: 'Preferências',
          children: [
            { type: 'field', fieldKey: 'loyaltyStatus' },
            {
              type: 'component',
              component: 'SelectComponent',
              fieldKey: 'preferredSupplier',
              colSpan: { base: 12, md: 6 },
              props: {
                label: 'Fornecedor preferido',
                optionLabel: 'label',
                optionValue: 'value',
                options: supplierOptions,
                emitValue: true,
                mapOptions: true,
                clearable: true,
              },
            },
            { type: 'field', fieldKey: 'newsletter' },
          ],
        },
      ],
    },
  ],
};

export const customerForm = FormBuilder.fromDefinition(customerFormDefinition);
