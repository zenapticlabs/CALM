"use client";
import React, { useEffect } from "react";
import ChartOne from "./ChartOne";
import dynamic from "next/dynamic";
const ChartThree = dynamic(() => import("./ChartThree"), {
  ssr: false,
});
// import "./style.css"
import "./style.scss";
// import { ShadowDom } from "react-shadow";

import { DateRangePicker } from "rsuite";
import { subDays } from "date-fns";
import { predefinedRanges } from "@data/UtilData";
import {
  FaCalendar,
} from "react-icons/fa";
import { useList } from "@refinedev/core";
import { CircularProgress } from "@mui/material";

const AssetDashboard: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    subDays(new Date(), 30), // Date 30 days ago
    new Date(), // Current date
  ]);
  const handleDateRangeChange = (value: any) => {
    setDateRange(value);
  };
  const [categories, setCategories] = React.useState<string>("week");
  const categoryOptions = [
    {
      label: "Day",
      value: "day",
    },
    {
      label: "Week",
      value: "week",
    },
    {
      label: "Month",
      value: "month",
    },
  ];

  const { data, isLoading, refetch } = useList<any>({
    resource: `assets/metrics/timegraph?start_date=${dateRange[0].toISOString().split("T")[0]}&end_date=${dateRange[1].toISOString().split("T")[0]}&category=${categories}`,
    hasPagination: false,
  });

  useEffect(() => {
    refetch();
  }, [dateRange, categories]);

  const handleKeyDown = (e: any) => {
    e.preventDefault(); // Prevent keyboard input
  };
  return (
    <div className="mt-4 md:mt-6 2xl:mt-7.5 px-8 py-8 border border-stroke mx-12 shadow-default bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex items-start justify-center gap-10">
          <div className="text-2xl font-semibold text-[#1f325c] ">License</div>
        </div>
        <div className="flex w-full justify-end gap-6">
          <div className="relative inline-block my-date-picker-container">
            {/* <ShadowDom> */}
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              ranges={predefinedRanges}
              placeholder="Select the Date Range"
              style={{ width: 220 }}
              placement="bottomEnd"
              editable={false}
              onKeyDown={handleKeyDown} // Add this line to disable keyboard input
            />
            {dateRange && (
              <FaCalendar
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#999",
                }}
              />
            )}
            {/* </ShadowDom> */}
          </div>
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {categoryOptions.map((item, index) => (
              <button
                key={index}
                className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${
                  categories == item.value
                    ? "bg-white shadow-card dark:bg-meta-4"
                    : ""
                }`}
                onClick={() => {
                  setCategories(item.value);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            <ChartOne
              dateRange={dateRange}
              categories={categories}
              data={data}
              isLoading={isLoading}
            />
            <ChartThree
              dateRange={dateRange}
              categories={categories}
              setDateRange={setDateRange}
              setCategories={setCategories}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDashboard;
