"use client";

import { Address, Contact, Partner, Transaction } from "@/types/types";
interface CustomersInformationProps {
  transaction?: Transaction;
}

const CustomersInformation: React.FC<CustomersInformationProps> = ({
  transaction,
}) => {
  const items = (type: string) => [
    // {
    //   label: "Account",
    //   value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
    //     ?.account_id,
    // },
    {
      label: "Customer Name",
      value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
        ?.name,
    },
    // {
    //   label: "Partner Number",
    //   value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
    //     ?.partner_number,
    // },
    // {
    //   label: "Type",
    //   value: (transaction?.[type as keyof Transaction] as Partial<Partner>)
    //     ?.type,
    // },
    {
      label: "Address",
      value: `${
        (
          transaction?.[
            (type + "_address") as keyof Transaction
          ] as Partial<Address>
        )?.address1 || ""
      } ${
        (
          transaction?.[
            (type + "_address") as keyof Transaction
          ] as Partial<Address>
        )?.address2 || ""
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
        )?.first_name || ""
      } ${
        (
          transaction?.[
            (type + "_contact") as keyof Transaction
          ] as Partial<Contact>
        )?.last_name || ""
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
  ];
  return (
    <div className="grid grid-cols-4">
      {/* <div className="text-lg font-bold px-12">Billing</div>
      <CustomerInformation transaction={transaction} type="bill_customer" />
      <div className="text-lg font-bold px-12 pt-4">Shipping</div>
      <CustomerInformation transaction={transaction} type="ship_customer" />
      <div className="text-lg font-bold px-12 pt-4">Reseller</div>
      <CustomerInformation transaction={transaction} type="reseller" /> */}
      <div className="">
        <div className="h-12 flex items-center py-3 border-b border-[#d5dce3] text-[#666f75] pl-12"></div>
        {items("").map((item) => (
          <div
            className="h-12 flex items-center text-base py-3 border-b border-[#d5dce3] text-[#666f75] pl-12 font-semibold"
            key={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="">
        <div className="h-12 flex items-center border-b border-[#d5dce3] text-[#666f75] font-semibold">
          Billing
        </div>
        {items("bill_customer").map((item) => (
          <div
            className="flex items-center text-base h-12 border-b border-[#d5dce3] text-[#666f75] "
            key={item.label}
          >
            {item.value}
          </div>
        ))}
      </div>
      <div className="">
        <div className="h-12 flex items-center border-b border-[#d5dce3] text-[#666f75] font-semibold">
          Shipping
        </div>
        {items("ship_customer").map((item) => (
          <div
            className="flex items-center text-base h-12 border-b border-[#d5dce3] text-[#666f75]"
            key={item.label}
          >
            {item.value}
          </div>
        ))}
      </div>
      <div className="">
        <div className="h-12 flex items-center border-b border-[#d5dce3] text-[#666f75] font-semibold">
          Reseller
        </div>
        {items("reseller").map((item) => (
          <div
            className="flex items-center text-base h-12 border-b border-[#d5dce3] text-[#666f75]"
            key={item.label}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersInformation;
