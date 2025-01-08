"use client";

import { Transaction } from "@/types/types";
import GeneralInformation from "@components/common/View/GeneralInformation";
import { TxtActionColor, TxtStatusColor } from "@data/ColorData";
import { tagStyle } from "@data/MuiStyles";
import { Box } from "@mui/material";
import {
  getFormattedDate,
  getFormattedDateWithTime,
} from "@utils/utilFunctions";

interface BasicInformationProps {
  transaction?: Transaction;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ transaction }) => {
  return (
    <GeneralInformation
      singleColumn
      items={[
        {
          label: "Transaction Number",
          value: transaction?.transaction_number,
        },
        {
          label: "Transaction Date",
          value: getFormattedDate(transaction?.transaction_date),
        },
        {
          label: "Transaction Action",
          value: transaction?.transaction_action,
          // value: (
          //   <Box
          //     component="span"
          //     sx={{
          //       backgroundColor:
          //         TxtActionColor[transaction?.transaction_action as string],
          //       ...tagStyle,
          //     }}
          //   >
          //     {transaction?.transaction_action}
          //   </Box>
          // ),
        },
        {
          label: "Transaction Status",
          // value: transaction?.transaction_status
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
        {
          label: "Comments",
          value: transaction?.comments || "No Comments",
        },
        {
          label: "Notification Date",
          value: getFormattedDate(transaction?.notification_date),
        },
        {
          label: "Transaction Source",
          value: transaction?.transaction_source,
        },
        {
          label: "Source Ref Number",
          value: transaction?.source_reference_number,
        },
        {
          label: "Source Ref Date",
          value: getFormattedDate(transaction?.source_reference_date),
        },
        {
          label: "Source Ref ID",
          value: transaction?.source_reference_id,
        },
        {
          label: "Source Integration Status",
          value: transaction?.source_integration_status || "No Error",
        },
        {
          label: "Error Message",
          value: transaction?.error_message || "No Error",
        },
        {
          label: "Agreement Accepted",
          value: transaction?.asset
            ? transaction.asset.agreement_accepted
              ? "Accepted"
              : "Waiting for Acceptance"
            : transaction?.transaction_status == "Waiting for Acceptance"
              ? "Waiting for Acceptance"
              : "",
        },
        {
          label: "Agreement Accepted Datetime",
          value: transaction?.asset?.agreement_accepted_datetime
            ? getFormattedDateWithTime(
                transaction?.asset?.agreement_accepted_datetime
              )
            : "",
        },
      ]}
    ></GeneralInformation>
  );
};

export default BasicInformation;
