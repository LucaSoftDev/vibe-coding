import { FormBuilder } from 'src/core/FormBuilder';

export const productForm = new FormBuilder('productRegistration')
  .setTitle('Cadastro de Produto')

  // Campos principais
  .addField('name', 'text', {
    label: 'Nome do produto',
    required: true,
    placeholder: 'Digite o nome do produto',
    colSpan: { base: 12, md: 8 },
  })
  .addField('sku', 'text', {
    label: 'SKU',
    required: true,
    placeholder: 'Código interno do produto',
    colSpan: { base: 12, md: 4 },
  })
  .addField('category', 'select', {
    label: 'Categoria',
    required: true,
    options: [
      { label: 'Eletrônicos', value: 'electronics' },
      { label: 'Moda', value: 'fashion' },
      { label: 'Casa & Jardim', value: 'home' },
      { label: 'Esportes', value: 'sports' },
    ],
    colSpan: { base: 12, sm: 6 },
  })
  .addField('releaseDate', 'date', {
    label: 'Data de lançamento',
    colSpan: { base: 12, sm: 6 },
  })
  .addField('description', 'text', {
    label: 'Descrição',
    placeholder: 'Breve resumo do produto',
    colSpan: 12,
  })

  // Precificação e estoque
  .addField('price', 'number', {
    label: 'Preço de venda',
    required: true,
    placeholder: '0,00',
    colSpan: { base: 12, md: 4 },
  })
  .addField('cost', 'number', {
    label: 'Custo',
    placeholder: '0,00',
    colSpan: { base: 12, md: 4 },
  })
  .addField('stock', 'number', {
    label: 'Estoque disponível',
    required: true,
    colSpan: { base: 12, md: 4 },
  })
  .addField('isActive', 'checkbox', {
    label: 'Produto ativo',
    colSpan: { base: 12, md: 4 },
  })
  .addField('hasVariants', 'checkbox', {
    label: 'Possui variações?',
    colSpan: { base: 12, md: 4 },
  })

  // Colunas da tabela de variações
  .addField('variantName', 'text', {
    label: 'Variante',
    placeholder: 'Ex: Cor azul, Tamanho M',
  })
  .addField('skuSuffix', 'text', {
    label: 'Sufixo SKU',
    placeholder: 'Ex: -AZ-M',
  })
  .addField('additionalCost', 'number', {
    label: 'Custo adicional',
  })

  // Layout
  .startTabs('productTabs')
  .addTab('details', 'Detalhes', (tab) =>
    tab
      .addFieldNode('name')
      .addFieldNode('sku')
      .addFieldNode('category')
      .addFieldNode('releaseDate')
  )
  .addTab('pricing', 'Preço e estoque', (tab) =>
    tab
      .addFieldNode('price')
      .addFieldNode('cost')
      .addFieldNode('stock')
      .addFieldNode('isActive')
      .addFieldNode('hasVariants')
  )
  .end()
  .addFieldNode('description')
  .addTable(
    'variants',
    ['variantName', 'skuSuffix', 'additionalCost'],
    'Variações',
    { visibleWhen: { field: 'hasVariants', equals: true } }
  )
  .build();
