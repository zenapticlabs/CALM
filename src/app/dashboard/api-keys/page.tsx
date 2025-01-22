"use client";

import { Box, Modal, SnackbarCloseReason } from "@mui/material";

import { useCreate, useList, useUpdate } from "@refinedev/core";
import { APIKey } from "@/types/types";
import { useMemo, useState } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { ProductActiveColor } from "@data/ColorData";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import Loader from "@components/common/Loader";
import { modalStyle, tagStyle } from "@data/MuiStyles";
import GenericTable from "@components/Table/GenericTable";
import RedditTextField from "@components/common/RedditTextField";
import SnackbarComponent from "@components/common/SnackbarComponent";
import CreateModal from "@components/APIKey/CreateModal";
import RevokeModal from "@components/APIKey/RevokeModal";
import { getFormattedDate } from "@utils/utilFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const {
    data: apiKeysData,
    isLoading,
    refetch,
  } = useList<APIKey>({
    hasPagination: false,
  });

  const [generatedAPIKey, setGeneratedAPIKey] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openRevokeModal, setOpenRevokeModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null);
  const { mutate: createAPIKey } = useCreate();
  const { mutate: revokeAPIKey } = useUpdate();

  const apiKeys = apiKeysData?.data.sort(
    (a, b) =>
      new Date(b.created as string).getTime() -
      new Date(a.created as string).getTime()
  ).map(datum => ({
    ...datum,
    created: getFormattedDate(datum.created)
  }))
  const handleRevoke = (row: APIKey) => {
    setSelectedAPIKey(row);
    handleOpenRevokeModal();
  };
  const handleCreate = () => {
    handleOpenCreateModal();
  };

  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => setOpenSuccessModal(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    refetch();
    setOpenCreateModal(false);
  };
  const handleOpenRevokeModal = () => setOpenRevokeModal(true);
  const handleCloseRevokeModal = () => {
    setOpenRevokeModal(false);
  };
  const handleRevokeAPIKey = () => {
    revokeAPIKey(
      {
        resource: "orgs/key/api-keys",
        id: selectedAPIKey?.id as string,
        values: {
          revoked: true,
        },
      },
      {
        onError: () => {},
        onSuccess: (res) => {
          refetch();
          handleCloseRevokeModal();
        },
      }
    );
  };
  const handleUpdateAPIKey = (name: string) => {
    revokeAPIKey(
      {
        resource: "orgs/key/api-keys",
        id: selectedAPIKey?.id as string,
        values: {
          name: name,
        },
      },
      {
        onError: () => {},
        onSuccess: (res) => {
          // Update the local apiKeys state
          refetch();
          handleCloseRevokeModal();
        },
      }
    );
  };
  const handleCreateAPIKey = (name: string, orgId: string) => {
    createAPIKey(
      {
        resource: "orgs/key/api-keys",
        values: {
          organization: orgId,
          name: name,
        },
      },
      {
        onError: () => {
          handleCloseCreateModal();
          refetch();
        },
        onSuccess: (res) => {
          handleCloseCreateModal();
          handleSuccessGenerated(res);
          refetch();
        },
      }
    );
  };
  const handleSuccessGenerated = (res: any) => {
    handleOpenSuccessModal();
    setGeneratedAPIKey(res.data.key);
  };
  const handleSnackbarOpen = () => setOpenSnackbar(true);
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const columns = useMemo<MRT_ColumnDef<APIKey>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 300,
      },
      {
        accessorKey: "created",
        header: "Created At",
        size: 300,
      },
      {
        accessorKey: "organization",
        header: "Organization",
        size: 300,
      },
      {
        accessorKey: "revoked",
        header: "Revoked",
        size: 200,
        Cell: ({ renderedCellValue }) => (
          <Box
            component="span"
            sx={{
              backgroundColor: ProductActiveColor(
                !renderedCellValue as boolean
              ),
              ...tagStyle,
            }}
          >
            {renderedCellValue ? "Revoked" : "Active"}
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto min-h-screen flex flex-col">
      <div className="flex-1">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex-1">
              <GenericTable
                title={
                  <div className="!font-satoshi px-12 py-4 text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
                    <FontAwesomeIcon icon={faKey} />
                    API Keys
                  </div>
                }
                // totalCount={apiKeys?.length}
                data={apiKeys}
                columns={columns}
                canCreate={true}
                handleCreate={handleCreate}
                noSearchNeed={true}
                noSortNeed={true}
                addText="Create API Key"
                onRowClick={handleRevoke}
              />
            </div>
            <CreateModal
              openModal={openCreateModal}
              handleCloseModal={handleCloseCreateModal}
              handleCreate={handleCreateAPIKey}
            />
            <RevokeModal
              selectedAPIKey={selectedAPIKey}
              openModal={openRevokeModal}
              handleCloseModal={handleCloseRevokeModal}
              handleRevoke={handleRevokeAPIKey}
              handleUpdate={handleUpdateAPIKey}
            />
            <Modal
              open={openSuccessModal}
              onClose={handleCloseSuccessModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...modalStyle, width: 500 }}>
                <div className="text-base text-[#11ba82] font-medium flex items-center gap-1">
                  <CheckBoxRoundedIcon />
                  Successfully Generated
                </div>
                <RedditTextField
                  label="API Key"
                  value={generatedAPIKey}
                  variant="filled"
                  style={{ marginTop: 11 }}
                  onCopy={handleSnackbarOpen}
                />
              </Box>
            </Modal>
            <SnackbarComponent
              open={openSnackbar}
              onClose={handleSnackbarClose}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
