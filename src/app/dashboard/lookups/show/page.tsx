"use client";

import { Lookup, LookupValue } from "@/types/types";
import Loader from "@components/common/Loader";
import GenericTable from "@components/Table/GenericTable";
import { editRefineBtnStyle } from "@data/MuiStyles";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  useCreate,
  useList,
  useNavigation,
  useParsed,
  useShow,
  useTable,
} from "@refinedev/core";
import SaveIcon from "@mui/icons-material/Save";
import { EditButton, Show } from "@refinedev/mui";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import CloseIcon from "@mui/icons-material/Close";

const Page = () => {
  const { params } = useParsed();
  const { push } = useNavigation();

  const { queryResult } = useShow<Lookup>({
    resource: "lookups",
    id: params?.id,
  });

  const { data: lookupData, isLoading: isLookupLoading } = queryResult;
  const lookup: Lookup = lookupData?.data as Lookup;

  const {
    tableQueryResult: { data: codeData, isLoading: isCodeLoading, refetch },
  } = useTable<LookupValue>({
    resource: `lookups/${params?.id}/values`,
    hasPagination: false,
  });

  const [codes, setCodes] = useState<LookupValue[]>([]);
  useEffect(() => {
    if (codeData && !isCodeLoading) {
      setCodes(
        codeData.data.map(
          ({
            id,
            value,
            meaning,
            attribute1,
            attribute2,
            attribute3,
            active,
            is_new,
            parent_value,
          }) => ({
            id,
            value,
            meaning,
            attribute1,
            attribute2,
            attribute3,
            active,
            is_new,
            parent_value,
          })
        )
      );
    }
  }, [codeData, isCodeLoading]);

  const [valueError, setValueError] = useState(false);
  const [meaningError, setMeaningError] = useState(false);
  const [selectedValue, setSelectedValue] = useState<LookupValue | null>(null);
  const valueTextFieldRef = useRef<HTMLInputElement | null>(null);
  const meaningTextFieldRef = useRef<HTMLInputElement | null>(null);

  const {
    data: masterData,
    isLoading: masterLoading,
    refetch: masterRefetch,
  } = useList<LookupValue>(
    lookup?.parent_lookup?.lookup_code
      ? {
          resource: `lookups/${lookup.parent_lookup.lookup_code}/values`,
          hasPagination: false,
        }
      : { resource: "", hasPagination: false }
  );

  const [masterOptions, setMasterOptions] = useState<LookupValue[]>([]);
  const [parentValue, setParentValue] = useState("");
  useEffect(() => {
    masterRefetch();
  }, [lookup]);

  useEffect(() => {
    if (lookup?.parent_lookup?.lookup_code) {
      const options = masterData?.data as LookupValue[];
      if (options && Array.isArray(options) && options.length > 0) {
        setMasterOptions(options);
        setParentValue(options[0].id as string);
      }
    }
  }, [masterLoading, masterData]);

  const handleParentValue = (event: SelectChangeEvent) => {
    setParentValue(event.target.value);
  };

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton
          {...editButtonProps}
          onClick={() => push(`/dashboard/lookups/edit?id=${params?.id}`)}
          sx={editRefineBtnStyle}
        />
        {/* <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} /> */}
      </div>
    );
  };

  const handleCancelEdit = () => {
    setCodes(codeData?.data as LookupValue[]);
    setSelectedValue(null);
    setMeaningError(false);
    setValueError(false);
  };

  const handleAdd = () => {
    const newCode: LookupValue = {
      id: "new",
      value: "",
      meaning: "",
      attribute1: "",
      attribute2: "",
      attribute3: "",
      active: true,
      is_new: true,
      parent_value: parentValue,
    };
    setCodes((prevCodes) => [...prevCodes, newCode]);
    setSelectedValue(newCode);
  };
  const { mutate: createLookup } = useCreate();

  const handleEditLookupValue = (value: LookupValue) => {
    setSelectedValue(value);
  };

  const handleSaveValue = () => {
    if (selectedValue) {
      let isValid = true;

      if (!selectedValue.value || selectedValue.value == "NaN") {
        setValueError(true);
        isValid = false;
        setSelectedValue({
          ...selectedValue,
          value: "",
        });
      } else {
        setValueError(false);
        setSelectedValue({
          ...selectedValue,
          value: selectedValue.value,
        });
      }
      if (!selectedValue.meaning) {
        setMeaningError(true);
        isValid = false;
      } else {
        setMeaningError(false);
      }

      if (!isValid) return;
      let updatedCode: LookupValue[] = [];
      if (codeData?.data) {
        updatedCode = [...codes];
      }
      const selectedIndex = updatedCode.findIndex(
        (c) => c.id == selectedValue.id
      );

      updatedCode[selectedIndex] = {
        ...selectedValue,
      };

      updatedCode = [
        ...updatedCode.map((code) => ({
          ...code,
          parent_value: masterOptions.find(
            (option) => option.id == code.parent_value
          )?.value,
        })),
      ];

      createLookup(
        {
          resource: `lookups/${lookup.lookup_code}/values`,
          values: updatedCode,
        },
        {
          onError: (error) => {},
          onSuccess: () => {
            setSelectedValue(null);
            refetch();
          },
        }
      );
    }
  };

  const baseColumns = useMemo<MRT_ColumnDef<LookupValue>[]>(
    () => [
      {
        accessorKey: "value",
        header: "Value",
        size: 200,
      },
      {
        accessorKey: "meaning",
        header: "Meaning",
        size: 200,
      },
      {
        accessorKey: "attribute1",
        header: "Attribute 1",
      },
      {
        accessorKey: "attribute2",
        header: "Attribute 2",
      },
      {
        accessorKey: "attribute3",
        header: "Attribute 3",
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 50,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        pin: "right",
        size: 100,
        enableSorting: false,
        enablePinning: true,
      },
    ],
    []
  );

  const columns = useMemo<MRT_ColumnDef<LookupValue>[]>(
    () =>
      baseColumns.map((column) => {
        if (column.accessorKey == "active") {
          return {
            ...column,
            Cell: ({ renderedCellValue, cell, row, column }) => {
              return (
                <>
                  {row.original.id == selectedValue?.id ? (
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                    >
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        defaultValue={renderedCellValue}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            active: e.target.value == "true",
                          })
                        }
                        label="Age"
                      >
                        <MenuItem value={"true"}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full text-white py-1 text-xs px-3 bg-[#11ba82]`}
                            >
                              Active
                            </div>
                          </div>
                        </MenuItem>
                        <MenuItem value={"false"}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full text-white py-1 text-xs px-3 bg-[#929ea8]`}
                            >
                              Inactive
                            </div>
                          </div>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full text-white py-1 text-xs px-3 ${renderedCellValue ? "bg-[#11ba82]" : "bg-[#929ea8]"}`}
                      >
                        {renderedCellValue ? "Active" : "Inactive"}
                      </div>
                    </div>
                  )}
                </>
              );
            },
          };
        } else if (column.accessorKey == "value") {
          switch (lookup?.type) {
            case "Text":
              return {
                ...column,
                Cell: ({ renderedCellValue, cell, row, column }) =>
                  row.original.id == selectedValue?.id ? (
                    <>
                      <TextField
                        inputRef={valueTextFieldRef}
                        variant="standard"
                        value={selectedValue?.value}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            [column.id as string]: e.target.value,
                          })
                        }
                        error={valueError}
                      />
                      {valueError && (
                        <div className="text-[#db3545] text-xs pt-1">
                          This field is required
                        </div>
                      )}
                    </>
                  ) : (
                    renderedCellValue
                  ),
              };
            case "Number":
              return {
                ...column,
                Cell: ({ renderedCellValue, cell, row, column }) =>
                  row.original.id == selectedValue?.id ? (
                    <>
                      <TextField
                        inputRef={valueTextFieldRef}
                        variant="standard"
                        type="number"
                        value={selectedValue?.value}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            value: e.target.value,
                          })
                        }
                        onBlur={(e) => {
                          let numValue = parseInt(e.target.value);
                          if (numValue < 0) numValue = 0;
                          if (numValue > 99) numValue = 100;
                          setSelectedValue({
                            ...selectedValue,
                            value: `${numValue}`,
                          });
                        }}
                        error={valueError}
                      />
                      {valueError && (
                        <div className="text-[#db3545] text-xs pt-1">
                          This field is required
                        </div>
                      )}
                    </>
                  ) : (
                    renderedCellValue
                  ),
              };
            case "Date":
              return {
                ...column,
                Cell: ({ renderedCellValue, cell, row, column }) =>
                  row.original.id == selectedValue?.id ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        defaultValue={dayjs(renderedCellValue as string)}
                        readOnly
                        onChange={(newValue) =>
                          setSelectedValue({
                            ...selectedValue,
                            value: newValue?.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{
                          textField: {
                            variant: "standard",
                          },
                        }}
                      />
                      {valueError && (
                        <div className="text-[#db3545] text-xs pt-1">
                          This field is required
                        </div>
                      )}
                    </LocalizationProvider>
                  ) : (
                    renderedCellValue
                  ),
              };
            case "Duration":
              return {
                ...column,
                Cell: ({ renderedCellValue, cell, row, column }) =>
                  row.original.id == selectedValue?.id ? (
                    <div className="">
                      <div className="flex gap-2">
                        <TextField
                          variant="standard"
                          type="number"
                          value={
                            selectedValue?.value === "EA"
                              ? 0
                              : parseInt(selectedValue?.value as string, 10)
                          }
                          sx={{ width: "50%" }}
                          onChange={(e) => {
                            const numValue = e.target.value;
                            const unit =
                              selectedValue?.value
                                ?.toString()
                                .match(/[A-Za-z]+/)?.[0] || "D";
                            setSelectedValue({
                              ...selectedValue,
                              value:
                                numValue == "0" ? `EA` : `${numValue}${unit}`,
                            });
                          }}
                          onBlur={(e) => {
                            let numValue = parseInt(e.target.value);
                            if (numValue < 0) numValue = 0;
                            if (numValue > 99) numValue = 100;
                            const unit =
                              selectedValue?.value
                                ?.toString()
                                .match(/[A-Za-z]+/)?.[0] || "D";
                            setSelectedValue({
                              ...selectedValue,
                              value:
                                numValue == 0 ? `EA` : `${numValue}${unit}`,
                            });
                          }}
                        />
                        <FormControl variant="standard" sx={{ width: "50%" }}>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            defaultValue={
                              typeof renderedCellValue === "string"
                                ? renderedCellValue.match(/[A-Za-z]+/)?.[0] ||
                                  ""
                                : ""
                            }
                            onChange={(e) => {
                              const numValue =
                                parseInt(selectedValue?.value as string, 10) ||
                                0;
                              setSelectedValue({
                                ...selectedValue,
                                value: `${numValue}${e.target.value}`,
                              });
                            }}
                          >
                            <MenuItem value={"D"}>Day</MenuItem>
                            <MenuItem value={"MO"}>Month</MenuItem>
                            <MenuItem value={"YR"}>Year</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      {valueError && (
                        <div className="text-[#db3545] text-xs pt-1">
                          This field is required
                        </div>
                      )}
                    </div>
                  ) : (
                    renderedCellValue
                  ),
              };
          }
        } else if (column.accessorKey == "actions") {
          return {
            ...column,
            Cell: ({ row }) => (
              <div className="flex gap-4">
                {row.original.id == selectedValue?.id ? (
                  <div className="flex gap-2">
                    <SaveIcon
                      onClick={() => handleSaveValue()}
                      fontSize="small"
                      className="text-[#818f99] hover:text-black cursor-pointer"
                    />
                    <CloseIcon
                      onClick={() => handleCancelEdit()}
                      fontSize="small"
                      className="text-[#818f99] hover:text-black cursor-pointer"
                    />
                  </div>
                ) : (
                  selectedValue == null && (
                    <EditOutlinedIcon
                      onClick={() => handleEditLookupValue(row.original)}
                      fontSize="small"
                      className="text-[#818f99] hover:text-black cursor-pointer"
                    />
                  )
                )}
              </div>
            ),
          };
        }
        return {
          ...column,
          Cell: ({ renderedCellValue, cell, row, column }) =>
            row.original.id == selectedValue?.id ? (
              column.id == "meaning" ? (
                <div>
                  <TextField
                    inputRef={meaningTextFieldRef}
                    variant="standard"
                    defaultValue={renderedCellValue}
                    autoComplete="off"
                    onChange={(e) =>
                      setSelectedValue({
                        ...selectedValue,
                        [column.id as string]: e.target.value,
                      })
                    }
                    error={meaningError}
                  />
                  {meaningError && (
                    <div className="text-[#db3545] text-xs pt-1">
                      This field is required
                    </div>
                  )}
                </div>
              ) : (
                <TextField
                  variant="standard"
                  defaultValue={renderedCellValue}
                  onChange={(e) =>
                    setSelectedValue({
                      ...selectedValue,
                      [column.id as string]: e.target.value,
                    })
                  }
                />
              )
            ) : (
              renderedCellValue
            ),
        };
      }),
    [selectedValue, baseColumns]
  );

  return (
    <Show
      goBack={null}
      isLoading={isLookupLoading}
      breadcrumb={false}
      wrapperProps={{
        className: "rounded-none bg-[#f2f6fa] shadow-none p-0",
      }}
      contentProps={{
        className: "p-0",
      }}
      title={
        <div className="px-8 pt-6 !font-satoshi text-2xl font-semibold text-[#1f325c] gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <DnsRoundedIcon />
              Detailed Lookup
            </div>
            <span
              className={`mx-2 px-4 py-1 rounded-full text-xs ${lookup?.active ? "bg-[#11ba82] text-white" : "bg-[#c2c2c2] text-black"}`}
            >
              {lookup?.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      }
      headerButtons={({ editButtonProps, refreshButtonProps }) =>
        getButtonProps(editButtonProps, refreshButtonProps)
      }
    >
      {isLookupLoading || masterLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="px-12 flex gap-12 pt-4 pb-12">
            <div className="">
              <div className="text-[#515f72] font-semibold">Lookup Name</div>
              <div className="text-[#687991] mt-2">{lookup?.lookup_name}</div>
            </div>
            <div className="">
              <div className="text-[#515f72] font-semibold">Lookup Type</div>
              <div className="text-[#687991] mt-2">{lookup?.type}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[#515f72] font-semibold">
                Lookup Description
              </div>
              <div className="text-[#687991] mt-2">{lookup?.description}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[#515f72] font-semibold">Master Lookup</div>
              <div className="text-[#687991] mt-2">
                {lookup?.parent_lookup?.lookup_name || "None"}
              </div>
            </div>

            {lookup?.parent_lookup && (
              <div className="col-span-2">
                <div className="text-[#515f72] font-semibold">
                  Master Lookup Value
                </div>
                <FormControl variant="standard" sx={{ minWidth: 120, mt: 1 }}>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={parentValue}
                    onChange={handleParentValue}
                  >
                    {masterLoading ? (
                      <MenuItem value="">
                        <em>Loading</em>
                      </MenuItem>
                    ) : (
                      masterOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.id}>
                          {option.value}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
          <div className="bg-white">
            <GenericTable
              title={
                <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                  Lookup Codes
                </div>
              }
              columns={columns}
              handleCreate={handleAdd}
              data={codes.filter(
                (code) =>
                  !parentValue ||
                  code.parent_value == parentValue ||
                  code.is_new
              )}
              addText={
                <div className="flex gap-2">
                  <EditOutlinedIcon fontSize="small" /> Add
                </div>
              }
              noSearchNeed={true}
              canCreate={!selectedValue?.is_new}
            />
          </div>
        </div>
      )}
    </Show>
  );
};

export default Page;
