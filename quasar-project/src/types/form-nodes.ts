// types/form-nodes.ts
import type { FieldConfig, FieldColSpan } from './form-types';

export type NodeType =
  | 'field'
  | 'group'
  | 'tabs'
  | 'tab'
  | 'stepper'
  | 'step'
  | 'table'
  | 'component';

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

export interface ComponentNode extends BaseNode {
  type: 'component';
  component: string;
  fieldKey: string;
  props?: Record<string, unknown>;
  colSpan?: FieldColSpan;
}

export type FormNode =
  | FieldNode
  | GroupNode
  | TabsNode
  | TabNode
  | StepperNode
  | StepNode
  | TableNode
  | ComponentNode;

export interface BaseNodeInput extends Omit<BaseNode, 'id'> {
  id?: string;
}

export interface FieldNodeInput extends Omit<FieldNode, 'id'> {
  id?: string;
}

export interface GroupNodeInput extends Omit<GroupNode, 'id' | 'children'> {
  id?: string;
  children?: FormNodeInput[];
}

export interface TabNodeInput extends Omit<TabNode, 'id' | 'children'> {
  id?: string;
  children?: FormNodeInput[];
}

export interface TabsNodeInput extends Omit<TabsNode, 'id' | 'tabs'> {
  id?: string;
  tabs?: TabNodeInput[];
}

export interface StepNodeInput extends Omit<StepNode, 'id' | 'children'> {
  id?: string;
  children?: FormNodeInput[];
}

export interface StepperNodeInput extends Omit<StepperNode, 'id' | 'steps'> {
  id?: string;
  steps?: StepNodeInput[];
}

export interface TableNodeInput extends Omit<TableNode, 'id'> {
  id?: string;
}

export interface ComponentNodeInput extends Omit<ComponentNode, 'id'> {
  id?: string;
}

export type FormNodeInput =
  | FieldNodeInput
  | GroupNodeInput
  | TabsNodeInput
  | TabNodeInput
  | StepperNodeInput
  | StepNodeInput
  | TableNodeInput
  | ComponentNodeInput;

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

export interface FormDefinitionInput {
  id: string;
  title?: string;
  fields: Record<string, FieldConfig>;
  layout: FormNodeInput[];
}
