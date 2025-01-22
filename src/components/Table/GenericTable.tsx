"use client";
import { Box, Button, InputAdornment, Pagination } from "@mui/material";
import {
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_TableContainer,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
} from "material-react-table";
import React, { useState } from "react";
import SearchInput from "@components/Input/SearchInput";
import { tableAddButton } from "@data/MuiStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@/assets/icons/search.svg?icon";
import { DefaultPageSize } from "@data/UtilData";

interface GenericTableProps<T extends MRT_RowData> {
  title?: React.ReactNode;
  data?: T[];
  totalCount?: number;
  columns: MRT_ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  handleCreate?: () => void;
  handlePage?: (value: number) => void;
  handleSearch?: (value: string) => void;
  handleSorting?: (value: MRT_SortingState) => void;
  canCreate?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  addText?: React.ReactNode;
  noCreateNeed?: boolean;
  noSearchNeed?: boolean;
  noSortNeed?: boolean;
  maxWidth?: string | number;
  minWidth?: string | number;
  initialSorter?: MRT_SortingState;
}

const GenericTable = <T extends MRT_RowData>({
  addText,
  title,
  data,
  columns,
  totalCount,
  noCreateNeed,
  noSortNeed,
  noSearchNeed,
  onRowClick,
  handleCreate,
  handleSearch,
  handlePage,
  handleSorting,
  canCreate,
  maxWidth,
  minWidth,
  initialSorter,
}: GenericTableProps<T>) => {
  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const enhancedColumns = columns.map((col) => {
    if (col.Cell) return col;
    return {
      ...col,
      Cell: ({ cell }: { cell: any }) => {
        const value = cell.getValue();
        return value?.toString();
      },
    };
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (handlePage) {
      handlePage(value);
    }
  };

  const [sorting, setSorting] = useState<MRT_SortingState>(initialSorter || []);

  const handleSortingChange = (newSorting: MRT_SortingState) => {
    setSorting(newSorting);
    handleSorting?.(newSorting);
  };

  // useEffect(() => {
  //   if (handleSorting) {
  //     handleSorting(sorting);
  //   }
  // }, [sorting]);

  const table = useMaterialReactTable({
    columns: enhancedColumns,
    data: data || [],
    enableColumnActions: false,
    enableColumnPinning: true,
    onSortingChange: (updater) => {
      const newSorting =
        updater instanceof Function ? updater(sorting) : updater;
      setSorting(newSorting);
      handleSorting?.(newSorting);
    },
    manualSorting: !noSortNeed,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row.original),
      className: `${!!onRowClick && "cursor-pointer"} bg-transparent`,
    }),
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "transparent",
      },
    },
    muiTableBodyCellProps: ({ cell }) => ({
      sx: {
        padding: cell.column.getIndex() === 0 ? "1rem 1rem 1rem 3rem" : "", // Set padding for the first column
        // textAlign: 'center'
      },
    }),
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        padding: column.getIndex() === 0 ? "1rem 1rem 1rem 3rem" : "",
        verticalAlign: "middle",
      },
    }),
    muiPaginationProps: {
      color: "primary",
      shape: "rounded",
      showRowsPerPage: false,
      // variant: "outlined",
    },
    paginationDisplayMode: "pages",
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
      pagination: {
        pageIndex: 0,
        pageSize: DefaultPageSize,
      },
    },
    state: {
      sorting,
      showGlobalFilter: noSearchNeed,
    },
    muiSearchTextFieldProps: {
      placeholder: "Search",
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
      sx: {
        width: "300px",
        backgroundColor: "#e6eaed",
        borderRadius: 8,
        "& .MuiInputBase-input": {
          fontSize: "0.875rem",
          padding: "10px 2px",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
        },
      },
    },
  });

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="flex justify-between gap-2 items-center">
        <div className="text-xl font-semibold">{title}</div>
        <div className="flex gap-2 pr-8">
          {!noSearchNeed ? (
            <SearchInput handleChange={handleSearch} />
          ) : (
            <div>
              <MRT_GlobalFilterTextField table={table} />
            </div>
          )}
          <div>
            {!noCreateNeed && canCreate && (
              <Button
                onClick={handleCreate}
                variant="contained"
                sx={tableAddButton}
              >
                {" "}
                {addText ?? (
                  <>
                    <AddIcon /> Add
                  </>
                )}
              </Button>
            )}
          </div>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MRT_ShowHideColumnsButton table={table} />
          </Box>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
        className=""
      >
        <div style={{ maxWidth, minWidth, width: "100%" }}>
          <MRT_TableContainer table={table} />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {totalCount ? (
                <div className="p-8">
                  <Pagination
                    onChange={handlePageChange}
                    count={Math.ceil(
                      totalCount / table.getState().pagination.pageSize
                    )}
                    color="primary"
                    shape="rounded"
                  />
                </div>
              ) : (
                <MRT_TablePagination table={table} />
              )}
            </Box>
            <Box sx={{ display: "grid", width: "100%" }}>
              <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default GenericTable;
