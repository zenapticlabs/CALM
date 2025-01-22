"use client";

import { Address, Contact, Partner } from "@/types/types";
import { FieldConfig, GenericFormProps } from "../FormControlWrapper";
import GenericForm from "../GenericForm";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useTable } from "@refinedev/core";
import { getInputCustomer } from "@utils/utilFunctions";
import { IOSSwitch } from "@components/Input/GeneralSwitch";
import { DefaultPageSize } from "@data/UtilData";

export type CustomerFormProps = GenericFormProps & {
  reset?: any;
  watch?: any;
  setValue?: any;
  fields: FieldConfig[];
  transaction_action?: string;
  customer: any;
  disabledSearch?: boolean;
};

const ADDLABEL = "New Partner";

const CustomerForm = ({
  transaction_action,
  watch,
  reset,
  setValue: setValueProps,
  disabledSearch,
  fields,
  customer,
  ...props
}: CustomerFormProps) => {
  const [isSameBillShipping, setIsSameBillShipping] = useState(false);

  const handleSameBillShipping = () => {
    if (!isSameBillShipping) {
      setValueProps?.("bill_address1", watch("ship_address1"));
      setValueProps?.("bill_address2", watch("ship_address2"));
      setValueProps?.("bill_city", watch("ship_city"));
      setValueProps?.("bill_state", watch("ship_state"));
      setValueProps?.("bill_postal_code", watch("ship_postal_code"));
      setValueProps?.("bill_country", watch("ship_country"));
      setValueProps?.("bill_customer_account", watch("ship_customer_account"));
      setValueProps?.("bill_customer_name", watch("ship_customer_name"));
      setValueProps?.(
        "bill_contact_first_name",
        watch("ship_contact_first_name")
      );
      setValueProps?.(
        "bill_contact_last_name",
        watch("ship_contact_last_name")
      );
      setValueProps?.("bill_contact_email", watch("ship_contact_email"));
      setValueProps?.("bill_contact_phone", watch("ship_contact_phone"));
    }
    setIsSameBillShipping((prev) => !prev);
  };
  const [value, setValue] = useState<Partner>(
    customer.customer?.name
      ? (customer.customer as Partner)
      : { name: ADDLABEL }
  );

  const [partners, setPartners] = useState<Partner[]>([]);
  const [addresses, setAddresses] = useState<(Address | undefined)[]>(
    customer.customer?.addresses || []
  );
  const [contacts, setContacts] = useState<(Contact | undefined)[]>(
    customer.customer?.contacts || []
  );
  const [address, setAddress] = useState<Address | undefined>(customer.address);
  const [contact, setContact] = useState<Contact | undefined>(customer.contact);

  const {
    tableQueryResult: { data, isLoading },
    setFilters,
  } = useTable<Partner>({
    resource: `partners`,
    syncWithLocation: false,
    pagination: {
      pageSize: DefaultPageSize,
    },
  });

  const handleValueChange = (event: any, newValue: Partner | null) => {
    setValue(newValue as Partner);
    setAddresses(newValue?.addresses || []);
    setContacts(newValue?.contacts || []);
  };

  const handleReset = (value: any) => {
    Object.keys(getInputCustomer(value, customer.prefix)).forEach((key) => {
      setValueProps?.(
        key,
        value?.name == ADDLABEL
          ? ""
          : getInputCustomer(value, customer.prefix)[key]
      );
    });
  };
  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleInputChange = (event: any, newInputValue: string) => {
    if (newInputValue == ADDLABEL) {
      handleSearch("");
    } else {
      handleSearch(newInputValue);
    }
  };

  const handleAddressChange = (event: SelectChangeEvent) => {
    const address = addresses.find(
      (address) => address?.address_id == event.target.value
    );
    setAddress(address as Address);
  };

  const handleContactChange = (event: SelectChangeEvent) => {
    const contact = contacts.find(
      (contact) => contact?.contact_id == event.target.value
    );
    setContact(contact as Contact);
  };

  useEffect(() => {
    if (value?.account_id && value?.name != ADDLABEL) {
      const data = {
        customer_account: value?.account_id,
        customer_name: value?.name,
      };
      handleReset(data);
    }
  }, [value]);

  useEffect(() => {
    if (address) {
      handleReset(address);
    }
  }, [address]);

  useEffect(() => {
    if (contact) {
      const data = {
        contact_first_name: contact?.first_name,
        contact_last_name: contact?.last_name,
        contact_phone: contact?.phone,
        contact_email: contact?.email,
      };
      handleReset(data);
    }
  }, [contact]);

  useEffect(() => {
    if (data?.data) {
      setPartners(data?.data as Partner[]);
    }
  }, [data]);

  return (
    <div className="flex justify-center flex-col gap-4">
      <div className="grid grid-cols-3 items-center">
        <Autocomplete
          id="country-select-demo"
          value={value}
          onChange={handleValueChange}
          disabled={disabledSearch}
          fullWidth
          onInputChange={handleInputChange}
          options={[
            {
              name: ADDLABEL,
            },
            ...partners,
          ]}
          loading={isLoading}
          filterOptions={(options) => options}
          getOptionLabel={(option) => option.name as string}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Box key={key} component="li" {...optionProps}>
                {option.name == ADDLABEL ? (
                  <div className="border px-4 py-2 w-full text-center bg-[#1f325c] text-white">
                    {option.name}
                  </div>
                ) : (
                  <div className="text-sm flex flex-col gap-2 py-2">
                    <div className="flex flex-col gap-2">
                      <div className="">
                        <span className="font-bold">Account: </span>
                        {option.account_id}
                      </div>
                      <div className="">
                        <span className="font-bold">Name: </span>
                        {option.name}
                      </div>
                    </div>
                  </div>
                )}
              </Box>
            );
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                variant="filled"
                label="Customer"
                sx={{
                  backgroundColor: "#dfe6ec",
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#dfe6ec",
                    "&:hover": {
                      backgroundColor: "#dfe6ec",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#dfe6ec",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#dfe6ec",
                    },
                  },
                }}
              />
            );
          }}
        />

        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Address</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={address?.address_id}
            onChange={handleAddressChange}
            disabled={disabledSearch}
            sx={{
              backgroundColor: "#dfe6ec", // Change this to your desired color
              "&:hover": {
                backgroundColor: "#dfe6ec", // Optional: change background on hover
              },
              "&.Mui-disabled": {
                backgroundColor: "#dfe6ec",
              },
            }}
            renderValue={(selected) => {
              const selectedAddress = addresses.find(
                (ad) => ad?.address_id === selected
              );
              return selectedAddress
                ? `${selectedAddress.address1} ${selectedAddress.address2}`
                : "";
            }} // C
          >
            {addresses.map((ad, i) => (
              <MenuItem value={ad?.address_id} key={i}>
                <div className="flex flex-col gap-1 w-full py-1">
                  <div className="flex gap-2">
                    {ad?.address1 + " " + ad?.address2}
                  </div>
                  <div className="flex gap-2">
                    <div className="">{ad?.city}</div>
                    <div className="">{ad?.country}</div>
                    <div className="">{ad?.postal_code}</div>
                    <div className="">{ad?.state}</div>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Contact</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={contact?.contact_id}
            onChange={handleContactChange}
            disabled={disabledSearch}
            sx={{
              backgroundColor: "#dfe6ec", // Change this to your desired color
              "&:hover": {
                backgroundColor: "#dfe6ec", // Optional: change background on hover
              },
              "&.Mui-disabled": {
                backgroundColor: "#dfe6ec",
              },
            }}
            renderValue={(selected) => {
              const selectedContact = contacts.find(
                (c) => c?.contact_id === selected
              );
              return selectedContact
                ? `${selectedContact.first_name} ${selectedContact.last_name}`
                : "";
            }} // Custom display for selected value
          >
            {contacts.map((c, i) => (
              <MenuItem value={c?.contact_id} key={i}>
                <div className="flex flex-col gap-1 w-full py-1">
                  <div className="flex gap-2">
                    {c?.first_name + " " + c?.last_name}
                  </div>
                  <div className="flex gap-2">
                    <div className="">{c?.email}</div>
                    <div className="">{c?.phone}</div>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {customer?.prefix == "bill_" &&
        !(
          transaction_action == "Revoke" || transaction_action == "Renewal"
        ) && (
          <FormControlLabel
            control={
              <IOSSwitch
                checked={isSameBillShipping}
                onChange={handleSameBillShipping}
                sx={{ mx: 1 }}
              />
            }
            label="Same with shipping address"
          />
        )}
      <GenericForm {...{ ...props, fields: fields }} setValue={setValueProps} />
    </div>
  );
};

export default CustomerForm;
