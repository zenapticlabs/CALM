// PermissionsTable.tsx
import React from "react";
import { Checkbox } from "@mui/material";
import { Permission } from "@/types/types";

interface PermissionsTableProps {
  permissions: Permission[];
  handleCheckboxChange?: (
    codename: string,
    field: keyof Permission,
    checked: boolean
  ) => void;
  readonly?: boolean;
}

const checkboxGroupInfo = [
  { title: "Users", key: "user" },
  { title: "Role", key: "role" },
  { title: "Licenses", key: "asset" },
  { title: "Transactions", key: "transaction" },
  { title: "Products", key: "product" },
];

const MyCheckbox = ({
  checked,
  onChange,
  readonly,
}: {
  checked: boolean;
  onChange: any;
  readonly?: boolean;
}) => {
  return (
    <div className="text-center flex-1">
      <Checkbox
        checked={checked}
        onChange={onChange}
        disabled={readonly}
        sx={{
          color: "#003133",
          "&.Mui-checked": {
            color: "#003133",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 20,
          },
        }}
      />
    </div>
  );
};

const PermissionsTable: React.FC<PermissionsTableProps> = ({
  permissions,
  handleCheckboxChange,
  readonly,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1 flex text-base font-medium text-[#65758c] px-8">
        <div className="w-20"></div>
        <div className="flex-1 text-center">Create</div>
        <div className="flex-1 text-center">Read</div>
        <div className="flex-1 text-center">Update</div>
        <div className="flex-1 text-center">Delete</div>
      </div>
      {checkboxGroupInfo.map(({ title, key }) => {
        const permission = (permissions ?? []).find((p) => p.codename === key);
        return (
          <div className="flex-1 flex items-center px-8" key={key}>
            <div className="w-20 text-[#65758c] font-medium">{title}</div>
            <MyCheckbox
              checked={!!permission?.create}
              onChange={(e: any) =>
                handleCheckboxChange?.(key, "create", e.target.checked)
              }
              readonly={readonly}
            />
            <MyCheckbox
              checked={!!permission?.read}
              onChange={(e: any) =>
                handleCheckboxChange?.(key, "read", e.target.checked)
              }
              readonly={readonly}
            />
            <MyCheckbox
              checked={!!permission?.update}
              onChange={(e: any) =>
                handleCheckboxChange?.(key, "update", e.target.checked)
              }
              readonly={readonly}
            />
            <MyCheckbox
              checked={!!permission?.delete}
              onChange={(e: any) =>
                handleCheckboxChange?.(key, "delete", e.target.checked)
              }
              readonly={readonly}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsTable;
