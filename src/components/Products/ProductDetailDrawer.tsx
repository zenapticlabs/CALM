import React, { useEffect } from "react";
import { Button, Drawer } from "@mui/material";
import { useCreate, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { modalCancelBtnStyle, modalOkBtnStyle } from "@data/MuiStyles";
import { Product } from "../../types/types";
import ProductForm from "@components/Forms/Products/ProductForm";

interface ProductDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  open,
  onClose,
  product,
}) => {
  const {
    control,
    trigger,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Product>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const previousProduct = getValues();
    if (product != null) {
      reset(product);
    } else {
      Object.keys(previousProduct).forEach((key) => setValue(key, null));
    }
  }, [open]);

  const { mutate: updateProduct } = useUpdate();
  const { mutate: createProduct } = useCreate();

  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields

    if (isValid) {
      const handleError = (error: any) => {};

      const productData = getValues();

      if (product) {
        updateProduct(
          {
            resource: "products",
            id: `${product?.product_id}`,
            values: productData,
          },
          {
            onError: handleError,
            onSuccess: () => onClose(),
          }
        );
      } else {
        createProduct(
          {
            resource: "products",
            values: productData,
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
          <ProductForm {...{ control, errors, trigger }} />
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
            {product ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ProductDetailDrawer;
