import React, { useEffect } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { APIKey } from "../../types/types";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";

interface CreateModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdate: (name: string) => void;
  handleRevoke: () => void;
  selectedAPIKey: APIKey | null;
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

const RevokeModal: React.FC<CreateModalProps> = ({
  openModal,
  handleCloseModal,
  handleRevoke,
  handleUpdate,
  selectedAPIKey,
}) => {
  const [name, setName] = React.useState(selectedAPIKey?.name);

  const [revoke, setRevoke] = React.useState(selectedAPIKey?.revoked);

  useEffect(() => {
    setRevoke(selectedAPIKey?.revoked);
    setName(selectedAPIKey?.name);
  }, [selectedAPIKey]);

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div className="text-lg font-bold text-[#003133] border-b border-[#e0e0e0] py-4">
          Edit API Key
        </div>
        <div className="py-4 px-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm font-medium">API Key Name</div>
            <div className="col-span-2">
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={name}
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          {/* <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm font-medium">Revoke</div>
            <div className="col-span-2">
              <GeneralSwitch
                onChange={() => setRevoke(!revoke)}
                value={revoke}
                label=""
              />
            </div>
          </div> */}
        </div>
        <div className="flex justify-end gap-2 py-2 border-t border-[#e0e0e0]">
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={modalCancelBtnStyle}
          >
            Cancel
          </Button>
          <Button variant="contained" disabled={revoke} onClick={handleRevoke} sx={{
            ...modalOkBtnStyle,
            bgcolor: '#d10000', // Background color
            color: 'white', // Text color
            '&:hover': {
                bgcolor: '#d10000', // Background color on hover
                opacity: 0.9, // Adjust opacity on hover
                boxShadow: 'none',
            },
          }}>
            Revoke
          </Button>
          <Button variant="contained" onClick={() => handleUpdate(name as string)} sx={modalOkBtnStyle}>
            Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RevokeModal;
