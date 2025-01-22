"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { IconButton } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  useIsAuthenticated,
} from "@refinedev/core";
import { redirect, usePathname } from "next/navigation";
import Loader from "@components/common/Loader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const pathname = usePathname();
  const pageTitle = pathname.split("/")[2];

  const { data, isSuccess, isLoading, isError, refetch } = useIsAuthenticated();
  useEffect(() => {
    if (pageTitle) {
      refetch();
    }
  }, [pageTitle]);

  useEffect(() => {
    if (data) {
      if (!data.authenticated) {
        redirect("/auth/signin");
      }
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div
            className={`flex flex-1 flex-col lg:ml-64 overflow-y-auto overflow-x-hidden bg-[#f2f6fa]`}
          >
            <main>
              <div className="absolute top-0.5 left-0.5">
                <IconButton
                  sx={{ color: "#1f325c" }}
                  onClick={handleOpenSidebar}
                >
                  <DoubleArrowIcon />
                </IconButton>
              </div>
              <div className="mx-auto pt-4 pb-4">{children}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
