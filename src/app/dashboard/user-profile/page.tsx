"use client";
import { Permission, User } from "@/types/types";
import ProfileForm from "@components/Forms/Profile/ProfileForm";
import PermissionsTable from "@components/Role/PermissionsTable";
import { useGetIdentity } from "@refinedev/core";
import { useState } from "react";

const Page = () => {
  const { data: identity, refetch: refetchUser } = useGetIdentity<User>();
  const [page, setPage] = useState(0);

  const panels = [
    {
      label: "User account",
      value: (
        <>
          <div className="text-xl font-semibold pb-4">User Information</div>
          <ProfileForm identity={identity} refetchUser={refetchUser} />
        </>
      ),
    },
    {
      label: "Roles & Permissions",
      value: (
        <>
          <div className="text-xl font-semibold pb-8">
            Role
            <span
              className={`bg-[#1f325c] text-white mx-4 px-4 py-1 text-xs font-bold rounded-full`}
            >
              {identity?.roles?.[0].name}
            </span>
          </div>
          <PermissionsTable
            permissions={identity?.roles?.[0].permissions as Permission[]}
            readonly
          />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 items-center px-12 py-8">
        <div className="text-white bg-[#1f325c] font-bold text-4xl w-20 h-20 flex items-center justify-center rounded-full">{`${identity?.first_name?.[0]} ${identity?.last_name?.[0]}`}</div>
        <div className="">
          <div className="text-2xl font-semibold">
            {`${identity?.first_name} ${identity?.last_name}`}
            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs ${identity?.is_active ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {identity?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="">{`Organization: ${identity?.organization}`}</div>
        </div>
      </div>

      <div className="flex flex-1 gap-8 px-8">
        <div className="min-w-60">
          <div className="bg-white rounded-md px-3 gap-3 flex flex-col py-3 shadow-card">
            {panels.map((panel, i) => (
              <div
                key={i}
                onClick={() => setPage(i)}
                className={`px-2 py-2 cursor-pointer transition duration-500 ${
                  page === i ? "font-bold bg-slate-100" : "hover:bg-slate-100"
                }`}
              >
                {panel.label}
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-4 flex-1 bg-white rounded-md shadow-card">
          {panels[page].value}
        </div>
      </div>
    </div>
  );
};

export default Page;
