// types/form-nodes.ts
import type { FieldConfig } from './form-types';

export type NodeType =
  | 'field'
  | 'group'
  | 'tabs'
  | 'tab'
  | 'stepper'
  | 'step'
  | 'table';

export interface VisibleWhen {
  field: string;
  equals: boolean;
}

export interface BaseNode {
  id: string;
  type: NodeType;
  label?: string;
  visibleWhen?: VisibleWhen;
}

/**
 * Nó que referencia um campo definido em fields[fieldKey]
 */
export interface FieldNode extends BaseNode {
  type: 'field';
  fieldKey: string; // exemplo: "name", "email", "role"
}

/**
 * Grupo / seção
 */
export interface GroupNode extends BaseNode {
  type: 'group';
  children: FormNode[];
}

/**
 * Tabs
 */
export interface TabNode extends BaseNode {
  type: 'tab';
  name: string;
  label: string;
  children: FormNode[];
}

export interface TabsNode extends BaseNode {
  type: 'tabs';
  tabs: TabNode[];
}

/**
 * Stepper
 */
export interface StepNode extends BaseNode {
  type: 'step';
  name: string;
  label: string;
  children: FormNode[];
}

export interface StepperNode extends BaseNode {
  type: 'stepper';
  steps: StepNode[];
}

/**
 * Tabela (array de objetos)
 * columns usa os MESMOS FieldConfig, mas aqui
 * você só referencia pelas chaves também se quiser
 */
export interface TableNode extends BaseNode {
  type: 'table';
  fieldName: string;     // nome do array no model, ex: "permissions"
  columnKeys: string[];  // ex: ["module", "canRead", "canWrite"]
  allowAdd?: boolean;
  allowRemove?: boolean;
}

export type FormNode =
  | FieldNode
  | GroupNode
  | TabsNode
  | TabNode
  | StepperNode
  | StepNode
  | TableNode;

/**
 * Definição completa do form
 */
export interface FormDefinition {
  id: string;
  title?: string;

  // Campos definidos UMA VEZ só
  fields: Record<string, FieldConfig>;

  // Layout: árvore de nodes que só referenciam os campos por chave
  layout: FormNode[];
}
