"use client";

import { Asset, Seat, Transaction } from "@/types/types";
import TransactionHistoryTable from "@components/Assets/TransactionHistoryTable";
import Loader from "@components/common/Loader";
import GeneralInformation from "@components/common/View/GeneralInformation";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
} from "@components/Tab/CustomizedTab";
import GenericTable from "@components/Table/GenericTable";
import { refreshRefineBtnStyle } from "@data/MuiStyles";
import { Button } from "@mui/material";
import { useCreate, useNavigation, useParsed, useShow } from "@refinedev/core";
import { RefreshButton, Show } from "@refinedev/mui";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EmailHistoryTable from "@components/Assets/EmailHistoryTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  faCircleInfo,
  faCube,
  faCubes,
  faEnvelope,
  faGlassWater,
  faTentArrowLeftRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import StateComponent from "@components/common/StateComponent";
import {
  getFormattedDate,
  getFormattedDateWithTime,
} from "@utils/utilFunctions";
import AssetCustomersInformation from "@components/Assets/AssetCustomersInformation";

const Page = () => {
  const { params } = useParsed();
  const [value, setValue] = useState(0);
  const { push } = useNavigation();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { queryResult } = useShow<Asset>({
    resource: "assets",
    id: params?.id,
  });
  const { data, isLoading, refetch: refetchAssets } = queryResult;

  const asset: Asset = data?.data as Asset;
  const transactions: Transaction[] = data?.data?.transactions as Transaction[];
  const seats: Seat[] = data?.data?.seats as Seat[];
  const [refetchCount, setRefetchCount] = useState(0);
  const handleReActionBtn = (action: string) => {
    const path = "/dashboard/transactions/create?"; // your target route
    const queryParams = {
      asset_id: asset.asset_id as string,
      transaction_action: action,
    };

    // Navigate to the path with the query parameters
    push(path + new URLSearchParams(queryParams).toString());
  };
  const { mutate: CreateMutate } = useCreate();
  const resendEmail = () => {
    CreateMutate(
      {
        resource: `assets/${params?.id}/resend-email`,
        values: {},
        // successNotification: false,
        successNotification: {
          message: "Email has been resent successfully",
          type: "success",
          description: "The license information has been sent to the customer",
        },
      },
      {
        onSuccess: () => {
          setRefetchCount(refetchCount + 1);
        },
      }
    );
  };

  const SeatsColumns = useMemo<MRT_ColumnDef<Seat>[]>(
    () => [
      {
        accessorKey: "seat_id",
        header: "Seat Number",
        Cell: ({ renderedCellValue }) => (
          <div className="text-right w-full pr-12">{renderedCellValue}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "license_server_status",
        header: "License Server Status",
      },
      {
        accessorKey: "vendor_part_number",
        header: "Vendor part number",
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
      },
      {
        accessorKey: "end_date",
        header: "End Date",
      },
    ],
    []
  );

  const summaryfields = [
    { title: "License Key", key: "license_key" },
    { title: "Product Part Name", key: "osc_product.product_name", size: 2 },
    { title: "Duration", key: "osc_product.duration" },
    { title: "Product Type", key: "osc_product.product_type" },
    { title: "Seat Count", key: "osc_seat_count" },
    { title: "Owner", key: "owner.name" },
    { title: "Vender Part", key: "osc_product.vendor_name" },
    { title: "Start Date", key: "start_date" },
    { title: "End Date", key: "end_date" },
    {
      title: "Status",
      key: "active",
      value: (
        <StateComponent active={asset && (asset.active as boolean)} withLabel />
      ),
    },
  ];

  const getNestedValue = (obj: any, key: string) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="no-padding-card">
      <Show
        goBack={null}
        isLoading={isLoading}
        breadcrumb={false}
        wrapperProps={{
          className: "rounded-none bg-[#f2f6fa] shadow-none pt-10 pb-2.5",
        }}
        title={
          <div className="!font-satoshi px-12">
            <div className="flex items-end gap-4 text-2xl font-semibold text-[#1f325c]">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlassWater} />
                License{" "}
              </div>
              {/* <div className="text-lg font-normal">{asset?.license_key}</div> */}
            </div>
          </div>
        }
        headerButtons={({ refreshButtonProps }) => (
          <div className="flex gap-2 pr-10">
            {/* <Button sx={refreshRefineBtnStyle} onClick={() => resendEmail()}>
              <AutorenewIcon fontSize="small" />
              Resend Email
            </Button> */}
            <Button
              sx={refreshRefineBtnStyle}
              href={`/dashboard/assets/customer?asset_id=${params?.id}`}
              // onClick={() => resendEmail()}
            >
              <AutorenewIcon fontSize="small" />
              Update Customer
            </Button>
            <Button
              sx={refreshRefineBtnStyle}
              onClick={() => handleReActionBtn("Renewal")}
            >
              <AutorenewIcon fontSize="small" />
              Renew
            </Button>
            <Button
              sx={refreshRefineBtnStyle}
              onClick={() => handleReActionBtn("Revoke")}
            >
              <AutorenewIcon fontSize="small" />
              Revoke
            </Button>

            {/* <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} /> */}
          </div>
        )}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-5 items-start gap-x-8 gap-y-6 px-12 mt-8">
              {summaryfields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1 text-lg">
                  <div className="text-[#515f72] font-semibold">
                    {field.title}
                  </div>
                  <div className="text-[#687991]">
                    {field.value || getNestedValue(asset, field.key)}
                  </div>
                </div>
              ))}
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
                        License Detail
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faTentArrowLeftRight} />
                        Transaction History
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <PeopleAltIcon />
                        Customer Details
                      </div>
                    }
                  />
                  {/* <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCubes} />
                        Products
                      </div>
                    }
                  /> */}
                  {/* <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} />
                        License
                      </div>
                    }
                  /> */}
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} />
                        Email History
                      </div>
                    }
                  />
                  {/* <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCube} />
                        Seats
                      </div>
                    } 
                  />*/}
                </StyledTabs>
              </div>

              <CustomTabPanel value={value} index={0}>
                <GeneralInformation
                  singleColumn={true}
                  items={[
                    {
                      label: "License Key",
                      value: asset?.license_key,
                    },
                    {
                      label: "Part Number",
                      value: asset?.osc_product?.product_part_number,
                    },
                    {
                      label: "Duration",
                      value: asset?.osc_product?.duration,
                    },
                    {
                      label: "Product Type",
                      value: asset?.osc_product?.product_type,
                    },
                    {
                      label: "Owner",
                      value: asset?.owner?.name,
                    },
                    {
                      label: "Seat Count",
                      value: asset?.osc_seat_count,
                    },
                    {
                      label: "Status",
                      value: (
                        <StateComponent
                          active={asset && (asset?.active as boolean)}
                          withLabel
                        />
                      ),
                    },
                    {
                      label: "Vendor Name",
                      value: asset?.osc_product?.vendor_name,
                    },
                    {
                      label: "Vendor Part",
                      value: asset?.osc_product?.vendor_part_number,
                    },
                    {
                      label: "Start Date",
                      value: getFormattedDate(asset?.start_date),
                    },
                    {
                      label: "End Date",
                      value: getFormattedDate(asset?.end_date),
                    },
                    {
                      label: "Reseller",
                      value: asset?.reseller?.name,
                    },
                    {
                      label: "Agreement Accepted",
                      value: asset?.agreement_accepted
                        ? "Accepted"
                        : "Waiting for Acceptance",
                    },
                    {
                      label: "Agreement Accepted Datetime",
                      value: getFormattedDateWithTime(
                        asset?.agreement_accepted_datetime
                      ),
                    },
                    {
                      label: "Creation Date",
                      value: getFormattedDate(asset?.created_at),
                    },
                    {
                      label: "Last Update Date",
                      value: getFormattedDate(asset?.updated_at),
                    },
                  ]}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="max-w-full overflow-x-auto">
                  <TransactionHistoryTable
                    transactions={transactions}
                    asset={asset}
                  />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <div className="max-w-full overflow-x-auto">
                  <AssetCustomersInformation asset={asset} />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <div className="max-w-full overflow-x-auto">
                  <EmailHistoryTable
                    assetId={asset.asset_id as string}
                    asset={asset}
                    refetchCount={refetchCount}
                  />
                </div>
              </CustomTabPanel>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};

export default Page;
