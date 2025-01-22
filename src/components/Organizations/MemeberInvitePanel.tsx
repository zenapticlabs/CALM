import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useCreate, useGetIdentity, useTable } from "@refinedev/core";
import { Organization, Role, User } from "@/types/types";
import React, { useState } from "react";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { modalOkBtnStyle } from "@data/MuiStyles";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
interface MemeberInvitePanelProps {
  openSuccessModal: boolean;
  handleCloseSuccessModal: () => void;
  orgs: Organization[];
}
const MemeberInvitePanel: React.FC<MemeberInvitePanelProps> = ({
  openSuccessModal,
  handleCloseSuccessModal,
  orgs,
}) => {
  const { data: identity } = useGetIdentity<User>();
  const {
    tableQueryResult: { data: rolesData, isLoading: isRolesLoading, refetch },
  } = useTable<Role>({
    resource: "roles",
    hasPagination: false,
  });

  const [sentValues, setSentValues] = useState<any[]>([
    {
      email: "",
      role_id: "",
      organization: "",
    },
  ]);

  const handleAddMore = () => {
    setSentValues([
      ...sentValues,
      {
        email: "",
        role_id: "",
        organization: "",
      },
    ]);
  };
  const handleRemove = (index: number) => {
    const newValues = sentValues.filter((_, i) => i !== index);
    setSentValues(newValues);
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newValues = [...sentValues];
    newValues[index].email = e.target.value;
    setSentValues(newValues);
  };
  const handleRoleChange = (e: SelectChangeEvent, index: number) => {
    const newValues = [...sentValues];
    newValues[index].role_id = e.target.value;
    setSentValues(newValues);
  };
  const handleOrganizationChange = (e: SelectChangeEvent, index: number) => {
    const newValues = [...sentValues];
    newValues[index].organization = e.target.value;
    setSentValues(newValues);
  };

  const { mutate } = useCreate();
  const [invited, setInvited] = useState(false);
  const handleInvite = () => {
    mutate(
      {
        resource: "invite",
        values: sentValues,
      },
      {
        onSuccess: () => {
          setInvited(true);
          handleCloseSuccessModal();
        },
      }
    );
  };

  return (
    <Modal
      open={openSuccessModal}
      onClose={handleCloseSuccessModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: "70%",
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="mx-6 px-6 pb-4 my-6 pt-3 rounded-lg shadow-card bg-white">
          <div className="text-xl text-sm font-semibold border-b border-[#c7c7c7] py-4 text-[#1f325c] flex justify-between">
            <div className="flex items-center gap-2">
              <WavingHandIcon />
              Invite new members by email address
            </div>
            <Button
              variant="outlined"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={handleAddMore}
            >
              <AddOutlinedIcon fontSize="small" />
              Add more
            </Button>
          </div>
          <div className="text-sm text-normal py-4 flex gap-1 items-center">
            <InfoOutlinedIcon fontSize="small" />
            If the user already has an active account, the user will be added to
            the organization
          </div>
          <div className="flex gap-8 mr-18 pb-4 px-12">
            <div className="text-xs flex-1">Email Address</div>
            <div className="text-xs flex-1">Role</div>
            <div className="text-xs flex-1">Organization</div>
          </div>
          <div className="flex items-center gap-4 px-12 border-b border-[#c7c7c7] pb-8">
            <div className="flex flex-1 flex-col gap-6">
              {sentValues.map((value, index) => (
                <TextField
                  key={index}
                  id="standard-basic"
                  variant="outlined"
                  placeholder="Enter email address"
                  size="small"
                  type="email"
                  value={value.email}
                  onChange={(e) => handleEmailChange(e, index)}
                />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-6">
              {sentValues.map((value, index) => (
                <FormControl fullWidth key={index}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    size="small"
                    value={value.role}
                    onChange={(e) => handleRoleChange(e, index)}
                  >
                    {rolesData?.data?.map((role) => (
                      <MenuItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </MenuItem>
                    )) || []}
                  </Select>
                </FormControl>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-6">
              {sentValues.map((value, index) => (
                <FormControl fullWidth key={index}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    size="small"
                    value={value.organization_code}
                    onChange={(e) => handleOrganizationChange(e, index)}
                  >
                    {orgs
                      .filter(
                        (org) => org.active && org.organization_code != "MASTR"
                      )
                      .map((org) => (
                        <MenuItem
                          key={org.organization_code}
                          value={org.organization_code}
                        >
                          {org.organization_code}
                        </MenuItem>
                      )) || []}
                  </Select>
                </FormControl>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {sentValues.map((value, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <IconButton
                    onClick={() => handleRemove(index)}
                    disabled={sentValues.length === 1}
                  >
                    <DoDisturbOnOutlinedIcon fontSize="medium" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button sx={modalOkBtnStyle} onClick={handleInvite}>
              Invite members
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default MemeberInvitePanel;
