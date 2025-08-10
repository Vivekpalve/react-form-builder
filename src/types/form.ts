export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export type ValidationRules = {
  notEmpty?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  email?: boolean;
  passwordRule?: { minLength: number; mustContainNumber?: boolean } | null;
  minValue?: number | null;
  maxValue?: number | null;
};

export type DerivedConfig = {
  isDerived: boolean;
  parentFieldIds: string[]; // ids of parent fields
  // expressionName selects one of built-in safe operations:
  // e.g. "ageFromDOB", "sum", "concat"
  expressionName?: 'ageFromDOB' | 'sum' | 'concat' | 'custom'; 
  // custom expression string (not executing arbitrary JS) — kept for future
  expression?: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[]; // for select/radio/checkbox
  validation?: ValidationRules;
  derived?: DerivedConfig;
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string; // ISO string
  fields: FormField[];
};
