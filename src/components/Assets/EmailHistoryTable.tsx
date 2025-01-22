"use client";

import { EmailHistory } from "@/types/types";
import GenericTable from "@components/Table/GenericTable";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { getFormattedDate } from "@utils/utilFunctions";
import { useList, useNavigation } from "@refinedev/core";
import Loader from "@components/common/Loader";
import { Box, Modal } from "@mui/material";

interface EmailHistoryTableProps {
  assetId: string;
  asset: any;
  refetchCount: number;
}

export const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
  maxHeight: 'calc(100% - 60px)',
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  px: 4,
  py: 4,
  overflow: "auto",
  cursor: "default",
  "&:focus": {
    outline: "none", // Ensure focus outline is removed
  },
};

const EmailHistoryTable: React.FC<EmailHistoryTableProps> = ({
  assetId,
  asset,
  refetchCount,
}) => {
  const {
    data: emailHistoryData,
    isLoading,
    refetch,
  } = useList<EmailHistory>({
    resource: `assets/${assetId}/email-logs`,
    hasPagination: false,
  });
  
  useEffect(() => {
    refetch();
  }, [refetchCount]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const emailHistorys = emailHistoryData?.data.map((datum) => ({
    ...datum,
    cc: (datum?.email_template?.cc ? datum?.email_template?.cc + "; " : "") +
      (asset?.bill_customer_contact?.email ? asset?.bill_customer_contact?.email + "; " : '') +
      asset?.reseller_contact?.email,
    sent_at: getFormattedDate(datum.sent_at),
  })) as EmailHistory[];
  const columns = useMemo<MRT_ColumnDef<EmailHistory>[]>(
    () => [
      {
        accessorKey: "email_template.name",
        header: "Template Name",
        size: 50,
      },
      {
        accessorKey: "sent_at",
        header: "Notification Date",
        size: 50,
      },
      {
        accessorKey: "email_template.subject",
        header: "Subject",
        size: 50,
      },
      {
        accessorKey: "to",
        header: "To",
        size: 50,
      },
      {
        accessorKey: "cc",
        header: "Cc",
        size: 50,
      },
      {
        accessorKey: "email_template.bcc",
        header: "Bcc",
        size: 50,
      },
    ],
    []
  );

  const { push } = useNavigation();
  const handleRowClick = (row: any) => {
    setOpenModal(true);
    setSelectedEmail(row);
    // push(`/dashboard/email-templates/edit?id=${row?.email_template?.email_id}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <GenericTable
          data={emailHistorys}
          title={
            <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
              Email History
            </div>
          }
          noSearchNeed={true}
          noSortNeed={true}
          columns={columns}
          onRowClick={handleRowClick}
        />
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="pointer-events-none">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-20">From</div>
                <div className="">
                  : {selectedEmail?.email_template?.from_email || "Default Email"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-20">To</div>
                <div className="">: {selectedEmail?.to}</div>
              </div>
              <div className="flex gap-2">
                <div className="w-20">Cc</div>
                <div className="">
                  :{" "}
                  {selectedEmail?.email_template.cc &&
                    selectedEmail?.email_template.cc + "; "}
                  {asset?.bill_customer_contact?.email &&
                    asset?.bill_customer_contact?.email + "; "}
                  {asset?.reseller_contact?.email}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-20">Bcc</div>
                <div className="">: {selectedEmail?.email_template.bcc}</div>
              </div>
              <div className="flex gap-2">
                <div className="w-20">Send At</div>
                <div className="">: {selectedEmail?.sent_at}</div>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: selectedEmail?.sent_email_body }}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default EmailHistoryTable;
