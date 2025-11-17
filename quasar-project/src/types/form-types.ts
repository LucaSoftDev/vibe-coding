// types/form-types.ts
export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

export interface FieldConfig {
  name: string;                // nome no model (ex: "name", "email")
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
  // aqui você pode colocar validators, masks, etc
}
