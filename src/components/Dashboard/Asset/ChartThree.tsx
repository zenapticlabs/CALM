import { CircularProgress } from "@mui/material";
import { useList } from "@refinedev/core";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartThreeState {
  series: number[];
}
interface ChatOneProps {
  categories: string;
  dateRange: [Date, Date];
  setCategories: React.Dispatch<React.SetStateAction<string>>;
  setDateRange: React.Dispatch<React.SetStateAction<[Date, Date]>>;
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3c50e0", "#6c757d", "#f9597c"],
  labels: ["Active", "Expired", "Revoked"],
  legend: {
    show: true,
    position: "bottom",
    formatter: function (seriesName, opts) {
      const total = opts.w.globals.series.reduce((a: any, b: any) => a + b, 0);
      const value = opts.w.globals.series[opts.seriesIndex];
      const percentage = ((value / total) * 100).toFixed(0); // Calculate the percentage
      return `${seriesName}: ${percentage}%`; // Return the label with the percentage
    },
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

const ChartThree: React.FC<ChatOneProps> = ({
  categories,
  dateRange,
  setCategories,
  setDateRange,
}) => {
  const [series, setSeries] = useState<number[]>([]);

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
      setSeries([
        tempData?.data[0].count,
        tempData?.data[1].count,
        tempData?.data[3].count,
      ]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [dateRange]);

  return (
    <div className="flex flex-col col-span-12 rounded-sm bg-white px-5 pb-5 pt-7.5 sm:px-7.5 xl:col-span-4">
      <div className="mb-2 flex-1 flex items-center justify-center">
        <div id="chartThree" className="mx-auto flex justify-center mt-8">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
