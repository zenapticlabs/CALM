"use client";
import React, { useMemo } from "react";
import { useNavigation, usePermissions, useTable } from "@refinedev/core";
import { Permission, Transaction } from "@/types/types";
import Loader from "@components/common/Loader";
import GenericTable from "@components/Table/GenericTable";
import { MRT_ColumnDef, MRT_SortingState } from "material-react-table";
import { Box } from "@mui/material";
import { TxtStatusColor } from "@data/ColorData";
import { tagStyle } from "@data/MuiStyles";
import {
  convertSortingStateToCrudSort,
  getFormattedDate,
} from "@utils/utilFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";

import { DefaultPageSize } from "@data/UtilData";
const Page = () => {
  const {
    tableQueryResult: { data, isLoading },
    setCurrent,
    setFilters,
    setSorters,
  } = useTable<Transaction>({
    initialSorter: [
      {
        field: "transaction_date",
        order: "desc",
      },
    ],
    pagination: {
      pageSize: DefaultPageSize,
    },
  });

  const { push } = useNavigation();

  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleSorting = (sorting: MRT_SortingState) =>
    setSorters(convertSortingStateToCrudSort(sorting));

  const handlePage = (value: number) => setCurrent(value);

  const handleCreate = () =>
    push("/dashboard/transactions/create?transaction_action=New");

  const handleRowClick = (row: Transaction) =>
    push(`/dashboard/transactions/show?id=${row.transaction_id}`);

  const { data: permissionsData } = usePermissions<Permission>({
    params: { codename: "transaction" },
  });

  const columns = useMemo<MRT_ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "transaction_number",
        header: "Txn Number", // Changed to string
        size: 20,
        Cell: ({ renderedCellValue }) => (
          <div className="text-right w-full pr-7">{renderedCellValue}</div>
        ),
      },
      {
        accessorKey: "transaction_date",
        header: "Txn Date",
        size: 100,
        Cell: ({ renderedCellValue }) =>
          getFormattedDate(renderedCellValue as string),
      },
      {
        accessorKey: "transaction_source",
        header: "Txn Source",
        size: 100,
      },
      {
        accessorKey: "source_reference_number",
        header: "Source Ref #",
        size: 100,
      },
      {
        accessorKey: "product_type",
        header: "Product Type",
        size: 100,
        Cell: ({ row }) =>
          row.original.product?.product_type ||
          row.original.asset?.osc_product?.product_type ||
          "",
      },
      {
        accessorKey: "license_type",
        header: "License Type",
        size: 100,
        Cell: ({ row }) => row.original.license_type,
      },
      {
        accessorKey: "product_name",
        header: "Product",
        size: 100,
        Cell: ({ row }) =>
          row.original.product?.product_name ||
          row.original.asset?.osc_product?.product_name ||
          row.original.product_name ||
          "",
      },
      {
        accessorKey: "osc_seat_count",
        header: "Seats Count",
        size: 100,
        Cell: ({ row }) => (
          <div className="text-right w-full pr-7">
            {row.original.quantity || row.original.asset?.osc_seat_count || 0}
          </div>
        ),
      },
      {
        accessorKey: "transaction_action",
        header: "Txn Action",
        size: 100,
        // Cell: ({ renderedCellValue }) => (
        //   <Box
        //     component="span"
        //     sx={{
        //       backgroundColor: TxtActionColor[renderedCellValue as string],
        //       ...tagStyle,
        //     }}
        //   >
        //     {renderedCellValue}
        //   </Box>
        // ),
      },
      {
        accessorKey: "transaction_status",
        header: "Txn Status",
        size: 200,
        Cell: ({ row }) => {
          const status = row.original.transaction_status;
          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor: TxtStatusColor[status as string],
                ...tagStyle,
              })}
            >
              {status}
            </Box>
          );
        },
      },
      {
        accessorKey: "agreement_accepted",
        header: "Agreement Accepted",
        size: 200,
        Cell: ({ row }) => {
          const status = row.original?.asset
            ? row.original.asset.agreement_accepted
              ? "Accepted"
              : "Waiting for Acceptance"
            : row.original.transaction_status == "Waiting for Acceptance"
              ? "Waiting for Acceptance"
              : "";
          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor: TxtStatusColor[status as string],
                ...tagStyle,
              })}
            >
              {status}
            </Box>
          );
        },
      },
      {
        accessorKey: "bill_customer.name",
        header: "Bill Customer",
        size: 100,
      },
      {
        accessorKey: "ship_customer.name",
        header: "Ship Customer",
        size: 100,
      },
      {
        accessorKey: "reseller.name",
        header: "Reseller",
        size: 100,
      },
    ],
    []
  );

  return (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <GenericTable
          title={
            <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
              <FontAwesomeIcon icon={faRightLeft} />
              Transactions History
            </div>
          }
          data={data?.data}
          columns={columns}
          onRowClick={handleRowClick}
          handleCreate={handleCreate}
          // canCreate={permissionsData?.create}
          totalCount={data?.total}
          handlePage={handlePage}
          handleSorting={handleSorting}
          handleSearch={handleSearch}
          canDelete={false}
          canEdit={permissionsData?.update}
          // initialSorter={initialSorter}
        />
      )}
    </div>
  );
};

export default Page;
