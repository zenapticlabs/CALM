"use client";

import { Product } from "@/types/types";
import Loader from "@components/common/Loader";
import { editRefineBtnStyle } from "@data/MuiStyles";
import { useNavigation, useShow } from "@refinedev/core";
import { EditButton, Show } from "@refinedev/mui";
import { useParsed } from "@refinedev/core";
import {
  CustomTabPanel,
  StyledTab,
  StyledTabs,
} from "@components/Tab/CustomizedTab";
import { useState } from "react";
import GeneralInformation from "@components/common/View/GeneralInformation";
import { getNestedValue } from "@utils/utilFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCubes } from "@fortawesome/free-solid-svg-icons";
import StateComponent from "@components/common/StateComponent";
import ProductTransactionHistoryTable from "@components/Products/ProductTransactionHistoryTable";

const Item = () => {
  const { params } = useParsed();
  const { queryResult } = useShow<Product>({
    resource: "products",
    id: params?.id,
  });
  const { data, isLoading } = queryResult;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { push } = useNavigation();

  const product = data?.data;

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton
          {...editButtonProps}
          onClick={() => push(`/dashboard/products/edit?id=${params?.id}`)}
          sx={editRefineBtnStyle}
        />
        {/* <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} /> */}
      </div>
    );
  };

  const summaryfields = [
    { title: "Product Name", key: "product_name", size: 3 },
    { title: "Part Number", key: "product_part_number", size: 3 },
    { title: "Product Type", key: "product_type", size: 3 },
    { title: "Duration", key: "duration", size: 3 },
    {
      title: "Status",
      key: "active",
      value: <StateComponent active={product?.active as boolean} withLabel/>,
      size: 3,
    },
  ];

  return (
    <div className="no-padding-card">
      <Show
        goBack={null}
        isLoading={isLoading}
        breadcrumb={false}
        wrapperProps={{
          className: "rounded-none bg-[#f2f6fa] shadow-none pt-10 pb-2.5",
        }}
        title={
          <div className="!font-satoshi px-12">
            <div className="flex gap-4 items-center">
              <div className="text-2xl font-semibold text-[#1f325c] flex items-end gap-2">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCubes} />
                  Product
                </div>
              </div>
            </div>
          </div>
        }
        headerButtons={({ editButtonProps, refreshButtonProps }) =>
          getButtonProps(editButtonProps, refreshButtonProps)
        }
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="">
              <div className="grid grid-cols-5 items-start gap-x-8 gap-y-6 px-12 mt-8">
                {summaryfields.map((field) => (
                  <div key={field.key} className="flex flex-col gap-1 text-lg">
                    <div className="text-[#515f72] font-semibold">
                      {field.title}
                    </div>
                    <div className="text-[#687991]">
                      {field.value || getNestedValue(product, field.key)}
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
                        Product Detail
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCubes} />
                        Transaction History
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
                      label: "Product Part Number",
                      value: product?.product_part_number,
                    },
                    {
                      label: "Part Description",
                      value: product?.product_description,
                    },
                    {
                      label: "Product Type",
                      value: product?.product_type,
                    },
                    {
                      label: "Vender Name",
                      value: product?.vendor_name,
                    },
                    {
                      label: "Vender Part Number",
                      value: product?.vendor_part_number,
                    },
                    {
                      label: "Duration",
                      value: product?.duration,
                    },
                    {
                      label: "Product Source ID",
                      value: product?.product_source_id,
                    },
                    {
                      label: "Attribute1",
                      value: product?.attribute1,
                    },
                    {
                      label: "Attribute2",
                      value: product?.attribute2,
                    },
                    {
                      label: "Attribute3",
                      value: product?.attribute3,
                    },
                    {
                      label: "Attribute4",
                      value: product?.attribute4,
                    },
                    {
                      label: "Attribute5",
                      value: product?.attribute5,
                    },
                    {
                      label: "License Set",
                      value: '',
                    },
                    {
                      label: "Notifications Set",
                      value: '',
                    },
                  ]}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <ProductTransactionHistoryTable product={product?.product_id as string}/>
              </CustomTabPanel>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};

export default Item;
