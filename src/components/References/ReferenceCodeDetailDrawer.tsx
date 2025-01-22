import React, { useEffect } from "react";
import { Button, Drawer } from "@mui/material";
import { useCreate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";
import { Reference, ReferenceCode } from "../../types/types";
import ReferenceCodeForm from "@components/Forms/References/ReferenceCodeForm";

interface ReferenceCodeDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  referenceCode: ReferenceCode | null;
  reference_id: string | undefined;
}

const ReferenceCodeDetailDrawer: React.FC<ReferenceCodeDetailDrawerProps> = ({
  reference_id,
  open,
  onClose,
  referenceCode,
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
    if (referenceCode != null) {
      reset(referenceCode);
    } else {
      reset({});
    }
  }, [open]);

  const { mutate: updateReferenceCode } = useUpdate();
  const { mutate: createReferenceCode } = useCreate();

  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields

    if (isValid) {
      const handleError = (error: any) => {
        console.log(error.response.data);
      };

      const referenceCodeData = getValues();
      if (referenceCode) {
        // updateReference(
        //   {
        //     resource: "references",
        //     id: `${(reference?.reference_id)}`,
        //     values: referenceCodeData
        //   },
        //   {
        //     onError: handleError,
        //     onSuccess: () => onClose(),
        //   }
        // )
      } else {
        createReferenceCode(
          {
            resource: `references/${reference_id}/codes`,
            values: referenceCodeData,
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
          <ReferenceCodeForm {...{ control, errors, trigger }} />
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
            {referenceCode ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ReferenceCodeDetailDrawer;
