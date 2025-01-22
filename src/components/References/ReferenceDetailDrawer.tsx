import React, { useEffect } from "react";
import { Button, Drawer } from "@mui/material";
import { useCreate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";
import { Reference } from "../../types/types";
import ReferenceForm from "@components/Forms/References/ReferenceForm";

interface ReferenceDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  reference: Reference | null;
}

const ReferenceDetailDrawer: React.FC<ReferenceDetailDrawerProps> = ({
  open,
  onClose,
  reference,
}) => {
  const {
    control,
    trigger,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Reference>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const previousReference = getValues();
    if (reference != null) {
      reset(reference);
    } else {
      reset({});
    }
  }, [open]);

  const { mutate: updateReference } = useUpdate();
  const { mutate: createReference } = useCreate();

  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields

    if (isValid) {
      const handleError = (error: any) => {
        console.log(error.response.data);
      };

      const referenceData = getValues();

      if (reference) {
        updateReference(
          {
            resource: "references",
            id: `${reference?.reference_id}`,
            values: referenceData,
          },
          {
            onError: handleError,
            onSuccess: () => onClose(),
          }
        );
      } else {
        createReference(
          {
            resource: "references",
            values: referenceData,
          },
          {
            onError: handleError,
            onSuccess: () => onClose(),
          }
        );
      }
    } else {
      console.log("Validation errors:", errors);
    }
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="min-w-[700px] px-4 pb-4 flex flex-col min-h-screen">
        <div className="py-4 px-2 text-lg font-bold text-[#65758c] flex items-center">
          Detail Information
        </div>
        <div className="flex-1">
          <ReferenceForm {...{ control, errors, trigger }} />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="contained"
            onClick={onClose}
            sx={modalCancelBtnStyle}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={modalOkBtnStyle}
          >
            {reference ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ReferenceDetailDrawer;
