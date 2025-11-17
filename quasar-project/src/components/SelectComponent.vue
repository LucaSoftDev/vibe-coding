<script setup lang="ts" generic="T extends FieldValue = FieldValue">
import { QSelect } from 'quasar';
import type { QSelectProps } from 'quasar';
import { computed, ref } from 'vue';
import type { FieldValue } from 'src/types/form-values';

const REQUIRED_FIELD_MESSAGE = 'Campo obrigatório';

interface InfiniteScrollLabelButton {
  label: string;
  icon: string;
  color?: string;
}

interface InfiniteScrollSelectProps {
  /**
   * Model of the field
   */
  modelValue?: T;
  /**
   * Set to true to disable the field
   * Default value: false
   */
  disable?: boolean;
  /**
   * Set to true to not generate the rules for the field; You need to manually provide the rules
   * Default value: false
   */
  readonly?: boolean;
  /**
   * Set to true to not validate the input value; You need to manually validate the input value
   * Default value: false
   */
  lazyRules?: boolean;
  /**
   * If set to boolean true then it checks validation status against the 'rules' only after field loses focus for first time;
   * If set to 'ondemand' then it will trigger only when component's validate() method is manually called or when the wrapper QForm submits itself
   */
  rules?: QSelectProps['rules'];
  /**
   * Number of milliseconds to wait before updating the model
   * Default value: 300
   */
  inputDebounce?: number;
  /**
   * Array of objects to use as options
   */
  options: QSelectProps['options'];
  /**
   * Update model with the value of the selected option instead of the whole option
   */
  emitValue?: boolean;
  /**
   * Try to map labels of model from 'options' Array; has a small performance penalty;
   * If you are using emit-value you will probably need to use map-options to display the label text in the select field rather than the value;
   * Default value: false
   */
  mapOptions?: boolean;
  /**
   * Signals the user a process is in progress by displaying a spinner; Spinner can be customized by using the 'loading' slot.
   * Default value: false
   */
  loading?: boolean;
  /**
   * Property of option which holds the 'label';
   * If using a function then for best performance, reference it from your scope and do not define it inline
   * Default value: label
   */
  optionLabel: QSelectProps['optionLabel'];
  /**
   * Property of option which holds the 'value';
   * If using a function then for best performance, reference it from your scope and do not define it inline
   * Default value: value
   */
  optionValue: QSelectProps['optionValue'];
  /**
   * Background color of the field
   */
  bgColor?: string;
  /**
   * Set to true to reduce the field height
   * Default value: false
   */
  dense?: boolean;
  /**
   * Label to show when there are no options available
   * Default value: messages.SELECT_NO_OPTIONS in handlingMessages.ts
   */
  noOptionsLabel?: string;
  /**
   * Label to show above the field
   */
  label?: string;
  /**
   * Options for a label button
   * Use onLabelButtonClicked to handle the click event
   */
  labelButtonOptions?: InfiniteScrollLabelButton;
  /**
   * Set to true if the field is required (it also adds an * to the label)
   */
  required?: boolean;
}

const props = withDefaults(defineProps<InfiniteScrollSelectProps>(), {
  inputDebounce: 300,
  dense: false,
  optionLabel: 'label',
  optionValue: 'value',
  emitValue: false,
  mapOptions: false,
  readonly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: T | undefined): void;
  (e: 'onScrollToBottom'): void;
  (e: 'onFilter', value: string): void;
  (e: 'onLabelButtonClicked'): void;
}>();

const select = ref<QSelect>();

const selectedItem = computed<T | undefined>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const computedRules = computed(() => {
  const rules = props.rules ?? [];
  if (props.required) {
    rules.push((val: unknown) => !!val || REQUIRED_FIELD_MESSAGE);
  }
  return rules;
});

const computedLabel = computed(() => {
  return (props.label ?? '') + (props.required ? ' *' : '');
});

let lastIndex = 0;
function onVirtualScroll(details: {
  index: number;
  from: number;
  to: number;
  direction: 'increase' | 'decrease';
  ref: QSelect;
}) {
  if (details.direction !== 'increase') return;

  if (details.index === lastIndex) {
    return;
  } else {
    lastIndex = details.index;
  }
  if (details.index + 4 >= (props.options?.length ?? 0)) {
    emit('onScrollToBottom');
  }
}

function onInputValue(value: string) {
  if (select.value?.$el.contains(document.activeElement)) {
    select.value?.showPopup();
  }
  emit('onFilter', value);
}
</script>
<template>
  <div class="column">
    <div class="row justify-between">
      <label v-if="props.label">{{ computedLabel }}</label>
      <div
        v-if="props.labelButtonOptions"
        class="cursor-pointer row items-center"
        @click="emit('onLabelButtonClicked')"
      >
        <q-icon
          :name="props.labelButtonOptions.icon"
          :color="props.labelButtonOptions.color || 'primary'"
          class="q-mr-sm"
        />
        <span
          v-if="!$q.screen.lt.sm"
          class="text-primary bold"
        >{{ props.labelButtonOptions.label }}</span
        >
      </div>
    </div>
    <q-select
      ref="select"
      v-model="selectedItem"
      popup-content-class="limited-height"
      outlined
      use-chips
      use-input
      fill-input
      hide-selected
      hide-bottom-space
      data-cy="select-infinite-scroll-input"
      clearable
      :rules="computedRules"
      :dense="props.dense"
      :options="props.options"
      :bg-color="props.bgColor"
      :emit-value="props.emitValue"
      :lazy-rules="props.lazyRules"
      :map-options="props.mapOptions"
      :option-label="props.optionLabel"
      :option-value="props.optionValue"
      :input-debounce="props.inputDebounce"
      :loading="props.loading"
      :readonly="props.readonly"
      :disable="props.disable"
      @input-value="onInputValue"
      @virtual-scroll="details => onVirtualScroll(details)"
    >
      <template #no-option>
        <q-item class="items-center no-options"> {{ props.noOptionsLabel }} </q-item>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss">
.limited-height {
  max-height: 300px !important;
}
</style>
