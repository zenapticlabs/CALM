"use client";

import React, { useEffect, useState } from "react";
import { BaseInputProps } from "./InputProps";
import { useList } from "@refinedev/core";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface LoginDropdownOption {
  value: string;
  label: string;
}

type LoginDropdownProps = BaseInputProps & {
  resource?: string;
  valueKey?: string;
  labelKey?: string;
  options?: LoginDropdownOption[];
};

const LoginDropdown: React.FC<LoginDropdownProps> = ({
  label,
  onChange,
  value,
  resource,
  valueKey,
  labelKey,
  ...props
}) => {
  const [LoginDropdownOptions, setLoginDropdownOptions] = useState<
    LoginDropdownOption[]
  >(props.options || []);

  const [loading, setLoading] = useState<boolean>(false);

  if (resource && valueKey && labelKey) {
    const { data, isLoading } = useList({
      resource: resource || "",
      queryOptions: {
        enabled: !!resource && !!valueKey && !!labelKey,
      },
    });
    useEffect(() => {
      if (data && valueKey && labelKey) {
        if (data?.data) {
          const options =
            data?.data?.map((item: any) => ({
              value: item[valueKey],
              label: item[labelKey],
            })) || [];
          setLoginDropdownOptions(options);
        } else {
          const options =
            data?.map((item: any) => ({
              value: item[valueKey],
              label: item[labelKey],
            })) || [];
          setLoginDropdownOptions(options);
        }
      }
      setLoading(isLoading);
    }, [data, isLoading, valueKey, labelKey]);
  }

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
    <div className="relative">
      <FormControl className="w-full relative" variant="standard">
        <label
          htmlFor={props.id}
          className="mb-1.5 block text-[#0000009c] font-medium z-10 absolute text-sm left-3.5 top-2 flex items-center gap-1"
        >
          {label}
          {props.required && <span className="text-red-500">*</span>}
          {!props.required && (
            <span className="text-gray-500 text-xs">(Optional)</span>
          )}
        </label>
        <Select
          value={value ? (value as string) : ""}
          onChange={handleChange}
          displayEmpty
          size="small"
          disabled={props.disabled}
          sx={{
            pt: 3,
            px: 2,
            backgroundColor: "transparent !important",
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                bgcolor: "transparent",
              },
          }}
        >
          {loading ? (
            <MenuItem key="loading">Loading...</MenuItem>
          ) : (
            LoginDropdownOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default LoginDropdown;
