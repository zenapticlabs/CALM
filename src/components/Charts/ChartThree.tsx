import { predefinedRanges } from "@data/UtilData";
import { useList } from "@refinedev/core";
import { ApexOptions } from "apexcharts";
import { subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { DateRangePicker } from "rsuite";
interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#28a745", "#6c757d", "#dc3545"],
  labels: ["Active", "Expired", "Revoked"],
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    subDays(new Date(), 30), // Date 30 days ago
    new Date(), // Current date
  ]);
  const handleDateRangeChange = (value: any) => {
    setDateRange(value);
  };

  const { data, isLoading, refetch } = useList({
    resource: `assets/metrics/chart?start_date=${dateRange[0].toISOString().split("T")[0]}&end_date=${dateRange[1].toISOString().split("T")[0]}`,
    hasPagination: false,
  });

  useEffect(() => {
    const tempData = data?.data as any;
    if (tempData?.data) {
      setSeries([tempData?.data[0].count, tempData?.data[1].count, tempData?.data[3].count]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [dateRange]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              ranges={predefinedRanges}
              placeholder="Select the Date Range"
              style={{ width: 300 }}
            />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#3d50e0]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Activated Licenses </span>
              <span> 70% </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#80c9ed]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Expired Licenses </span>
              <span> 30% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
