// types/form-types.ts
export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

type BreakpointSpan = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export type FieldColSpan = number | BreakpointSpan;

export interface FieldConfig {
  name: string;                // nome no model (ex: "name", "email")
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
  colSpan?: FieldColSpan;      // largura do campo no grid (1-12) ou por breakpoint
  // aqui você pode colocar validators, masks, etc
}
