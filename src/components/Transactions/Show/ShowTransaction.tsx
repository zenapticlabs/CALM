"use client";

import { Transaction } from "@/types/types";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
} from "@components/Tab/CustomizedTab";
import { getFormattedDate, getNestedValue } from "@utils/utilFunctions";
import BasicInformation from "./BasicInformation";
import AssetInformation from "./AssetInformation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PersonIcon from "@mui/icons-material/Person";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import CustomersInformation from "./CustomersInformation";
import { Box } from "@mui/material";
import { TxtStatusColor } from "@data/ColorData";
import { tagStyle } from "@data/MuiStyles";

interface ShowTransactionProps {
  transaction?: Transaction;
}

const ShowTransaction: React.FC<ShowTransactionProps> = ({ transaction }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const summaryfields = [
    { title: "Txn Number", key: "transaction_number" },
    {
      title: "Txn Date",
      key: "transaction_date",
      value: getFormattedDate(transaction?.transaction_date),
    },
    { title: "Txn Source", key: "transaction_source" },
    { title: "Txn Action", key: "transaction_action" },
    { title: "Bill Customer", key: "bill_customer.name" },
    // {
    //   title: "Product Part Number",
    //   key: "asset.osc_product.product_part_number",
    //   value:
    //     transaction?.asset?.osc_product?.product_part_number ||
    //     transaction?.product_part_number,
    // },
    {
      title: "Product",
      key: "asset.osc_product.product_name",
      value:
        transaction?.asset?.osc_product?.product_name ||
        transaction?.product_name ||
        "",
    },
    {
      title: "Seat Count",
      key: "asset.osc_seat_count",
      value: transaction?.asset?.osc_seat_count || "0",
    },
    {
      title: "Txn Status",
      key: "transaction_status",
      value: (
        <Box
          component="span"
          sx={{
            backgroundColor:
              TxtStatusColor[transaction?.transaction_status as string],
            ...tagStyle,
          }}
        >
          {transaction?.transaction_status}
          {/* {transaction?.asset
            ? transaction.asset.agreement_accepted
              ? "Accepted"
              : "Waiting for Acceptance"
            : transaction?.transaction_status == "Waiting for Acceptance"
              ? "Waiting for Acceptance"
              : ""} */}
        </Box>
      ),
    },
  ];
  return (
    <div>
      <div>
        <div className="grid grid-cols-4 items-start gap-x-8 gap-y-6 px-12 mt-8">
          {summaryfields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1 text-lg">
              <div className="text-[#515f72] font-semibold">{field.title}</div>
              <div className="text-[#687991]">
                {field.value || getNestedValue(transaction, field.key)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="">
        <div className="px-12 pt-4">
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <StyledTab
              label={
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} />
                  Transaction Details
                </div>
              }
            />
            <StyledTab
              label={
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCubes} />
                  Product Details
                </div>
              }
            />
            <StyledTab
              label={
                <div className="flex items-center gap-2">
                  <PersonIcon />
                  Customer Details
                </div>
              }
            />
            {/* <StyledTab label="Bill Customer" />
            <StyledTab label="Ship Customer" />
            <StyledTab label="Reseller" /> */}
          </StyledTabs>
        </div>
      </div>
      <CustomTabPanel value={value} index={0}>
        <BasicInformation transaction={transaction} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AssetInformation transaction={transaction} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CustomersInformation transaction={transaction} />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        <CustomerInformation transaction={transaction} type="bill_customer" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CustomerInformation transaction={transaction} type="ship_customer" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <CustomerInformation transaction={transaction} type="reseller" />
      </CustomTabPanel> */}
    </div>
  );
};

export default ShowTransaction;
