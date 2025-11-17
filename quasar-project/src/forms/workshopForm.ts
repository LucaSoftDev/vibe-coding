import {FormBuilder} from "src/core/FormBuilder";

export const workshopForm = new FormBuilder('workshop')
  .setTitle('Cadastro de Workshop')

  // Campos definidos uma vez
  .addField('title', 'text', {
    label: 'Título',
    required: true,
    placeholder: 'Digite o título do workshop',
  })
  .addField('date', 'date', {
    label: 'Data',
    required: true,
  })
  .addField('instructor', 'text', {
    label: 'Instrutor',
    required: true,
    placeholder: 'Nome do instrutor',
  })
  .addFieldNode('title')
  .addFieldNode('date')
  .addFieldNode('instructor')
  .build();
