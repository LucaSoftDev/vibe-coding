export type FieldValue = string | number | boolean | Date | null | undefined;

export type TableRow = Record<string, FieldValue>;

export type FormValue = FieldValue | TableRow | TableRow[];

export type FormValues = Record<string, FormValue>;
