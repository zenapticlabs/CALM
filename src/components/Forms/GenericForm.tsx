import React from "react";
import GeneralInput from "@components/Input/GeneralInput";
import FormControlWrapper from "./FormControlWrapper";
import DatePicker from "@components/Input/DatePicker";
import Dropdown from "@components/Input/Dropdown";
import { FieldConfig } from "./FormControlWrapper";
import GeneralSwitch from "@components/Input/GeneralSwitch";
import AutoComplete from "@components/Input/AutoComplete";
import AddressSelect from "@components/Input/AddressSelect";
import PhoneInput from "@components/Input/PhoneInput";
import GeneralCheckbox from "@components/Input/Checkbox";

interface GenericFormProps {
  control: any;
  errors: any;
  fields: FieldConfig[];
  setValue?: any;
  watch?: any;
}

const GenericForm: React.FC<GenericFormProps> = ({
  control,
  errors,
  fields,
  setValue,
  watch,
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
      {fields?.map((field) => (
        <>
          {field.type === "address" ? (
            <AddressSelect {...{ control, field, errors, setValue }} />
          ) : (
            <div
              key={field.name}
              className={field.size == 2 ? "col-span-2" : ""}
            >
              <FormControlWrapper
                name={field.name2 ? field.name2 : field.name}
                control={control}
                rules={field.rules}
                error={errors[field.name]?.message?.toString()}
              >
                {(fieldProps) => {
                  switch (field.type) {
                    case "phone":
                      return (
                        <PhoneInput
                          {...fieldProps}
                          label={field.label}
                          required={field.required}
                          disabled={field.disabled}
                        />
                      );
                    case "text":
                    case "number":
                    case "password":
                      return (
                        <GeneralInput
                          {...fieldProps}
                          type={field.type}
                          label={field.label}
                          required={field.required}
                          disabled={field.disabled}
                        // placeholder={field.placeholder}
                        />
                      );
                    case "switch":
                      return (
                        <GeneralSwitch
                          {...fieldProps}
                          type={field.type}
                          label={field.label}
                          disabled={field.disabled}
                        // placeholder={field.placeholder}
                        />
                      );
                    case "date":
                      return (
                        <DatePicker
                          {...fieldProps}
                          label={field.label}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          required={!!field.rules}
                        />
                      );
                    case "dropdown":
                      return (
                        <Dropdown
                          {...fieldProps}
                          label={field.label}
                          placeholder={field.placeholder}
                          name2={field.name2}
                          options={field.options || []}
                          resource={field.resource}
                          valueKey={field.valueKey}
                          labelKey={field.labelKey}
                          disabled={field.disabled}
                          dependency={field.dependency}
                          required={field.required}
                          watch={watch}
                        // fetchOptions={field.fetchOptions}
                        />
                      );
                    case "autocomplete":
                      return (
                        <AutoComplete
                          {...fieldProps}
                          label={field.label}
                          placeholder={field.placeholder}
                          name2={field.name2}
                          options={field.options || []}
                          resource={field.resource}
                          valueKey={field.valueKey}
                          labelKey={field.labelKey}
                          elseKey={field?.elseKey}
                          disabled={field.disabled}
                          required={field.required}
                        // fetchOptions={field.fetchOptions}
                        />
                      );
                    case "checkbox":
                      return (
                        <GeneralCheckbox
                          {...fieldProps}
                          label={field.label}
                          placeholder={field.placeholder}
                          name2={field.name2}
                          options={field.options || []}
                          resource={field.resource}
                          valueKey={field.valueKey}
                          labelKey={field.labelKey}
                          elseKey={field?.elseKey}
                          disabled={field.disabled}
                          required={field.required} />
                      )
                    default:
                      return <div />;
                  }
                }}
              </FormControlWrapper>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default GenericForm;
