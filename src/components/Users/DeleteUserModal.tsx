import React from "react";
import { Box, Button, Modal } from "@mui/material";
import { User } from "../../types/types";

interface DeleteUserModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  selectedUser: User | undefined;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  px: 2,
  py: 2,
  "&:focus": {
    outline: "none", // Ensure focus outline is removed
  },
};

const buttonStyle = {
  px: 2.5, // Horizontal padding
  py: 0.5, // Vertical padding
  borderRadius: "8px", // Rounded corners
  boxShadow: "none",
  textTransform: "none",
  fontWeight: "500",
  fontSize: "0.75rem",
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  openModal,
  handleCloseModal,
  selectedUser,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div className="flex justify-center items-center">
          <div className="flex gap-2 py-2">
            <div className="flex flex-col justify-center font-medium">
              <div className="text-md text-black">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </div>
              <div className="text-base text-[#818f99]">
                {selectedUser?.email}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-lg text-black font-bold my-4 px-2">
          Are you sure you want to delete this user
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="contained"
            onClick={handleCloseModal}
            fullWidth
            sx={{
              bgcolor: "white", // Background color
              color: "black", // Text color
              "&:hover": {
                bgcolor: "#edf0f2", // Background color on hover
                opacity: 0.9, // Adjust opacity on hover
                boxShadow: "none",
              },
              ...buttonStyle,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            fullWidth
            sx={{
              bgcolor: "#db1a34", // Background color
              color: "white", // Text color
              "&:hover": {
                bgcolor: "#db1a34", // Background color on hover
                opacity: 0.9, // Adjust opacity on hover
                boxShadow: "none",
              },
              ...buttonStyle,
            }}
          >
            Delete
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteUserModal;
