"use client";

import React, { useState } from "react";
import { BaseInputProps } from "./InputProps";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface DropdownOption {
  value: string;
  label: string;
}

type DropdownProps = BaseInputProps & {
  resource?: string;
  valueKey?: string;
  labelKey?: string;
  options?: DropdownOption[];
};

const MuiDropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    { watch, label, onChange, value, resource, valueKey, labelKey, ...props },
    ref
  ) => {
    const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>(
      props.options || []
    );

    const handleChange = (event: SelectChangeEvent) => {
      onChange &&
        onChange({
          target: {
            name: props.name2 ? props.name2 : props.name,
            value: event.target.value as string,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div ref={ref} className="flex items-center gap-2">
        <div className="w-36">{label}</div>
        <FormControl sx={{minWidth: 400}}>
          <Select
            value={value ? (value as string) : ""}
            onChange={handleChange}
            displayEmpty
            size="small"
            disabled={props.disabled}
          >
            {dropdownOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
);

export default MuiDropdown;
