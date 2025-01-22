"use client";
import React, { useMemo, useState } from "react";
import {
  HttpError,
  useList,
  useNavigation,
  usePermissions,
  useTable,
} from "@refinedev/core";
import { Organization, Permission, Role, User } from "@/types/types";
import { MRT_ColumnDef, MRT_SortingState } from "material-react-table";
import Loader from "@components/common/Loader";
// import InviteUserDrawer from "@components/Users/InviteUserDrawer";
import GenericTable from "@components/Table/GenericTable";
import { convertSortingStateToCrudSort } from "@utils/utilFunctions";
import MemeberInvitePanel from "@components/Organizations/MemeberInvitePanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import StateComponent from "@components/common/StateComponent";

const Page = () => {
  const {
    tableQueryResult: { data, isLoading, refetch },
    setCurrent,
    setFilters,
    setSorters,
  } = useTable<User>({});
  const { push } = useNavigation();
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useList<Role, HttpError>({
    resource: "roles",
    hasPagination: false,
  });

  const {
    data: orgs,
    isLoading: isOrgLoading,
    refetch: refetchOrgs,
  } = useList<Organization, HttpError>({
    resource: "orgs",
    hasPagination: false,
  });

  const { data: permissionsData } = usePermissions<Permission>({
    params: { codename: "user" },
  });

  const userRoles = rolesData?.data || [];

  const [selectedUser, setSelectedUser] = React.useState<any>();

  const [openUserDrawer, setOpenUserDrawer] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateUserDrawer, setOpenCreateUserDrawer] = React.useState(false);

  const handleOpenUserDrawer = () => setOpenUserDrawer(true);
  const handleOpenCreateUserDrawer = () => setOpenCreateUserDrawer(true);
  const handleCloseCreateUserDrawer = () => setOpenCreateUserDrawer(false);
  const handleCloseUserDrawer = () => {
    refetch();
    setOpenUserDrawer(false);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleModifyUser = (row: User) => {
    setSelectedUser(row);
    row.is_active ? handleOpenUserDrawer() : handleOpenCreateUserDrawer();
  };
  const handleShowUser = (row: User) => {
    push(`/dashboard/users/show?id=${row.user_id}`);
  };
  const handleCreateUser = () => {};

  const handleDeleteUser = (row: User) => {
    handleOpenDeleteModal();
    setSelectedUser(row);
  };

  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleSorting = (sorting: MRT_SortingState) =>
    setSorters(convertSortingStateToCrudSort(sorting));

  const handlePage = (value: number) => setCurrent(value);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => setOpenSuccessModal(false);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "first_name",
        header: "Name",
        size: 150,
        Cell: ({ row }) => (
          <div className="">
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 180,
      },
      {
        accessorKey: "organizations",
        header: "Organizations",
        size: 150,
        Cell: ({ renderedCellValue }) =>
          (renderedCellValue as Organization[]).toString(),
      },
      {
        accessorKey: "roles",
        header: "User Role",
        size: 150,
        Cell: ({ renderedCellValue }) => {
          return (
            <div className="flex items-center justify-center">
              {(renderedCellValue as Role[])
                ?.map(
                  (role) =>
                    // <div
                    //   key={role.name}
                    //   className={`${RoleColors[role.name as string] || RoleColors["default"]} text-white  text-xs rounded-full px-2 py-1`}
                    // >
                    //   {role.name}
                    // </div>
                    role.name
                )
                .join(",")}
            </div>
          );
        },
      },
      {
        accessorKey: "is_active",
        header: "Active",
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel />
        ),
      },
      // {
      //   accessorKey: "action",
      //   header: "Action",
      //   size: 100,
      //   enableSorting: false,
      //   Cell: ({ row }) => (
      //     <div className="flex gap-4">
      //       {permissionsData?.update && <EditOutlinedIcon
      //         onClick={() => handleModifyUser(row.original)}
      //         fontSize="small"
      //         className="text-[#818f99] hover:text-black cursor-pointer"
      //       />}
      //       {permissionsData?.delete && <DeleteIcon
      //         onClick={() => handleDeleteUser(row.original)}
      //         fontSize="small"
      //         className="text-[#818f99] hover:text-black cursor-pointer"
      //       />}
      //     </div>
      //   ),
      // },
    ],
    []
  );

  return (
    // permissionsData?.read ? (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto">
      {isLoading || isRolesLoading ? (
        <Loader />
      ) : (
        <div>
          <GenericTable
            title={
              <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} />
                User Management{" "}
              </div>
            }
            data={data?.data}
            columns={columns}
            totalCount={data?.total}
            onRowClick={handleShowUser}
            handlePage={handlePage}
            handleSorting={handleSorting}
            handleSearch={handleSearch}
            canCreate={true}
            handleCreate={() => setOpenSuccessModal(true)}
          />
        </div>
      )}
      {/* {
        openCreateUserDrawer && (
          <InviteUserDrawer inactiveUser={selectedUser} handleCloseModal={handleCloseCreateUserDrawer} />
        )
      }
      {openUserDrawer && (
        <UserDrawer
          openModal={openUserDrawer}
          handleCloseModal={handleCloseUserDrawer}
          selectedUser={selectedUser}
          userRoles={userRoles}
        />
      )}
      {openDeleteModal && (
        <DeleteUserModal
          openModal={openDeleteModal}
          handleCloseModal={handleCloseDeleteModal}
          selectedUser={selectedUser}
        />
      )} */}
      <MemeberInvitePanel
        orgs={orgs?.data.filter(org => org.active) ?? []}
        openSuccessModal={openSuccessModal}
        handleCloseSuccessModal={handleCloseSuccessModal}
      />
    </div>
    // ) : (
    //   <Unauthorized />
    // )
  );
};

export default Page;
