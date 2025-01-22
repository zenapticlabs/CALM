"use client";

import { Reference, ReferenceCode } from "@/types/types";
import Loader from "@components/common/Loader";
import GenericTable from "@components/Table/GenericTable";
import { editRefineBtnStyle } from "@data/MuiStyles";
import { useNavigation, useParsed, useShow, useTable } from "@refinedev/core";
import { EditButton, Show } from "@refinedev/mui";
import {
  convertSortingStateToCrudSort,
  getFormattedDate,
  getNestedValue,
} from "@utils/utilFunctions";
import { MRT_ColumnDef, MRT_SortingState } from "material-react-table";
import { useMemo, useState } from "react";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import { DefaultPageSize } from "@data/UtilData";
import StateComponent from "@components/common/StateComponent";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
} from "@components/Tab/CustomizedTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCubes } from "@fortawesome/free-solid-svg-icons";
import GeneralInformation from "@components/common/View/GeneralInformation";

const Page = () => {
  const { params } = useParsed();

  const { queryResult } = useShow<Reference>({
    resource: "references",
    id: params?.id,
  });
  const { data, isLoading } = queryResult;

  const {
    tableQueryResult: { data: codeData, isLoading: codeIsLoading, refetch },
    setCurrent,
    setFilters,
    setSorters,
  } = useTable<ReferenceCode>({
    resource: `references/${params?.id}/codes`,
    pagination: {
      pageSize: DefaultPageSize,
    },
    syncWithLocation: false,
    initialSorter: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });
  const reference: Reference = data?.data as Reference;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCreate = () => {
    push(
      `/dashboard/references/codes/create?id=${params?.id}&reference_name=${reference?.reference_name}`
    );
  };

  const handleEditClick = (row: ReferenceCode) => {
    if (row?.status == "Used") return;
    push(
      `/dashboard/references/codes/edit?reference_id=${params?.id}&code_id=${row.reference_code_id}`
    );
  };

  const handleSearch = (value: string) =>
    setFilters([{ field: "searchKey", operator: "contains", value: value }]);

  const handleSorting = (sorting: MRT_SortingState) =>
    setSorters(convertSortingStateToCrudSort(sorting));

  const handlePage = (value: number) => setCurrent(value);

  const { push } = useNavigation();

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton
          {...editButtonProps}
          onClick={() => push(`/dashboard/references/edit?id=${params?.id}`)}
          sx={editRefineBtnStyle}
        />
        {/* <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} /> */}
      </div>
    );
  };

  const columns = useMemo<MRT_ColumnDef<ReferenceCode>[]>(
    () => [
      {
        accessorKey: "reference_code",
        header: "Reference Code",
      },
      {
        accessorKey: "osc_product.product_part_number",
        header: "Show Product Name",
      },
      {
        accessorKey: "osc_product.vendor_part_number",
        header: "Vender Part",
      },
      {
        accessorKey: "osc_product.vendor_name",
        header: "Vender Name",
      },
      {
        accessorKey: "product_part_number",
        header: "Product Part",
      },
      {
        accessorKey: "transaction.id",
        header: "Transaction #",
      },
      {
        accessorKey: "transaction.transaction_date",
        header: "Transaction Date",
        Cell: ({ renderedCellValue }) => {
          return <div>{getFormattedDate(renderedCellValue)}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ renderedCellValue }) => {
          return (
            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs ${renderedCellValue != "Used" ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {renderedCellValue == "Used" ? "Used" : "Active"}
            </span>
          );
        },
      },
      {
        accessorKey: "active",
        header: "Enabled Flag",
        Cell: ({ renderedCellValue }) => {
          return (
            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs ${renderedCellValue ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {renderedCellValue ? "Yes" : "No"}
            </span>
          );
        },
      },
    ],
    []
  );

  const summaryfields = [
    {
      title: "Program Name",
      key: "reference_name",
    },
    {
      title: "Reference Type",
      key: "reference_type",
    },
    {
      title: "Active",
      key: "active",
      value: (
        <div className="flex items-center justify-center">
          <StateComponent active={reference?.active as boolean} withLabel />
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading || codeIsLoading ? (
        <Loader />
      ) : (
        <Show
          goBack={null}
          isLoading={isLoading || codeIsLoading}
          breadcrumb={false}
          wrapperProps={{
            className: "rounded-none bg-[#f2f6fa] shadow-none p-0",
          }}
          contentProps={{
            className: "p-0",
          }}
          title={
            <div className="px-8 pt-6 !font-satoshi text-2xl font-semibold text-[#1f325c] gap-2">
              <div className="flex gap-2 items-end gap-6">
                <div className="flex items-center gap-2">
                  <FindInPageRoundedIcon />
                  Reference{" "}
                </div>
              </div>
            </div>
          }
          headerButtons={({ editButtonProps, refreshButtonProps }) =>
            getButtonProps(editButtonProps, refreshButtonProps)
          }
        >
          <div>
            <div className="flex items-start gap-x-8 gap-y-6 px-12 mt-4">
              {summaryfields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1 text-lg">
                  <div className="text-[#515f72] font-semibold">
                    {field.title}
                  </div>
                  <div className="text-[#687991]">
                    {field.value || getNestedValue(reference, field.key)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-12 pt-4">
              <StyledTabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <StyledTab
                  label={
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCircleInfo} />
                      Program Detail
                    </div>
                  }
                />
                <StyledTab
                  label={
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCubes} />
                      Reference Codes
                    </div>
                  }
                />
              </StyledTabs>
            </div>
            <CustomTabPanel value={value} index={0}>
              <GeneralInformation
                singleColumn={true}
                items={[
                  {
                    label: "Program Name",
                    value: reference?.reference_name,
                  },
                  {
                    label: "Program Description",
                    value: reference?.reference_description,
                  },
                  {
                    label: "Reference Type",
                    value: reference?.reference_type,
                  },
                  {
                    label: "Active",
                    value: (
                      <StateComponent
                        active={reference.active as boolean}
                        withLabel
                      />
                    ),
                  },
                  {
                    label: "Data Source",
                    value: reference?.data_source,
                  },
                  {
                    label: "Transaction Source",
                    value: reference?.transaction_source,
                  },
                  {
                    label: "Start Date",
                    value: getFormattedDate(reference?.start_date),
                  },
                  {
                    label: "End Date",
                    value: getFormattedDate(reference?.end_date),
                  },
                ]}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <GenericTable
                title={
                  <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                    Reference Codes
                  </div>
                }
                columns={columns}
                handleCreate={handleCreate}
                data={codeData?.data}
                totalCount={codeData?.total}
                onRowClick={handleEditClick}
                handlePage={handlePage}
                handleSorting={handleSorting}
                handleSearch={handleSearch}
                canCreate={true}
              />
            </CustomTabPanel>
          </div>
        </Show>
      )}
    </>
  );
};

export default Page;
