import React, { useEffect, useState } from "react";
import { Button, Divider, FormControl } from "@mui/material";
import { Role, User, Permission } from "../../types/types";
import GeneralInput from "@components/Input/GeneralInput";
import { modalOkBtnStyle } from "@data/MuiStyles";
import { useList, useUpdate } from "@refinedev/core";
import PermissionsTable from "@components/Role/PermissionsTable";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";

interface UserDrawerProps {
  user: User;
  isShow?: boolean;
}

const UserDetailPanel: React.FC<UserDrawerProps> = ({ user, isShow }) => {
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useList<Role>({
    resource: "roles",
    hasPagination: false,
  });
  const userRoles = rolesData?.data || [];
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { mutate } = useUpdate();

  useEffect(() => {
    setSelectedRoles(user?.roles ?? []);
  }, [user]);

  useEffect(() => {
    updatePermissions();
  }, [selectedRoles]);

  const handleEachRole = (role: Role) => {
    const newRoles = selectedRoles.some(
      (selectedRole) => selectedRole.name === role.name
    )
      ? selectedRoles.filter((selectedRole) => selectedRole.name !== role.name)
      : [...selectedRoles, role];
    setSelectedRoles(newRoles);
  };

  const updatePermissions = () => {
    const aggregatedPermissions: Permission[] = [];

    selectedRoles.forEach((role) => {
      role?.permissions?.forEach((rolePermission) => {
        const existingPermission = aggregatedPermissions.find(
          (perm) => perm.codename === rolePermission.codename
        );

        if (existingPermission) {
          existingPermission.create =
            existingPermission.create || rolePermission.create;
          existingPermission.read =
            existingPermission.read || rolePermission.read;
          existingPermission.update =
            existingPermission.update || rolePermission.update;
          existingPermission.delete =
            existingPermission.delete || rolePermission.delete;
        } else {
          aggregatedPermissions.push({ ...rolePermission });
        }
      });
    });
    setPermissions(aggregatedPermissions);
  };

  const handleSave = () => {
    const payload = {
      role_ids: selectedRoles.map((role) => role.role_id),
    };
    mutate(
      {
        resource: "users",
        id: `${user.user_id}/roles`,
        values: payload,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: () => console.log("success"),
      }
    );
  };

  return (
    <div className="bg-white px-8 py-8 font-med flex flex-col">
      <div className="text-xl font-semibold text-black flex items-center gap-4">
        <Link
          href={
            user && !isShow
              ? "/dashboard/users/show?id=" + user?.user_id
              : "/dashboard/users/list"
          }
          className="pb-1 hover:text-slate-700"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <div>{user ? (isShow ? "" : "Edit") : "Create"} User</div>
          {isShow && (
            <Link
              href={`/dashboard/users/edit?id=${user?.user_id}`}
              className="bg-[#003133] text-white px-8 py-2 rounded-md text-sm font-medium"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Divider
          sx={{
            fontSize: "1rem",
            py: "0.5rem",
            fontWeight: "bold",
            color: "#65758c",
          }}
        >
          General Information
        </Divider>
        {/* <FormControl className="w-full">
          <GeneralInput
            id="user_id"
            name="user_id"
            label="User ID"
            type="text"
            defaultValue={user?.user_id}
            disabled={true}
          />
        </FormControl> */}
        <div className="flex gap-6">
          <FormControl className="w-full">
            <GeneralInput
              id="first_name"
              name="first_name"
              label="First Name"
              type="text"
              defaultValue={user?.first_name}
              disabled={true}
            />
          </FormControl>
          <FormControl className="w-full">
            <GeneralInput
              id="last_name"
              name="last_name"
              label="Last Name"
              type="text"
              defaultValue={user?.last_name}
              disabled={true}
            />
          </FormControl>
        </div>
        <div className="flex gap-6">
          <FormControl className="w-full">
            <GeneralInput
              id="email"
              name="email"
              label="Email"
              type="text"
              defaultValue={user?.email}
              disabled={true}
            />
          </FormControl>
          <FormControl className="w-full">
            <GeneralInput
              id="organization"
              name="organization"
              label="Organization"
              type="text"
              defaultValue={user?.organization}
              disabled={true}
            />
          </FormControl>
        </div>
        <Divider
          sx={{
            fontSize: "1rem",
            py: "0.5rem",
            fontWeight: "bold",
            color: "#65758c",
          }}
        >
          User Role
        </Divider>
        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            {userRoles.map((role) => {
              const isSelected = selectedRoles.some(
                (selectedRole) => selectedRole.name === role.name
              );
              const className = isSelected
                ? `bg-[#1f325c] border border-transparent text-white`
                : "bg-white text-[#818f99] border border-[#818f99]";
              return (
                <button
                  key={role.name}
                  disabled={isShow}
                  onClick={() => handleEachRole(role)}
                  className={`${className} text-sm rounded-full px-4 py-1 cursor-pointer`}
                >
                  {role.name}
                </button>
              );
            })}
          </div>
        </div>
        {/* <Divider sx={{ fontSize: '1rem', py: '0.5rem', fontWeight: 'bold', color: '#65758c' }}></Divider> */}
        <PermissionsTable
          permissions={permissions}
          handleCheckboxChange={() => {}}
          readonly
        />
      </div>
      <div className="flex justify-end gap-4">
        {!isShow && (
          <Button variant="contained" onClick={handleSave} sx={modalOkBtnStyle}>
            {user ? "Save" : "Create"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserDetailPanel;
