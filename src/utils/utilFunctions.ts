import { FieldConfig } from "@components/Forms/FormControlWrapper";
import { InitialFieldConfig } from "@components/Forms/InitialFieldConfig";
import { CrudSort } from "@refinedev/core";
import { format } from "date-fns";
import { MRT_SortingState } from "material-react-table";
import { matchIsValidTel } from "mui-tel-input";

export const getFormattedDate = (timestamp: any) => {
  if (timestamp === null || timestamp === undefined) {
    return "";
  }
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    const formattedDate = format(date, "d-MMM-yyyy"); // Updated format to "9-May-2025"
    return formattedDate;
  }
  return timestamp;
};

export const getFormattedDateWithTime = (timestamp: any) => {
  if (timestamp === null || timestamp === undefined) {
    return "";
  }
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return format(date, "dd-MMM-yyyy HH:mm:ss"); // Will return local browser time
  }
  return timestamp;
};

export const getReadableDate = (dateString: any) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export const getTitleCase = (inputString: string) => {
  // Extract the substring after the last dot
  const lastPart = inputString.split(".").pop();

  // Convert the extracted substring to title case
  return lastPart
    ?.split("_") // Split the string by underscores
    .map(
      (
        word // Capitalize each word
      ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" "); // Join the words with spaces
};
export const getRealFormFields = (
  InitialCustomerFormFields: InitialFieldConfig[]
) => {
  return InitialCustomerFormFields.map((field) => {
    const value: FieldConfig = {
      label: field.label || (getTitleCase(field.name) as string),
      placeholder: getTitleCase(field.name),
      ...field,
    };
    if (!field.type) {
      value.type = "text";
    }
    if (field.required) {
      value.rules = {
        required: `This field is required`,
      };

      if (field.manualValidation) {
        value.rules = {};
      }

      if (field.required == "website") {
        value.rules.pattern = {
          value:
            /^(http:\/\/|https:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/, // Updated regex to require http or https
          message: "Invalid website URL",
        };
      }
      if (field.required == "number") {
        value.rules.pattern = {
          value: /^(0|[1-9]\d*)$/, // Updated regex to allow only non-negative numbers
          message: "This must be a non-negative number",
        };
      }
      if (field.required == "email") {
        value.rules.pattern = {
          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          message: "Invalid email address",
        };
      }
      if (field.required == "phone") {
        value.rules.validate = (inputValue: string) => {
          if (inputValue === null || inputValue === "") return true; // Skip validation if value is null or empty
          const isValid = matchIsValidTel(inputValue); // Use isValid for phone validation
          return isValid || "Invalid phone number"; // Validate using isValid and return message if invalid
        };
      }
      if (field.required == "password") {
        value.rules.validate = (value: string) => {
          if (value.length < 8) {
            return "Password must be at least 8 characters long";
          }
          if (!/\d/.test(value)) {
            return "Password must include at least 1 number";
          }
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return "Password must include at least 1 special character";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must include at least 1 uppercase letter";
          }
          return true;
        };
      }
    } else {
      if (field.type == "phone") {
        value.rules = {
          validate: (inputValue: string) => {
            if (
              inputValue === null ||
              inputValue === "" ||
              inputValue === undefined
            )
              return true; // Skip validation if value is null or empty
            const isValid = matchIsValidTel(inputValue); // Use isValid for phone validation
            return isValid || "Invalid phone number"; // Validate using isValid and return message if invalid
          },
        };
      }
      if (field.validation == "website") {
        // Ensure value.rules is initialized
        value.rules = value.rules || {}; // Initialize if undefined
        value.rules.pattern = {
          value:
            /^(http:\/\/|https:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/, // Updated regex to require http or https
          message: "Invalid website URL",
        };
        value.rules.validate = (inputValue: string) => {
          // Changed parameter name to inputValue
          if (
            inputValue === null ||
            inputValue === "" ||
            inputValue === undefined
          )
            return true; // Skip validation if value is null or empty
          return value.rules.pattern.value.test(inputValue); // Validate against the regex
        };
      }
    }
    return value;
  });
};

export const getNestedValue = (obj: any, key: string) => {
  if (!obj) return "";
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const convertSortingStateToCrudSort = (
  sortingState: MRT_SortingState
): CrudSort[] => {
  return sortingState.map((sort) => ({
    field: sort.id,
    order: sort.desc ? "desc" : "asc",
  }));
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

export const getEndDate = (startDate: Date, str: string) => {
  if (!str) return startDate;
  if (str == "EA") return startDate;
  const endDate = new Date(startDate);
  const number = Number(str.match(/\d+/)?.[0]);
  if (str.includes("YR")) {
    endDate.setFullYear(endDate.getFullYear() + number);
  } else if (str.includes("MO")) {
    endDate.setMonth(endDate.getMonth() + number);
  } else if (str.includes("D")) {
    endDate.setDate(endDate.getMonth() + number);
  }
  return endDate.toISOString().split("T")[0];
};

export const getInputCustomer = (data: any, type: string) => {
  const value: { [key: string]: any } = {};
  Object.keys(data).forEach((key) => {
    value[type + key] = data[key] ? data[key] : "";
  });
  return value;
};

export const getDisabledFields = (fields: FieldConfig[]) => {
  return fields.map((field) => {
    return {
      ...field,
      disabled: true,
    };
  });
};

export const setDisabledFields = (fields: any[], disabledName: string[]) => {
  return fields.map((field) => {
    if (disabledName.includes(field.name)) {
      return { ...field, disabled: true };
    }
    return field;
  });
};

export const getPasswordValidationMessage = (password: string) => {
  if (password === "") {
    return "This field is required";
  }

  // Individual password validations
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/\d/.test(password)) {
    return "Password must include at least 1 number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must include at least 1 special character";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least 1 uppercase letter";
  }
  return "";
};

export function getWeekStrings(startDate: Date, endDate: Date): string[] {
  const weekStrings: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = currentDate.toLocaleString("default", { month: "short" });
    const weekNumber = Math.ceil(currentDate.getDate() / 7);

    const weekString = `${month} ${getOrdinal(weekNumber)}`;
    weekStrings.push(weekString);

    // Move to the next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weekStrings;
}

export function getMonthStrings(startDate: Date, endDate: Date): string[] {
  const monthStrings: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = currentDate.toLocaleString("default", { month: "short" });
    if (!monthStrings.includes(month)) {
      monthStrings.push(month);
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthStrings;
}

export function getDayStrings(startDate: Date, endDate: Date): string[] {
  const dayStrings: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const month = currentDate.getMonth() + 1; // getMonth() is 0-indexed
    const day = currentDate.getDate();
    const dayString = `${month}.${day}`;
    dayStrings.push(dayString);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dayStrings;
}

export function getOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = n % 10;
  return (
    n +
    (remainder <= 3 && (n % 100 < 11 || n % 100 > 13)
      ? suffixes[remainder]
      : suffixes[0])
  );
}
