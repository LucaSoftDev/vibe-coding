// core/FormBuilder.ts
import {
  type FormDefinition,
  type FormDefinitionInput,
  type FormNode,
  type FormNodeInput,
  type FieldNode,
  type GroupNode,
  type TabsNode,
  type TabNode,
  type StepperNode,
  type StepNode,
  type TableNode,
  type BaseNode,
  type ComponentNode,
  type TabNodeInput,
  type StepNodeInput,
} from 'src/types/form-nodes';
import type { FieldConfig, FieldType, FieldColSpan } from 'src/types/form-types';
import type { VisibleWhen } from 'src/types/form-nodes';

let idCounter = 0;
const genId = (prefix: string) => `${prefix}-${++idCounter}`;

export class FormBuilder {
  private id: string;
  private title?: string;
  private fields: Record<string, FieldConfig> = {};
  private fieldOrder: string[] = [];
  private layout: FormNode[] = [];

  constructor(id: string) {
    this.id = id;
  }

  static fromDefinition(definition: FormDefinitionInput): FormDefinition {
    const builder = new FormBuilder(definition.id);
    if (definition.title) {
      builder.setTitle(definition.title);
    }

    builder.fields = { ...definition.fields };
    builder.fieldOrder = Object.keys(definition.fields);
    builder.layout = FormBuilder.normalizeNodes(definition.layout ?? []);

    return builder.build();
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  addField(
    key: string, // ex: 'name'
    type: FieldType,
    cfg: Omit<FieldConfig, 'name' | 'type'>
  ): this {
    this.fields[key] = { ...cfg, name: key, type };
    if (!this.fieldOrder.includes(key)) {
      this.fieldOrder.push(key);
    }
    return this;
  }

  addFieldNode(fieldKey: string, options?: NodeOptions): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.layout.push(applyNodeOptions(node, options));
    return this;
  }

  // --- Tabs ---
  startTabs(id?: string): TabsBuilder {
    const tabsNode: TabsNode = {
      id: id ?? genId('tabs'),
      type: 'tabs',
      tabs: [],
    };

    this.layout.push(tabsNode);

    return new TabsBuilder(this, tabsNode);
  }

  // --- Stepper ---
  startStepper(id?: string): StepperBuilder {
    const stepperNode: StepperNode = {
      id: id ?? genId('stepper'),
      type: 'stepper',
      steps: [],
    };

    this.layout.push(stepperNode);

    return new StepperBuilder(this, stepperNode);
  }

  // --- Table ---
  addTable(fieldName: string, columnKeys: string[], label?: string, options?: NodeOptions): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      allowAdd: true,
      allowRemove: true,
    };

    if (label !== undefined) {
      node.label = label;
    }
    this.layout.push(applyNodeOptions(node, options));
    return this;
  }

  addComponent(fieldKey: string, component: string, options?: ComponentNodeOptions): this {
    const node = createComponentNode(fieldKey, component, options);
    this.layout.push(applyNodeOptions(node, options));
    return this;
  }

  build(): FormDefinition {
    this.ensureFieldsInLayout();

    const definition: FormDefinition = {
      id: this.id,
      fields: this.fields,
      layout: this.layout,
    };

    if (this.title !== undefined) {
      definition.title = this.title;
    }

    return definition;
  }

  private ensureFieldsInLayout() {
    const usedFields = new Set<string>();

    const collectFields = (nodes: FormNode[]) => {
      nodes.forEach((node) => {
        switch (node.type) {
          case 'field':
            usedFields.add(node.fieldKey);
            break;
          case 'component':
            usedFields.add(node.fieldKey);
            break;
          case 'group':
            collectFields(node.children);
            break;
          case 'tabs':
            node.tabs.forEach((tab) => collectFields(tab.children));
            break;
          case 'tab':
            collectFields(node.children);
            break;
          case 'stepper':
            node.steps.forEach((step) => collectFields(step.children));
            break;
          case 'step':
            collectFields(node.children);
            break;
          case 'table':
            break;
        }
      });
    };

    collectFields(this.layout);

    this.fieldOrder.forEach((fieldKey) => {
      if (!usedFields.has(fieldKey)) {
        const node: FieldNode = {
          id: genId('field'),
          type: 'field',
          fieldKey,
        };
        this.layout.push(node);
      }
    });
  }

  private static normalizeNodes(nodes: FormNodeInput[] = []): FormNode[] {
    return nodes.map((node) => {
      const id = node.id ?? genId(node.type);

      switch (node.type) {
        case 'field':
          return { ...(node as FieldNode), id };
        case 'component':
          return { ...(node as ComponentNode), id };
        case 'table':
          return { ...(node as TableNode), id };
        case 'group': {
          const groupNode = node as GroupNode & { children?: FormNodeInput[] };
          return {
            ...groupNode,
            id,
            children: FormBuilder.normalizeNodes(groupNode.children ?? []),
          };
        }
        case 'tabs': {
          const tabsNode = node as TabsNode & { tabs?: TabNodeInput[] };
          return {
            ...tabsNode,
            id,
            tabs: (tabsNode.tabs ?? []).map((tab) => FormBuilder.normalizeTabNode(tab)),
          };
        }
        case 'tab':
          return FormBuilder.normalizeTabNode(node);
        case 'stepper': {
          const stepperNode = node as StepperNode & { steps?: StepNodeInput[] };
          return {
            ...stepperNode,
            id,
            steps: (stepperNode.steps ?? []).map((step) => FormBuilder.normalizeStepNode(step)),
          };
        }
        case 'step':
          return FormBuilder.normalizeStepNode(node);
        default:
          return { ...(node as BaseNode), id } as FormNode;
      }
    });
  }

  private static normalizeTabNode(tab: TabNodeInput): TabNode {
    return {
      ...tab,
      id: tab.id ?? genId('tab'),
      children: FormBuilder.normalizeNodes(tab.children ?? []),
    };
  }

  private static normalizeStepNode(step: StepNodeInput): StepNode {
    return {
      ...step,
      id: step.id ?? genId('step'),
      children: FormBuilder.normalizeNodes(step.children ?? []),
    };
  }
}

