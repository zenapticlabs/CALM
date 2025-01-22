"use client";

import { useMemo } from "react";
import { MRT_SortingState, type MRT_ColumnDef } from "material-react-table";
import { Asset } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTable } from "@refinedev/core";
import GenericTable from "@components/Table/GenericTable";
import {
  convertSortingStateToCrudSort,
  getFormattedDate,
} from "@utils/utilFunctions";
import { DefaultPageSize } from "@data/UtilData";
import StateComponent from "@components/common/StateComponent";
import Loader from "@components/common/Loader";

interface PartnerLicensesTableProps {
  partner_id?: string;
}

const PartnerLicensesTable: React.FC<PartnerLicensesTableProps> = ({
  partner_id,
}) => {
  const {
    tableQueryResult: { data: assets, isLoading, refetch },
    setCurrent,
    setFilters,
    setSorters,
  } = useTable<Asset>({
    syncWithLocation: false,
    resource: "assets",
    initialFilter: [{ field: "partner", operator: "eq", value: partner_id }],
    pagination: {
      pageSize: DefaultPageSize,
    },
  });

  const router = useRouter();

  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleSorting = (sorting: MRT_SortingState) =>
    setSorters(convertSortingStateToCrudSort(sorting));

  const handlePage = (value: number) => setCurrent(value);

  const columns = useMemo<MRT_ColumnDef<Asset>[]>(
    () => [
      {
        accessorKey: "license_key",
        header: "License Key",
      },
      {
        accessorKey: "osc_seat_count",
        header: "Seat Count",
        Cell: ({ renderedCellValue }) => (
          <div className="text-right w-full pr-12">{renderedCellValue}</div>
        ),
      },
      {
        accessorKey: "osc_product.product_part_number",
        header: "Part Number",
      },
      {
        accessorKey: "osc_product.product_type",
        header: "Product Type",
      },
      {
        accessorKey: "osc_product.duration",
        header: "Duration",
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        Cell: ({ renderedCellValue }) => getFormattedDate(renderedCellValue),
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        Cell: ({ renderedCellValue }) => getFormattedDate(renderedCellValue),
      },
      {
        accessorKey: "active",
        header: "Status",
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel />
        ),
      },
    ],
    []
  );

  const handleRowClick = (row: Asset) => {
    router.push(`/dashboard/assets/show?id=${row.asset_id}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <GenericTable
          title={
            <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
              Licenses
            </div>
          }
          data={assets?.data}
          totalCount={assets?.total}
          columns={columns}
          onRowClick={handleRowClick}
          handlePage={handlePage}
          handleSorting={handleSorting}
          handleSearch={handleSearch}
        />
      )}
    </>
  );
};

export default PartnerLicensesTable;
