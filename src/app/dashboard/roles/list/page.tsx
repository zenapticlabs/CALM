"use client";
import React, { useMemo } from "react";
import { useNavigation, usePermissions, useTable } from "@refinedev/core";
import { Permission, Role } from "@/types/types";
import { MRT_ColumnDef } from "material-react-table";
import Loader from "@components/common/Loader";
import RoleDrawer from "@components/Role/RoleDrawer";
import GenericTable from "@components/Table/GenericTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const {
    tableQueryResult: { data, isLoading, refetch },
  } = useTable<Role>({
    hasPagination: false,
  });
  const { push } = useNavigation();
  const sortedData = data?.data.sort((a, b) => {
    const specialRoles = ["Admin", "SuperUser", "User"];
    if (
      specialRoles.includes(a.name as string) &&
      !specialRoles.includes(b.name as string)
    ) {
      return -1;
    }
    if (
      !specialRoles.includes(a.name as string) &&
      specialRoles.includes(b.name as string)
    ) {
      return 1;
    }
    return 0;
  });
  const { data: permissionsData } = usePermissions<Permission>({
    params: { codename: "role" },
  });

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [clickedRole, setClickedRole] = React.useState<any>();

  const handleClickItem = (role: Role) => {
    push(`/dashboard/roles/show?id=${role.role_id}`);
  };

  const handleCreate = () => {
    push(`/dashboard/roles/create`);
  };

  const handleClose = () => {
    refetch();
    setOpenDrawer(false);
  };

  const columns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 100,
        // Cell: ({ renderedCellValue, row }) => (
        //   <span
        //     className={`${RoleColors[row.original.name as string] || RoleColors["default"]} text-white px-4 py-1 text-xs font-bold rounded-full`}
        //   >
        //     {renderedCellValue}
        //   </span>
        // ),
      },

      {
        accessorKey: "description",
        header: "Description",
        size: 250,
      },
    ],
    [permissionsData]
  );

  return (
    // permissionsData?.read ? (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <GenericTable
            title={
              <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} />
                Role & Permission
              </div>
            }
            data={sortedData}
            columns={columns}
            handleCreate={handleCreate}
            // canCreate={permissionsData?.create}
            canCreate={true}
            onRowClick={handleClickItem}
            noSearchNeed
            noSortNeed
          />
          {openDrawer && (
            <RoleDrawer
              onClose={handleClose}
              role={clickedRole}
              create={!clickedRole}
            />
          )}
        </div>
      )}
    </div>
    // ) : (
    //   <Unauthorized />
    // )
  );
};

export default Page;
