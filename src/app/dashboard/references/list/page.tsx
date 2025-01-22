"use client";
import React, { useMemo } from "react";
import { useNavigation, useTable } from "@refinedev/core";
import { Reference } from "@/types/types";
import GenericTable from "@components/Table/GenericTable";
import { MRT_ColumnDef } from "material-react-table";
import Loader from "@components/common/Loader";
import StateComponent from "@components/common/StateComponent";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import { getFormattedDate } from "@utils/utilFunctions";

const Page = () => {
  const {
    tableQueryResult: { data, isLoading, refetch },
  } = useTable<Reference>({
    hasPagination: false,
    syncWithLocation: false,
    initialSorter: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  const refData = data?.data.map(d => ({
    ...d,
    start_date: getFormattedDate(d?.start_date),
    end_date: getFormattedDate(d?.end_date),
  }))
  const { push } = useNavigation();

  const handleCreate = () => {
    // setOpenDrawer(true);
    push("/dashboard/references/create");
  };

  const handleRowClick = (row: Reference) => {
    push(`/dashboard/references/show?id=${row.reference_id}`);
  };
  const columns = useMemo<MRT_ColumnDef<Reference>[]>(
    () => [
      {
        accessorKey: "reference_name",
        header: "Program Name",
        size: 200,
      },
      {
        accessorKey: "reference_type",
        header: "Program Type",
        size: 200,
      },
      {
        accessorKey: "data_source",
        header: "Data Source",
        size: 250,
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        size: 200,
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        size: 200,
      },
      {
        accessorKey: "active",
        header: "Active",
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel/>
        ),
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
              <FindInPageRoundedIcon />
              References
            </div>
          }
          data={refData}
          columns={columns}
          canCreate={true}
          onRowClick={handleRowClick}
          handleCreate={handleCreate}
          noSearchNeed={true}
          noSortNeed={true}
        />
      )}
    </div>
  );
};

export default Page;
