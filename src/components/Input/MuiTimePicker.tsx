import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

// Extend dayjs with the utc plugin
dayjs.extend(utc);

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { InputProps } from "@mui/base";
import { TextField } from "@mui/material";
import { DesktopTimePicker } from "@mui/x-date-pickers";
interface CustomizedInputProps {
  label: string;
  [key: string]: any;
}

type BaseInputProps = CustomizedInputProps & InputProps;

const CustomTextField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof TextField>
>((props, ref) => (
  <TextField
    {...props}
    ref={ref}
    sx={{
      borderRadius: "4px",
      p: "0",
    }}
  />
));

const MuiTimePicker = React.forwardRef<HTMLDivElement, BaseInputProps>(
  ({ label, onChange, ...props }, ref) => {
    const handleChange = (newValue: Dayjs) => {
      if (onChange) {
        onChange({
          target: {
            name: props.name,
            value: newValue.format("HH:mm:ss"), // Changed to 24-hour format
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div ref={ref} className="flex items-center gap-2">
          <div className="">{label}</div>
          <DesktopTimePicker
            onChange={(newValue) => handleChange(newValue as Dayjs)}
            value={
              props.value
                ? dayjs.utc(`2022-04-17T${props.value}` as string)
                : null
            } // Use utc to avoid timezone issues
            disabled={props.disabled}
            slotProps={{ textField: { size: "small" } }}
          />
        </div>
      </LocalizationProvider>
    );
  }
);

export default MuiTimePicker;
