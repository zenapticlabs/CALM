"use client";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { GenericFormProps } from "../FormControlWrapper";

import { useState } from "react";
import TransactionPartnerFormFields from "../Partners/TransactionPartnerFormFields";
import CustomerForm from "../Transactions/CustomerForm";

export type UpdateCustomerFormProps = GenericFormProps & {
  transaction?: any;
  setValue?: any;
  reset?: any;
  customers?: any;
  watch?: any;
};

const UpdateCustomerForm = (props: UpdateCustomerFormProps) => {
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(
    { Transaction: true }
  );

  const handleAccordionChange = (panel: string) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const FormGroups = [
    {
      icon: <PaidOutlinedIcon />,
      title: "Shipping Parter Information",
      description: "Setup your Shipping Partner Information",
      fields: TransactionPartnerFormFields.ShippingFields,
      customer: {
        type: "shipping",
        prefix: "ship_",
        customer: props.transaction?.ship_customer || props.transaction?.owner,
        address: props.transaction?.ship_customer_address,
        contact: props.transaction?.ship_customer_contact,
      },
    },
    {
      icon: <AccountBalanceWalletOutlinedIcon />,
      title: "Disty/Billing Partner Information",
      description: "Setup your Billing Partner Information",
      fields: TransactionPartnerFormFields.BillFields,
      customer: {
        type: "billing",
        prefix: "bill_",
        // data: props.transaction?.bill_customer || props.customers.bill_customers
        customer: props.transaction?.bill_customer,
        address: props.transaction?.bill_customer_address,
        contact: props.transaction?.bill_customer_contact,
      },
    },
    {
      icon: <ProductionQuantityLimitsOutlinedIcon />,
      title: "Reseller Information",
      description: "Setup your Reseller Information",
      fields: TransactionPartnerFormFields.ResellerFields,
      customer: {
        type: "reseller",
        prefix: "reseller_",
        // data: props.transaction?.reseller || props.customers.resellers
        customer: props.transaction?.reseller,
        address: props.transaction?.reseller_address,
        contact: props.transaction?.reseller_contact,
      },
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {FormGroups.map((formGroup, i) => (
        <Accordion
          key={formGroup.title}
          expanded={expandedPanels[formGroup.title] || false}
          onChange={() => handleAccordionChange(formGroup.title)}
          sx={{
            borderTop: "2px solid #1f325c",
            "&::before": { display: "none" },
            borderRadius: "0",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowForwardIosSharpIcon
                sx={{ fontSize: "0.9rem", color: "#536175" }}
              />
            }
            aria-controls={`${formGroup.title}-content`}
            id={`${formGroup.title}-content`}
            sx={{
              py: 1,
              flexDirection: "row-reverse",
              color: "#536175",
              transitionDuration: "500ms",
              "&:hover": {
                color: "#003133",
              },
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(90deg)",
              },
            }}
          >
            <div className="pl-4">{formGroup.icon}</div>
            <div className="pl-2 text-md font-medium flex gap-4">
              {formGroup.title}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <CustomerForm
              {...{
                ...props,
                fields: formGroup.fields,
                customer: formGroup.customer,
              }}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default UpdateCustomerForm;
