// forms/userAdvancedForm.ts
import { FormBuilder } from 'src/core/FormBuilder';

export const userAdvancedForm = new FormBuilder('userAdvanced')
  .setTitle('Cadastro avançado de usuário')

  // Campos definidos uma vez
  .addField('name', 'text', {
    label: 'Nome',
    required: true,
    placeholder: 'Digite o nome',
  })
  .addField('customPermissions', 'checkbox', {
    label: 'Personalizar permissões',
  })
  .addField('email', 'text', {
    label: 'E-mail',
    required: true,
  })
  .addField('role', 'select', {
    label: 'Perfil',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Usuário', value: 'user' },
    ],
  })
  .addField('street', 'text', {
    label: 'Rua',
  })
  .addField('city', 'text', {
    label: 'Cidade',
  })
  .addField('module', 'text', {
    label: 'Módulo',
    required: true,
  })
  .addField('canRead', 'checkbox', {
    label: 'Ler',
  })
  .addField('canWrite', 'checkbox', {
    label: 'Escrever',
  })

  // Layout
  .startTabs('mainTabs')
  .addTab('basic', 'Dados Básicos', (t) =>
    t
      .addFieldNode('name')
      .addFieldNode('email')
      .addFieldNode('role')
  )
  .addTab('address', 'Endereço', (t) =>
    t
      .addFieldNode('street')
      .addFieldNode('city')
  )
  .end()

  .startStepper('wizard')
  .addStep('step1', 'Perfil', (s) =>
    s.addFieldNode('role')
  )
  .addStep('step2', 'Permissões detalhadas', (s) =>
    s
      .addFieldNode('customPermissions')
      .addTable(
        'permissions',
        ['module', 'canRead', 'canWrite'],
        'Permissões por módulo',
        { visibleWhen: { field: 'customPermissions', equals: true } }
      )
  )
  .end()

  .build();
