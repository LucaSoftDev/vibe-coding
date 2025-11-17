import { FormBuilder } from 'src/core/FormBuilder';

export const productForm = new FormBuilder('productRegistration')
  .setTitle('Cadastro de Produto')

  // Campos principais
  .addField('name', 'text', {
    label: 'Nome do produto',
    required: true,
    placeholder: 'Digite o nome do produto',
  })
  .addField('sku', 'text', {
    label: 'SKU',
    required: true,
    placeholder: 'Código interno do produto',
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
  })
  .addField('releaseDate', 'date', {
    label: 'Data de lançamento',
  })
  .addField('description', 'text', {
    label: 'Descrição',
    placeholder: 'Breve resumo do produto',
  })

  // Precificação e estoque
  .addField('price', 'number', {
    label: 'Preço de venda',
    required: true,
    placeholder: '0,00',
  })
  .addField('cost', 'number', {
    label: 'Custo',
    placeholder: '0,00',
  })
  .addField('stock', 'number', {
    label: 'Estoque disponível',
    required: true,
  })
  .addField('isActive', 'checkbox', {
    label: 'Produto ativo',
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
  )
  .end()
  .addFieldNode('description')
  .addTable('variants', ['variantName', 'skuSuffix', 'additionalCost'], 'Variações')
  .build();
