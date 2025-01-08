"use client";

import { Box, IconButton } from "@mui/material";

import {
  HttpError,
  useGetIdentity,
  useList,
  useNavigation,
} from "@refinedev/core";
import { Organization, User } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { ProductActiveColor } from "@data/ColorData";
import Loader from "@components/common/Loader";
import { tagStyle } from "@data/MuiStyles";
import GenericTable from "@components/Table/GenericTable";

const OrganizationComponent = () => {
  const { data: identity, isLoading: isIdentityLoading } =
    useGetIdentity<User>();
  const {
    data: orgs,
    isLoading,
    refetch,
  } = useList<Organization, HttpError>({
    resource: "orgs",
    hasPagination: false,
  });

  useEffect(() => {
    setLoading(isIdentityLoading || isLoading);
  }, [isIdentityLoading, isLoading]);

  const { push } = useNavigation();
  const [orgData, setOrgData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [clickedOrg, setClickedOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (identity && orgs) {
      setOrgData(
        orgs?.data.map((org: Organization) => ({
          ...org,
          isCurrent: org.organization_code === identity.organization,
        }))
      );
    }
  }, [identity, orgs]);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleOpenConfirmModal = () => setOpenConfirmModal(true);
  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const handleEditClick = (row: Organization) => {
    // setClickedOrg(row);
    // setOpenDrawer(true);

    push(`/dashboard/orgs/edit?organization_code=${row.organization_code}`);
  };
  const handleCreate = () => {
    // setOpenDrawer(true)
    push("/dashboard/orgs/create");
  };
  const handleClose = () => {
    refetch();
    setClickedOrg(null);
    setOpenDrawer(false);
  };
  const handleClickSwitch = (row: Organization) => {
    setClickedOrg(row);
    handleOpenConfirmModal();
  };
  const handleSwitch = async () => {
    const realAPI_URL = "https://calmtpy.pfuapps.com/api";
    const API_URL = process.env.API_URL;
    const response = await fetch(`${API_URL ?? realAPI_URL}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tempToken")}`,
      },
      body: JSON.stringify({ organization: clickedOrg?.organization_code }),
    });
    if (response.ok) {
      const data: any = await response.json();
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      window.location.reload();
    }
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <GenericTable
          title={
            <div className="!font-satoshi px-12 text-lg font-semibold text-[#1f325c] flex items-center gap-2">
              Organizations
            </div>
          }
          data={orgData}
          columns={columns}
          canCreate={true}
          handleCreate={handleCreate}
          noSearchNeed={true}
        />
      )}
    </>
  );
};

export default OrganizationComponent;
