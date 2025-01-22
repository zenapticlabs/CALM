"use client";

import { Box } from "@mui/material";

import {
  HttpError,
  useList,
  useNavigation,
} from "@refinedev/core";
import { Organization } from "@/types/types";
import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { ProductActiveColor } from "@data/ColorData";
import Loader from "@components/common/Loader";
import { tagStyle } from "@data/MuiStyles";
import GenericTable from "@components/Table/GenericTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const {
    data: orgs,
    isLoading,
    refetch,
  } = useList<Organization, HttpError>({
    resource: "orgs",
    hasPagination: false,
  });

  const orgsData = orgs?.data.sort(
    (a, b) =>
      new Date(b.created_at as string).getTime() -
      new Date(a.created_at as string).getTime()
  );

  const { push } = useNavigation();

  const handleEditClick = (row: Organization) => {
    push(`/dashboard/orgs/edit?organization_code=${row.organization_code}`);
  };
  const handleCreate = () => {
    push("/dashboard/orgs/create");
  };
  const columns = useMemo<MRT_ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: "organization_code",
        header: "Organization Code",
        size: 200,
      },
      {
        accessorKey: "organization_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 150,
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 150,
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <Box
            component="span"
            sx={{
              backgroundColor: ProductActiveColor(renderedCellValue as boolean),
              ...tagStyle,
            }}
          >
            {renderedCellValue ? "Active" : "Closed"}
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto min-h-screen flex flex-col">
      <div className="flex-1">
        {isLoading ? (
          <Loader />
        ) : (
          <GenericTable
            title={
              <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                <FontAwesomeIcon icon={faUserGroup} />
                Organizations
                <div className="text-sm font-normal">
                  ( The organizations that are associated with your account )
                </div>
              </div>
            }
            data={orgsData}
            columns={columns}
            canCreate={true}
            handleCreate={handleCreate}
            onRowClick={handleEditClick}
            noSearchNeed={true}
            noSortNeed={true}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
