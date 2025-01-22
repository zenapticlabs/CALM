"use client";
import { ApexOptions } from "apexcharts";

import "./styles.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@data/UtilData";
import { subDays } from "date-fns";
import { useList } from "@refinedev/core";
import {
  getDayStrings,
  getMonthStrings,
  getWeekStrings,
} from "@utils/utilFunctions";
// import DateRangePicker from "./DateRangePicker";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#28a745", "#6c757d", "#dc3545"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#28a745", "#6c757d", "#dc3545"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = React.useState<string>("week");
  const [maxNumber, setMaxNumber] = React.useState<number>(200);
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    subDays(new Date(), 30), // Date 30 days ago
    new Date(), // Current date
  ]);
  const [yAxis, setYAxis] = useState<string[]>();
  const handleDateRangeChange = (value: any) => {
    setDateRange(value);
  };

  useEffect(() => {
    switch (categories) {
      case "week":
        setYAxis(getWeekStrings(dateRange[0], dateRange[1]));
        break;
      case "month":
        setYAxis(getMonthStrings(dateRange[0], dateRange[1]));
        break;
      case "day":
        setYAxis(getDayStrings(dateRange[0], dateRange[1]));
        break;
    }
  }, [dateRange, categories]);

  const { data, isLoading, refetch } = useList<any>({
    resource: `assets/metrics/timegraph?start_date=${dateRange[0].toISOString().split("T")[0]}&end_date=${dateRange[1].toISOString().split("T")[0]}&category=${categories}`,
    hasPagination: false,
  });

  useEffect(() => {
    if (data) {
      const dateArray = data.data
        .filter(
          (item: any) =>
            item.status == "Active" ||
            item.status == "Expired" ||
            item.status == "Revoked"
        )
        .map((item: any) => ({ name: item.status, data: item.data }));
      setSeries(dateArray);
      setMaxNumber(
        Math.ceil(
          Math.max(...dateArray.map((item: any) => item.data).flat()) / 100
        ) * 100
      );
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [dateRange, categories]);

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
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap pb-6">
        <div className="text-2xl font-semibold text-[#1f325c]">License</div>
        <div className="">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            ranges={predefinedRanges}
            placeholder="Select the Date Range"
            style={{ width: 300 }}
          />
        </div>
        <div className="flex w-full max-w-45 justify-end">
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
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: {
                type: "category",
                categories: yAxis,
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                title: {
                  style: {
                    fontSize: "0px",
                  },
                },
                min: 0,
                max: maxNumber,
              },
            }}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
