"use client";
import { ApexOptions } from "apexcharts";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getDayStrings,
  getMonthStrings,
  getWeekStrings,
} from "@utils/utilFunctions";
import { CircularProgress } from "@mui/material";
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
  colors: ["#3c50e0", "#dc3545", "#fac107", "#6c757d"],
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
    strokeColors: ["#3c50e0", "#dc3545", "#fac107", "#6c757d"],
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

interface ChatOneProps {
  categories: string;
  dateRange: [Date, Date];
  data: any;
  isLoading: boolean;
}

const ChartOne: React.FC<ChatOneProps> = ({
  categories,
  dateRange,
  data,
  isLoading,
}) => {
  const [series, setSeries] = useState<any[]>([]);
  const [maxNumber, setMaxNumber] = React.useState<number>(200);
  const [yAxis, setYAxis] = useState<string[]>();

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

  useEffect(() => {
    if (data) {
      const states = ["Completed", "Error", "Waiting for Acceptance"];
      let dateArray = states.map((state) => ({
        name: state,
        data: Array(yAxis?.length).fill(0),
      }));
      const realData = data.data;

      dateArray = states.map((state) => ({
        name: state,
        data:
          realData.find(
            (item: any) =>
              item.status === state ||
              (item.status === null && state === "N/A")
          )?.data || Array(yAxis?.length).fill(0),
      }));
      setSeries(dateArray);
      setMaxNumber(
        Math.ceil(
          Math.max(...dateArray.map((item: any) => item.data).flat()) / 10
        ) * 10
      );
    }
  }, [data, isLoading]);

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
    <div className="col-span-12 rounded-sm bg-white px-5 pb-5 pt-7.5 sm:px-7.5 xl:col-span-8">
      <div id="chartOne" className="-ml-5">
        {isLoading ? (
          <CircularProgress />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ChartOne;
