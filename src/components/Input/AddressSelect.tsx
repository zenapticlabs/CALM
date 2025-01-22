import React, { useEffect, useState } from "react";

import { Country, State, City } from "country-state-city";
import { Autocomplete, TextField } from "@mui/material";
import FormControlWrapper, {
  FieldConfig,
} from "@components/Forms/FormControlWrapper";
import { getTitleCase } from "@utils/utilFunctions";

type CSCOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  field: FieldConfig;
  control: any;
  errors: any;
  setValue: any;
};
const AddressSelect: React.FC<DropdownProps> = ({
  field,
  control,
  errors,
  setValue,
}) => {
  const countries = Country.getAllCountries();
  const updatedCountries = countries
    .filter((country) => country.isoCode == "US" || country.isoCode == "CA")
    .map((country) => ({
      label: country.name,
      value: country.isoCode, // Change this to use isoCode instead of name
    }));
  const updatedStates = (countryCode: string) =>
    State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode, // Use state isoCode as value
    }));

  const updatedCities = (countryCode: string, stateCode: string) =>
    City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      label: city.name,
      value: city.name,
    }));

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [stateOptions, setStateOptions] = useState<CSCOption[]>([]);
  const [cityOptions, setCityOptions] = useState<CSCOption[]>([]);

  const handleCountryChange = (newValue: string | null) => {
    setSelectedCountry(newValue);
    setSelectedState(null); // Reset state when country changes
    setSelectedCity(null); // Reset city when country changes
    setStateOptions(
      newValue
        ? updatedStates(
            updatedCountries.find((c) => c.label === newValue)?.value || ""
          )
        : []
    );
    setCityOptions([]); // Clear city options when country changes
    setValue?.(field.prefix + "country", newValue || "");
    setValue?.(field.prefix + "state", "");
    setValue?.(field.prefix + "city", "");
  };
  const handleStateChange = (newValue: string | null) => {
    setSelectedState(newValue);
    setSelectedCity(null); // Reset city when state changes
    const countryCode = updatedCountries.find(
      (c) => c.label === selectedCountry
    )?.value;
    const stateCode = updatedStates(countryCode as string).find(
      (s) => s.label === newValue
    )?.value;
    setCityOptions(
      newValue && selectedCountry
        ? updatedCities(countryCode as string, stateCode as string)
        : []
    );
    setValue?.(field.prefix + "state", newValue || "");
    setValue?.(field.prefix + "city", "");
    // onChange(newValue || "");
  };
  const handleCityChange = (newValue: string | null) => {
    setSelectedCity(newValue);
    setValue?.(field.prefix + "city", newValue || "");
  };
  const customRenderInput = (title: string, params: any) => (
    <div className="relative">
      <label className="mb-1.5 block text-[#000000cc] z-10 absolute text-sm left-4 top-2 flex items-center gap-1">
        {getTitleCase(field.prefix ?? "") + title}
        {field.rules && <span className="text-red-500">*</span>}
        {!field.rules && (
          <span className="text-gray-500 text-xs">(Optional)</span>
        )}
      </label>
      <TextField
        {...params}
        sx={{
          "& .MuiInputBase-root": {
            pt: "28px",
            pb: "0px",
            backgroundColor: "#dfe6ec",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: "2px solid #1976d2", // Adjust color as needed for focus state
            },
        }}
      />
    </div>
  );

  return (
    <>
      <div key={field.name} className={field.size == 2 ? "col-span-2" : ""}>
        <FormControlWrapper
          name={field.prefix + "country"}
          control={control}
          rules={field.rules}
          error={errors[field.prefix + "country"]?.message?.toString()}
        >
          {(fieldProps) => {
            useEffect(() => {
              if (fieldProps.value) {
                handleCountryChange(fieldProps.value);
              }
            }, [fieldProps.value]);
            return (
              <Autocomplete
                disablePortal
                disabled={field.disabled}
                options={updatedCountries.map((c) => c.label)}
                renderInput={(params) => customRenderInput("Country", params)}
                value={selectedCountry}
                onChange={(event, newValue) => handleCountryChange(newValue)}
              />
            );
          }}
        </FormControlWrapper>
      </div>
      <div
        key={field.name + "-state"}
        className={field.size == 2 ? "col-span-2" : ""}
      >
        <FormControlWrapper
          name={field.prefix + "state"}
          control={control}
          rules={field.rules}
          error={errors[field.prefix + "state"]?.message?.toString()}
        >
          {(fieldProps) => {
            useEffect(() => {
              if (fieldProps.value) {
                handleStateChange(fieldProps.value);
              }
            }, [fieldProps.value]);
            return (
              <Autocomplete
                disablePortal
                disabled={field.disabled}
                options={stateOptions.map((s) => s.label)}
                renderInput={(params) => customRenderInput("State", params)}
                value={selectedState}
                onChange={(event, newValue) => handleStateChange(newValue)}
              />
            );
          }}
        </FormControlWrapper>
      </div>
      <div
        key={field.name + "-city"}
        className={field.size == 2 ? "col-span-2" : ""}
      >
        <FormControlWrapper
          name={field.prefix + "city"}
          control={control}
          rules={field.rules}
          error={errors[field.prefix + "city"]?.message?.toString()}
        >
          {(fieldProps) => {
            useEffect(() => {
              if (fieldProps.value) {
                handleCityChange(fieldProps.value);
              }
            }, [fieldProps.value]);
            return (
              <Autocomplete
                disablePortal
                disabled={field.disabled}
                options={cityOptions.map((c) => c.label)}
                renderInput={(params) => customRenderInput("City", params)}
                value={selectedCity}
                onChange={(event, newValue) => handleCityChange(newValue)}
              />
            );
          }}
        </FormControlWrapper>
      </div>
    </>
  );
};
export default AddressSelect;
