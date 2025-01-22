import React, { useEffect } from "react";
import { Button, Drawer } from "@mui/material";
import { useCreate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";
import { Customer } from "../../types/types";
import CustomerForm from "@components/Forms/Partners/CustomerForm";

interface CustomerDetailDrawerProps {
  resource: string;
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  resource,
  open,
  onClose,
  customer,
}) => {
  const {
    control,
    trigger,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Customer>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (customer != null) {
      reset(customer);
    } else {
      reset({});
    }
  }, [open]);

  const { mutate: updateCustomer } = useUpdate();
  const { mutate: createCustomer } = useCreate();

  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields

    if (isValid) {
      const handleError = (error: any) => {};

      const CustomerData = getValues();

      if (customer) {
        updateCustomer(
          {
            resource: `customers/${resource}`,
            id: `${customer?.account_id}`,
            values: CustomerData,
          },
          {
            onError: handleError,
            onSuccess: () => onClose(),
          }
        );
      } else {
        createCustomer(
          {
            resource: `customers/${resource}`,
            values: CustomerData,
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
          <CustomerForm {...{ control, errors, trigger }} />
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
            {customer ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CustomerDetailDrawer;
