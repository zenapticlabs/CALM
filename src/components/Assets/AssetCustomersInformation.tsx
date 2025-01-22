"use client";

import { Asset, Contact, Partner } from "@/types/types";
interface CustomersInformationProps {
  asset?: Asset;
}

const AssetCustomersInformation: React.FC<CustomersInformationProps> = ({
  asset,
}) => {
  const items = (type: string) => [
    {
      label: "Customer Name",
      value: (asset?.[type as keyof Asset] as Partial<Partner>)?.name,
    },
    {
      label: "Contact Name",
      value: `${
        (asset?.[(type + "_contact") as keyof Asset] as Partial<Contact>)
          ?.first_name || ""
      } ${
        (asset?.[(type + "_contact") as keyof Asset] as Partial<Contact>)
          ?.last_name || ""
      }`,
    },
    {
      label: "Contact Phone",
      value: (asset?.[(type + "_contact") as keyof Asset] as Partial<Contact>)
        ?.phone,
    },
    {
      label: "Contact Email",
      value: (asset?.[(type + "_contact") as keyof Asset] as Partial<Contact>)
        ?.email,
    },
  ];
  return (
    <div className="grid grid-cols-4">
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
            className="flex items-center text-base h-12 border-b border-[#d5dce3] text-[#666f75]"
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
            {item.label == "Customer Name" ? asset?.owner?.name : item.value}
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

export default AssetCustomersInformation;