/**
 * Builders auxiliares para tabs/stepper,
 * compartilham o mesmo registry de fields do FormBuilder
 */

class TabsBuilder {
  constructor(
    private parent: FormBuilder,
    private node: TabsNode,
  ) {}

  addTab(name: string, label: string, fn: (b: TabContentBuilder) => void): this {
    const tabNode: TabNode = {
      id: genId('tab'),
      type: 'tab',
      name,
      label,
      children: [],
    };

    const contentBuilder = new TabContentBuilder(this.parent, tabNode);
    fn(contentBuilder);

    this.node.tabs.push(tabNode);
    return this;
  }

  end(): FormBuilder {
    return this.parent;
  }
}

class TabContentBuilder {
  constructor(
    private parent: FormBuilder,
    private tabNode: TabNode,
  ) {}

  addFieldNode(fieldKey: string, options?: NodeOptions): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.tabNode.children.push(applyNodeOptions(node, options));
    return this;
  }

  addTable(fieldName: string, columnKeys: string[], label?: string, options?: NodeOptions): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      allowAdd: true,
      allowRemove: true,
    };

    if (label !== undefined) {
      node.label = label;
    }
    this.tabNode.children.push(applyNodeOptions(node, options));
    return this;
  }

  addComponent(fieldKey: string, component: string, options?: ComponentNodeOptions): this {
    const node = createComponentNode(fieldKey, component, options);
    this.tabNode.children.push(applyNodeOptions(node, options));
    return this;
  }
}

class StepperBuilder {
  constructor(
    private parent: FormBuilder,
    private node: StepperNode,
  ) {}

  addStep(name: string, label: string, fn: (b: StepContentBuilder) => void): this {
    const stepNode: StepNode = {
      id: genId('step'),
      type: 'step',
      name,
      label,
      children: [],
    };

    const contentBuilder = new StepContentBuilder(this.parent, stepNode);
    fn(contentBuilder);

    this.node.steps.push(stepNode);
    return this;
  }

  end(): FormBuilder {
    return this.parent;
  }
}

class StepContentBuilder {
  constructor(
    private parent: FormBuilder,
    private stepNode: StepNode,
  ) {}

  addFieldNode(fieldKey: string, options?: NodeOptions): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.stepNode.children.push(applyNodeOptions(node, options));
    return this;
  }

  addTable(fieldName: string, columnKeys: string[], label?: string, options?: NodeOptions): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      allowAdd: true,
      allowRemove: true,
    };

    if (label !== undefined) {
      node.label = label;
    }
    this.stepNode.children.push(applyNodeOptions(node, options));
    return this;
  }

  addComponent(fieldKey: string, component: string, options?: ComponentNodeOptions): this {
    const node = createComponentNode(fieldKey, component, options);
    this.stepNode.children.push(applyNodeOptions(node, options));
    return this;
  }
}
interface NodeOptions {
  visibleWhen?: VisibleWhen;
}

interface ComponentNodeOptions extends NodeOptions {
  props?: Record<string, unknown>;
  colSpan?: FieldColSpan;
}

const applyNodeOptions = <T extends BaseNode>(node: T, options?: NodeOptions): T => {
  if (options?.visibleWhen) {
    node.visibleWhen = options.visibleWhen;
  }
  return node;
};

const createComponentNode = (
  fieldKey: string,
  component: string,
  options?: ComponentNodeOptions,
): ComponentNode => {
  const node: ComponentNode = {
    id: genId('component'),
    type: 'component',
    component,
    fieldKey,
  };

  if (options?.props !== undefined) {
    node.props = options.props;
  }

  if (options?.colSpan) {
    node.colSpan = options.colSpan;
  }

  return node;
};
