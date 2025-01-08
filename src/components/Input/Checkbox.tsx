import React, { forwardRef } from "react";
import { BaseInputProps } from "./InputProps";
import { FormControlLabel, Checkbox } from "@mui/material";

const GeneralCheckbox = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.({
        target: {
          name: props.name,
          value: e.target.checked,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <FormControlLabel
        control={
          <Checkbox
            inputRef={ref}
            onChange={handleChange}
            checked={value as boolean || false}
            disabled={props.disabled}
          />
        }
        label={label}
      />
    );
  }
);

export default GeneralCheckbox;
