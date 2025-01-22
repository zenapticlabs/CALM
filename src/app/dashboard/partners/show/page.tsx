"use client";

import { Partner } from "@/types/types";
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
import { getNestedValue } from "@utils/utilFunctions";
import AddressTable from "@components/Partners/AddressTable";
import ContactTable from "@components/Partners/ContactTable";
import PartnerTransactionTable from "@components/Partners/PartnerTransactionTable";
import PartnerLicensesTable from "@components/Partners/PartnerLicensesTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faGlassWater,
  faLocationDot,
  faRightLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import GeneralInformation from "@components/common/View/GeneralInformation";
import StateComponent from "@components/common/StateComponent";
import Link from "next/link";

const Item = () => {
  const { params } = useParsed();
  const { queryResult } = useShow<Partner>({
    resource: "partners",
    id: params?.id,
  });
  const { data, isLoading } = queryResult;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { push } = useNavigation();

  const partner = data?.data;

  const getButtonProps = (editButtonProps: any, refreshButtonProps: any) => {
    return (
      <div className="flex gap-2 px-12">
        <EditButton
          {...editButtonProps}
          onClick={() => push(`/dashboard/partners/edit?id=${params?.id}`)}
          sx={editRefineBtnStyle}
        />
        {/* <RefreshButton {...refreshButtonProps} sx={refreshRefineBtnStyle} /> */}
      </div>
    );
  };
  const summaryfields = [
    { title: "Partner Name", key: "name" },
    {
      title: "Partner Type",
      key: "type",
      // value: (
      //   <span
      //     className={`text-xs text-white px-6 py-1 rounded-full text-center font-semibold`}
      //     style={{
      //       backgroundColor:
      //         partnerTypes.find((type) => type.value === partner?.type)
      //           ?.color || "#ff3838",
      //     }}
      //   >
      //     {partner?.type}
      //   </span>
      // ),
    },
    {
      title: "Active",
      key: "active",
      value: (
        <span
          className={`rounded-full ${partner?.active ? "bg-[#11ba82]" : "bg-[#929ea8]"} text-xs font-medium px-4 py-1 text-white font-semibold`}
        >
          {partner?.active ? "Active" : "Inactive"}
        </span>
      ),
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
                  <FontAwesomeIcon icon={faUser} />
                  Partner
                </div>
                {/* <div className="text-lg font-normal">{partner?.name}</div> */}
              </div>
              {/* <span
                className={`text-xs text-white px-6 py-1 rounded-full text-center font-semibold`}
                style={{
                  backgroundColor:
                    partnerTypes.find((type) => type.value === partner?.type)
                      ?.color || "#ff3838",
                }}
              >
                {partner?.type}
              </span>
              <div
                className={`rounded-full ${partner?.active ? "bg-[#11ba82]" : "bg-[#929ea8]"} text-xs font-medium px-4 py-1 text-white font-semibold`}
              >
                {partner?.active ? "Active" : "Inactive"}
              </div> */}
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
          <div>
            <div className="flex gap-16 px-12 mt-8">
              {summaryfields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1 text-lg">
                  <div className="text-[#515f72] font-semibold">
                    {field.title}
                  </div>
                  <div className="text-[#687991]">
                    {field.value || getNestedValue(partner, field.key)}
                  </div>
                </div>
              ))}
            </div>
            <div className="">
              <div className="px-12 pt-4">
                <StyledTabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} />
                        Partner Detail
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faAddressBook} />
                        Contacts
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} />
                        Location
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faGlassWater} />
                        Licenses
                      </div>
                    }
                  />
                  <StyledTab
                    label={
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faRightLeft} />
                        Transactions
                      </div>
                    }
                  />
                </StyledTabs>
              </div>
              <CustomTabPanel value={value} index={0}>
                <GeneralInformation
                  singleColumn
                  items={[
                    {
                      label: "Partner Name",
                      value: partner?.name,
                    },
                    {
                      label: "Partner ID",
                      value: partner?.partner_number,
                    },
                    {
                      label: "Partner Source ID",
                      value: partner?.account_id,
                    },
                    {
                      label: "Partner Type",
                      value: partner?.type,
                    },
                    {
                      label: "Partner Website",
                      value: partner?.website && (
                        <Link
                          href={partner?.website as string}
                          className="underline text-[#1b6ef3]"
                          target="_blank"
                        >
                          {partner?.website as string}
                        </Link>
                      ),
                    },
                    {
                      label: "Active",
                      value: (
                        <StateComponent
                          active={partner?.active as boolean}
                          withLabel
                        />
                      ),
                    },
                  ]}
                ></GeneralInformation>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <ContactTable
                  data={partner?.contacts ?? []}
                  partner_id={params?.id}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <AddressTable
                  data={partner?.addresses ?? []}
                  partner_id={params?.id}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <PartnerLicensesTable partner_id={params?.id} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={4}>
                <PartnerTransactionTable partner_id={params?.id} />
              </CustomTabPanel>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default Item;
