"use client";
import React, { useMemo } from "react";
import { useTable, useNavigation } from "@refinedev/core";
import { Email_Schedule } from "@/types/types";
import GenericTable from "@components/Table/GenericTable";
import { MRT_ColumnDef } from "material-react-table";
import Loader from "@components/common/Loader";
import { Box } from "@mui/material";
import { ScheduleActiveColor } from "@data/ColorData";
import { tagStyle } from "@data/MuiStyles";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import StateComponent from "@components/common/StateComponent";

const Page = () => {
  const {
    tableQueryResult: { data, isLoading, refetch },
  } = useTable<Email_Schedule>({
    hasPagination: false,
    syncWithLocation: false,
    initialSorter: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  const { push } = useNavigation();

  const handleCreate = () => {
    push(`/dashboard/notification-schedules/create`);
  };

  const handleRowClick = (row: Email_Schedule) => {
    push(`/dashboard/notification-schedules/edit?id=${row.id}`);
  };

  const formatDateTimeWithCustomFormat = (
    date: Date,
    timeZone: string
  ): string => {
    return moment(date).tz(timeZone).format("MM-DD-YYYY HH:mm:ss z");
  };

  const formatTime = (_date: any) => {
    if (_date == null) return "";
    const userTimezone = moment.tz.guess();
    return formatDateTimeWithCustomFormat(_date, userTimezone);
  };

  const columns = useMemo<MRT_ColumnDef<Email_Schedule>[]>(
    () => [
      {
        accessorKey: "scheduled_time",
        header: "Scheduled Time",
        size: 300,
        Cell: ({ renderedCellValue }) => <>{formatTime(renderedCellValue)}</>,
      },
      {
        accessorKey: "is_recurring",
        header: "Recurring",
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel />
        ),
      },
      {
        accessorKey: "recurring_task",
        header: "Recurring Interval",
        size: 180,
      },
      {
        accessorKey: "email_template",
        header: "Email Template",
        size: 300,
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <Box
            component="span"
            sx={{
              backgroundColor: ScheduleActiveColor(
                renderedCellValue as boolean
              ),
              ...tagStyle,
            }}
          >
            {renderedCellValue ? "Active" : "Stopped"}
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <GenericTable
          title={
            <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardList} />
              Notification Schedules
            </div>
          }
          data={data?.data}
          columns={columns as any}
          canCreate={true}
          totalCount={data?.count}
          onRowClick={handleRowClick}
          handleCreate={handleCreate}
          noSearchNeed
          noSortNeed
        />
      )}
    </div>
  );
};

export default Page;
