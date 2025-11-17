// core/FormBuilder.ts
import {
  type FormDefinition,
  type FormNode,
  type FieldNode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type GroupNode,
  type TabsNode,
  type TabNode,
  type StepperNode,
  type StepNode,
  type TableNode,
} from 'src/types/form-nodes';
import type { FieldConfig, FieldType } from 'src/types/form-types';

let idCounter = 0;
const genId = (prefix: string) => `${prefix}-${++idCounter}`;

export class FormBuilder {
  private id: string;
  private title?: string;
  private fields: Record<string, FieldConfig> = {};
  private layout: FormNode[] = [];

  constructor(id: string) {
    this.id = id;
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
    return this;
  }

  addFieldNode(fieldKey: string): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.layout.push(node);
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
  addTable(fieldName: string, columnKeys: string[], label?: string): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      label,
      allowAdd: true,
      allowRemove: true,
    };
    this.layout.push(node);
    return this;
  }

  build(): FormDefinition {
    return {
      id: this.id,
      title: this.title,
      fields: this.fields,
      layout: this.layout,
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

  addFieldNode(fieldKey: string): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.tabNode.children.push(node);
    return this;
  }

  addTable(fieldName: string, columnKeys: string[], label?: string): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      label,
      allowAdd: true,
      allowRemove: true,
    };
    this.tabNode.children.push(node);
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

  addFieldNode(fieldKey: string): this {
    const node: FieldNode = {
      id: genId('field'),
      type: 'field',
      fieldKey,
    };
    this.stepNode.children.push(node);
    return this;
  }

  addTable(fieldName: string, columnKeys: string[], label?: string): this {
    const node: TableNode = {
      id: genId('table'),
      type: 'table',
      fieldName,
      columnKeys,
      label,
      allowAdd: true,
      allowRemove: true,
    };
    this.stepNode.children.push(node);
    return this;
  }
}
