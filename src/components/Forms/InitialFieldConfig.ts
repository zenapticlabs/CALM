export interface InitialFieldConfig {
  name: string;
  name2?: string;
  label?: string;
  required?: "text" | "email" | "phone" | "password" | "number" | "website" | "special" | "type";
  type?:
    | "text"
    | "checkbox"
    | "date"
    | "dropdown"
    | "number"
    | "switch"
    | "autocomplete"
    | "password"
    | "address"
    | "phone"
    | "vender";
  options?: { value: string; label: string }[];
  resource?: string;
  valueKey?: string;
  labelKey?: string;
  elseKey?: string;
  size?: number;
  disabled?: boolean;
  prefix?: string;
  dependency?: string;
  validation?: string;
  manualValidation?: true;
}
