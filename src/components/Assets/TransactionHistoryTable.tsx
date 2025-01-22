"use client";

import { Asset, Transaction } from "@/types/types";
import GenericTable from "@components/Table/GenericTable";
import { TxtStatusColor } from "@data/ColorData";
import { tagStyle } from "@data/MuiStyles";
import { Box } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo, useState } from "react";
import TransactionDetailDrawer from "./TransactionDetailDrawer";
import { getFormattedDate } from "@utils/utilFunctions";
import { useNavigation } from "@refinedev/core";

interface TransactionHistoryTableProps {
  transactions?: Transaction[];
  asset?: Asset;
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  asset,
}) => {
  const { push } = useNavigation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [clickedTransaction, setClickedTransaction] = useState<string | null>(
    null
  );
  const handleShowClick = (row: Transaction) => {
    // setClickedTransaction(row.transaction_id);
    // setOpenDrawer(true);
    push(`/dashboard/transactions/show?id=${row.transaction_id}`);
  };
  const handleClose = () => {
    setOpenDrawer(false);
  };
  const tableData = transactions?.map(txn => ({
    ...txn,
    transaction_date: getFormattedDate(txn.transaction_date),
    product_type: asset?.osc_product?.product_type,
    product_part_number: asset?.osc_product?.product_part_number,
  }))

  const columns = useMemo<MRT_ColumnDef<Transaction>[]>(() => {
    return [
      {
        accessorKey: "transaction_number",
        header: "Txn Number",
        size: 50,
      },
      {
        accessorKey: "transaction_date",
        header: "Txn Date",
        size: 50,
      },
      {
        accessorKey: "transaction_source",
        header: "Txn Source",
        size: 50,
      },
      {
        accessorKey: "source_reference_number",
        header: "Source Ref #",
        size: 50,
      },
      {
        accessorKey: "product_type",
        header: "Product Type",
        size: 50,
      },
      {
        accessorKey: "product_part_number",
        header: "Product Part Number",
        size: 50,
      },
      {
        accessorKey: "quantity",
        header: "Seat Count",
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <div className="text-right w-full pr-7">{renderedCellValue}</div>
        ),
      },
      {
        accessorKey: "transaction_action",
        header: "Txn Action",
        size: 50,
        // Cell: ({ renderedCellValue }) => (
        //   <Box
        //     component="span"
        //     sx={{
        //       backgroundColor: TxtActionColor[renderedCellValue as string],
        //       ...tagStyle,
        //     }}
        //   >
        //     {renderedCellValue}
        //   </Box>
        // ),
      },
      {
        accessorKey: "transaction_status",
        header: "Txn Status",
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: TxtStatusColor[renderedCellValue as string],
              ...tagStyle,
            })}
          >
            {renderedCellValue}
          </Box>
        ),
      },
      {
        accessorKey: "bill_customer_name",
        header: "Bill Customer",
        size: 50,
      },
      {
        accessorKey: "ship_customer_name",
        header: "Ship Customer",
        size: 50,
      },
      {
        accessorKey: "reseller_name",
        header: "Reseller",
        size: 50,
      },
    ];
  }, []);

  return (
    <>
      <GenericTable
        data={tableData}
        title={
          <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
            Transaction History
          </div>
        }
        columns={columns}
        onRowClick={handleShowClick}
        noSearchNeed
        noSortNeed
      />
      {clickedTransaction && (
        <TransactionDetailDrawer
          open={openDrawer}
          onClose={() => handleClose()}
          transaction_id={clickedTransaction}
        />
      )}
    </>
  );
};

export default TransactionHistoryTable;
