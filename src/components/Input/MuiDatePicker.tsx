import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { InputProps } from "@mui/base";
interface CustomizedInputProps {
  label: string;
  [key: string]: any;
}

type BaseInputProps = CustomizedInputProps & InputProps;

const MuiDatePicker = React.forwardRef<HTMLDivElement, BaseInputProps>(
  ({ label, onChange, ...props }, ref) => {
    const handleChange = (newValue: Dayjs) => {
      if (onChange) {
        onChange({
          target: {
            name: props.name,
            value:
              props.type === "time"
                ? newValue.format("YYYY-MM-DD hh:mm:ss")
                : newValue.format("YYYY-MM-DD"),
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div ref={ref} className="flex items-center gap-2">
          <div className="w-36">{label}</div>
          <DesktopDatePicker
            onChange={(newValue) => handleChange(newValue as Dayjs)}
            value={props.value ? dayjs(props.value as string) : null}
            disabled={props.disabled}
            readOnly
            slotProps={{ textField: { size: "small" } }}
          />
        </div>
      </LocalizationProvider>
    );
  }
);

export default MuiDatePicker;
