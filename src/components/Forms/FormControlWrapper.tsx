import React, { ReactElement, useEffect, useState } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormTrigger,
} from "react-hook-form";

export interface FieldConfig {
  name: string;
  dependency?: string;
  name2?: string;
  label: string;
  placeholder?: string;
  rules?: any;
  type?:
    | "text"
    | "checkbox"
    | "date"
    | "dropdown"
    | "number"
    | "switch"
    | "password"
    | "autocomplete"
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
  required?: string;
  prefix?: string;
}

export interface GenericFormProps {
  control: Control;
  errors: FieldErrors;
  trigger: UseFormTrigger<any>;
}

export interface FormControlWrapperProps {
  name: string;
  control: Control<any>;
  rules?: any;
  children: (field: any) => ReactElement;
  error?: string;
}

const FormControlWrapper: React.FC<FormControlWrapperProps> = ({
  name,
  control,
  rules,
  children,
  error,
}) => {
  return (
    <FormControl error={!!error} className="w-full">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => children(field)}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormControlWrapper;
