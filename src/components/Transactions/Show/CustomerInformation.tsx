"use client";

import {
  Address,
  Contact,
  Partner,
  Transaction,
} from "@/types/types";
import GeneralInformation from "@components/common/View/GeneralInformation";

interface CustomerInformationProps {
  transaction?: Transaction;
  type: string;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  transaction,
  type,
}) => {
  return (
    <GeneralInformation
      singleColumn
      items={[
        {
          label: "Account",
          value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
            ?.account_id,
        },
        {
          label: "Customer Name",
          value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
            ?.name,
        },
        {
          label: "Partner Number",
          value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
            ?.partner_number,
        },
        {
          label: "Type",
          value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
            ?.type,
        },
        {
          label: "Address",
          value: `${
            (
              transaction?.[
                (type + "_address") as keyof Transaction
              ] as Partial<Address>
            )?.address1
          } ${
            (
              transaction?.[
                (type + "_address") as keyof Transaction
              ] as Partial<Address>
            )?.address2
          }`,
        },
        {
          label: "City",
          value: (
            transaction?.[
              (type + "_address") as keyof Transaction
            ] as Partial<Address>
          )?.city,
        },
        {
          label: "State/Province",
          value: (
            transaction?.[
              (type + "_address") as keyof Transaction
            ] as Partial<Address>
          )?.state,
        },
        {
          label: "Postal Code",
          value: (
            transaction?.[
              (type + "_address") as keyof Transaction
            ] as Partial<Address>
          )?.postal_code,
        },
        {
          label: "Country",
          value: (
            transaction?.[
              (type + "_address") as keyof Transaction
            ] as Partial<Address>
          )?.country,
        },
        {
          label: "Contact Name",
          value: `${
            (
              transaction?.[
                (type + "_contact") as keyof Transaction
              ] as Partial<Contact>
            )?.first_name
          } ${
            (
              transaction?.[
                (type + "_contact") as keyof Transaction
              ] as Partial<Contact>
            )?.last_name
          }`,
        },
        {
          label: "Contact Phone",
          value: (
            transaction?.[
              (type + "_contact") as keyof Transaction
            ] as Partial<Contact>
          )?.phone,
        },
        {
          label: "Contact Email",
          value: (
            transaction?.[
              (type + "_contact") as keyof Transaction
            ] as Partial<Contact>
          )?.email,
        },
      ]}
    ></GeneralInformation>
  );
};

export default CustomerInformation;
