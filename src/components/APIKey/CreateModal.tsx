import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Organization } from "../../types/types";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";
import { useList } from "@refinedev/core";

interface CreateModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  handleCreate: (name: string, org: string) => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "6px",
  px: 2,
  "&:focus": {
    outline: "none", // Ensure focus outline is removed
  },
};

const CreateModal: React.FC<CreateModalProps> = ({
  openModal,
  handleCloseModal,
  handleCreate,
}) => {
  const {
    data: orgs,
    isLoading,
    refetch,
  } = useList<Organization>({
    hasPagination: false,
    resource: "orgs",
  });

  const [selectedOrg, setSelectedOrg] = React.useState("");
  const [name, setName] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOrg(event.target.value as string);
  };

  const handleOk = () => {
    handleCreate(name, selectedOrg);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div className="text-lg font-bold text-[#003133] border-b border-[#e0e0e0] py-4">
          Create API Key
        </div>
        <div className="py-4 px-4 flex flex-col gap-4">
          <TextField
            id="outlined-basic"
            label="API Key Name"
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Organization</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedOrg}
              label="Organization"
              onChange={handleChange}
            >
              {orgs?.data
                ?.filter(
                  (org) => org.active && org.organization_code != "MASTR"
                )
                .map((org) => (
                  <MenuItem
                    value={org.organization_code}
                    key={org.organization_code}
                  >
                    {org.organization_code}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex justify-end gap-2 py-2 border-t border-[#e0e0e0]">
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={modalCancelBtnStyle}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleOk} sx={modalOkBtnStyle}>
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateModal;
