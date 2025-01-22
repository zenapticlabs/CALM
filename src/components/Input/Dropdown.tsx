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

interface DropdownOption {
  value: string;
  label: string;
}

type DropdownProps = BaseInputProps & {
  resource?: string;
  valueKey?: string;
  labelKey?: string;
  selectNoneOption?: boolean;
  options?: DropdownOption[];
};

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      watch,
      label,
      onChange,
      value,
      resource,
      valueKey,
      labelKey,
      selectNoneOption,
      ...props
    },
    ref
  ) => {
    const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>(
      props.options || []
    );

    const [loading, setLoading] = useState<boolean>(false);

    const [dependency, setDependency] = useState<string>();

    if (resource && valueKey && labelKey) {
      if (props.dependency) {
        if (props.dependency === "vendor_name") {
          const { data, isLoading, refetch } = useList({
            resource: `${resource}?dependency=${dependency}` || "",
            hasPagination: false,
            queryOptions: {
              enabled: !!resource && !!valueKey && !!labelKey,
            },
          });
          const vender_name = watch(props.dependency);
          useEffect(() => {
            if (vender_name) {
              setDependency(vender_name);
              refetch();
            }
          }, [vender_name]);
          useEffect(() => {
            if (data && valueKey && labelKey) {
              const options =
                data?.data
                  ?.filter(
                    (item: any) => item.active == null || item.active == true
                  )
                  ?.map((item: any) => ({
                    value: item[valueKey],
                    label: item[labelKey],
                  })) || [];
              setDropdownOptions(options);
            }
            setLoading(isLoading);
          }, [data, isLoading, valueKey, labelKey]);
        }
      } else {
        const { data, isLoading } = useList({
          resource: resource || "",
          hasPagination: false,
          queryOptions: {
            enabled: !!resource && !!valueKey && !!labelKey,
          },
        });
        useEffect(() => {
          if (data && valueKey && labelKey) {
            const options =
              data?.data
                ?.filter(
                  (item: any) => item.active == null || item.active == true
                )
                ?.map((item: any) => ({
                  value: item[valueKey],
                  label: item[labelKey],
                })) || [];
            setDropdownOptions(options);
          }
          setLoading(isLoading);
        }, [data, isLoading, valueKey, labelKey]);
      }
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
      <div className="relative" ref={ref}>
        <FormControl className="w-full relative">
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-[#000000cc] z-10 absolute text-sm left-4 top-2 flex items-center gap-1"
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
              pt: "26px",
              backgroundColor: "#dfe6ec",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: 1,
                  color: "black", // Adjust this color as needed
                },
            }}
          >
            {loading ? (
              <MenuItem key="loading">Loading...</MenuItem>
            ) : (
              selectNoneOption && (
                <MenuItem key="none" value="">
                  None
                </MenuItem>
              )
            )}
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

export default Dropdown;
