"use client";

import { useNavigation } from "@refinedev/core";
import { Contact } from "../../types/types";
import React, { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";
import GenericTable from "@components/Table/GenericTable";
import StateComponent from "@components/common/StateComponent";

interface ContactTableProps {
  data: Partial<Contact[]>;
  partner_id: string;
}

const ContactTable: React.FC<ContactTableProps> = ({ data, partner_id }) => {
  const { push } = useNavigation();

  const columns = useMemo<MRT_ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: "first_name",
        header: "First Name",
        size: 50,
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        size: 50,
      },
      {
        accessorKey: "job_title",
        header: "Job Title",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 50,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 50,
      },
      {
        accessorKey: "renewal_notification",
        header: "Renewal Notification",
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel type="YES"/>
        ),
      },
      {
        accessorKey: "primary",
        header: "Primary",
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel type="YES"/>
        ),
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <StateComponent active={renderedCellValue as boolean} withLabel/>
        ),
      },
    ],
    []
  );
  const filteredData = data.filter(
    (item): item is Contact => item !== undefined
  );

  const handleRowClick = (row: Contact) => {
    push(
      `/dashboard/partners/show/contacts/edit?partner_id=${partner_id}&contact_id=${row.contact_id}`
    );
  };
  const handleCreate = () => {
    push(`/dashboard/partners/show/contacts/create?partner_id=${partner_id}`);
  };

  return (
    <GenericTable
      title={
        <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
          Data
        </div>
      }
      data={filteredData}
      columns={columns}
      canCreate={true}
      totalCount={data?.length || 0}
      noSearchNeed
      onRowClick={handleRowClick}
      handleCreate={handleCreate}
    />
  );
};

export default ContactTable;
