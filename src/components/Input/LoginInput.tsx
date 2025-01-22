import React from "react";
import { Input } from "@mui/base/Input";
import { BaseInputProps } from "./InputProps";

const LoginInput = ({ label, ...props }: BaseInputProps) => {
  return (
    <div className="relative font-['Arial',sans-serif]">
      <label
        htmlFor={props.id}
        className="mb-1.5 block text-[#416ac2] font-medium dark:text-white absolute text-sm left-2 top-2 flex items-center gap-1"
      >
        {label}
        {props.required && <span className="text-red-500">*</span>}
        {!props.required && (
          <span className="text-gray-500 text-xs">(Optional)</span>
        )}
      </label>
      <Input
        {...props}
        disabled={props.disabled}
        slotProps={{
          input: {
            className:
              "border-b border-[#1f325c] w-full bg-transparent duration-200 pb-2 pt-8 px-2 text-black outline-none focus-visible:shadow-none",
          },
        }}
      />
      {props.icon && (
        <span className="absolute right-4 top-2.5">{props.icon}</span>
      )}
    </div>
  );
};

export default LoginInput;
