import React, { ChangeEventHandler, forwardRef } from "react";
import { Input } from "@mui/base/Input";
import { BaseInputProps } from "./InputProps";
// Add this import

const GeneralInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, onChange, ...props }, ref) => {
    const handleChange: ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (event) => {
      changeValue(event.target.value as string);
    };
    const changeValue = (value: any) => {
      onChange &&
        onChange({
          target: {
            name: props.name2 ? props.name2 : props.name,
            value: value,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    return (
      <div className="relative">
        <label
          htmlFor={props.id}
          className="mb-1.5 block text-[#000000cc] dark:text-white absolute text-sm left-4 top-2 flex items-center gap-1"
        >
          {label}
          {props.required && <span className="text-red-500">*</span>}
          {!props.required && (
            <span className="text-gray-500 text-xs">(Optional)</span>
          )}
        </label>
        <Input
          {...props}
          value={props.value}
          ref={ref} // Add this line
          onChange={handleChange}
          disabled={props.disabled}
          slotProps={{
            input: {
              className: `
            border border-transparent w-full rounded bg-[#dfe6ec] 
            ${props.disabled ? "!text-[#00000061]" : "text-black"}
            hover:bg duration-200 focus:border-black
            pb-2 pt-8 px-4 outline-none focus-visible:shadow-none
          `,
            },
          }}
          onBlur={(e) => {
            if (props.type == "number") {
              let numValue = parseInt(e.target.value);
              if (numValue < 1) numValue = 1;
              if (numValue > 99) numValue = 99;
              changeValue(numValue);
            }
          }}
        />
        {/* )} */}
        {props.icon && (
          <span className="absolute right-4 top-2.5">{props.icon}</span>
        )}
      </div>
    );
  }
);

export default GeneralInput;
