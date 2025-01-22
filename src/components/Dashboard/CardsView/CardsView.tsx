"use client";
import React from "react";
import EachCard from "./EachCard";
import { useOne } from "@refinedev/core";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const CardsView: React.FC = () => {
  const { data: transactionData, isLoading: transactionLoading } = useOne({
    resource: "transactions",
    id: "metrics",
  });

  const { data: assetData, isLoading: assetLoading } = useOne({
    resource: "assets",
    id: "metrics",
  });

  const calculatePercentage = (current: number, last: number) => {
    return Number((((current - last) / last) * 100).toFixed(2));
  };

  return (
    <div className="mt-4 mx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <EachCard
        title="Total Licenses"
        value={assetData?.data?.total_licenses}
        icon={<GridViewOutlinedIcon />}
        iconBgColor="#E3F2FD"
        iconColor="#1976D2"
      />
      <EachCard
        title="Active Licenses"
        value={assetData?.data?.current_issued_licenses}
        icon={<CheckCircleOutlineOutlinedIcon />}
        percentage={calculatePercentage(
          Number(assetData?.data?.current_issued_licenses),
          Number(assetData?.data?.last_issued_licenses)
        )}
        iconBgColor="#E8F5E9"
        iconColor="#388E3C"
      />
      <EachCard
        title="Expiring Licenses"
        value={assetData?.data?.current_expiring_licenses}
        icon={<PriorityHighOutlinedIcon />}
        percentage={calculatePercentage(
          Number(assetData?.data?.current_expiring_licenses),
          Number(assetData?.data?.last_expiring_licenses)
        )}
        iconBgColor="#FFF3E0"
        iconColor="#F57C00"
      />
      <EachCard
        title="Total Transactions"
        value={transactionData?.data?.total}
        icon={<ReceiptLongOutlinedIcon />}
        percentage={calculatePercentage(
          Number(transactionData?.data?.current),
          Number(transactionData?.data?.last)
        )}
        iconBgColor="#F3E5F5"
        iconColor="#7B1FA2"
      />
    </div>
  );
};

export default CardsView;
