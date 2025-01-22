"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AdminMenu, CommonMenu } from "@/data/MenuGroupData";
import UserItem from "./UserItem";
import { useGetIdentity } from "@refinedev/core";
import { User } from "@/types/types";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { data: identity, isLoading } = useGetIdentity<User>();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  const menus = identity?.is_superuser ? AdminMenu : CommonMenu;
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`bg-[#1f325c] fixed left-0 top-0 z-999 flex h-screen w-64 flex-col overflow-y-hidden duration-300 ease-linear lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex flex-col gap-2 pt-5.5">
          <Link
            href="/"
            className="text-[#ffffff] font-bold flex justify-start items-center pl-6 py-2"
          >
            <div className="font-bold text-4xl ">CALM
            </div>
          </Link>
          <div className="font-medium pl-6 text-sm text-[#c8d8ff]">
            <span className="text-white font-bold text-base leading-5">C</span>ustomer
            <span className="text-white font-bold text-base leading-5"> A</span>ccount
          </div>
          <div className="font-medium pl-6 text-sm text-[#c8d8ff]">
            <span className="text-white font-bold text-base leading-5">L</span>icense{" "}
            <span className="text-white font-bold text-base leading-5">M</span>anagement
          </div>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex-1 flex flex-col overflow-y-auto duration-300 ease-linear font-base">
          {/* <!-- Sidebar Menu --> */}
          <nav className="py-4 lg:px-2">
            {menus.map((group: any, groupIndex: any) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3> */}

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem: any, menuIndex: any) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
        <UserItem />
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
