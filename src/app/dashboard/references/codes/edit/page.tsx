"use client";

import ArrowIcon from "@/assets/icons/arrow.svg?icon";
import { ReferenceCode } from "@/types/types";
import GenericForm from "@components/Forms/GenericForm";
import { ReferenceCodeFormFields } from "@components/Forms/References/ReferenceCodeFormFields";
import Loader from "@components/common/Loader";
import { sendEmailBtnStyle } from "@data/MuiStyles";
import { useBack, useNavigation, useParsed, useUpdate } from "@refinedev/core";
import { Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";

const Item = () => {
  const { params } = useParsed();
  const { push } = useNavigation();
  const {
    saveButtonProps,
    refineCore: { formLoading, queryResult },
    control,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ReferenceCode>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    refineCoreProps: {
      action: "edit",
      resource: `references/${params?.reference_id}/codes`,
      id: params?.code_id,
    },
  });

  const referenceCode: ReferenceCode = queryResult?.data?.data as ReferenceCode;

  useEffect(() => {
    if (!formLoading && referenceCode) {
      reset({
        ...referenceCode,
        osc_part_number: referenceCode.osc_product?.product_part_number,
      });
    }
  }, [formLoading, referenceCode]);

  const { mutate: updateCode } = useUpdate();
  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields
    if (isValid) {
      const payload = getValues();
      updateCode(
        {
          resource: `references/${params?.reference_id}/codes`,
          values: payload,
          id: params?.code_id
        },
        {
          onError: (error) => console.log("error", error),
          onSuccess: () => push(`/dashboard/references/show?id=${params?.reference_id}`),
        }
      );
    }
  };

  return (
    <div className="flex justify-center py-6">
      <div className="w-2/3">
        <Edit
          goBack={
            <button
              onClick={useBack()}
              className="inline-block p-2 rounded-xl border duration-500 border-transparent hover:border-black"
            >
              {" "}
              <ArrowIcon />
            </button>
          }
          title={
            <div className="!font-satoshi text-2xl font-semibold text-[#1f325c]">
              Edit Reference Code
              <div className="text-sm text-[#778599]">
                {referenceCode?.reference?.reference_name}
              </div>
            </div>
          }
          breadcrumb={false}
          headerButtons={<></>}
          wrapperProps={{
            className: "rounded-none bg-[#f2f6fa] shadow-none",
          }}
          saveButtonProps={{ ...saveButtonProps, hidden: false }}
          footerButtons={({ saveButtonProps }) => (
            <SaveButton onClick={handleSubmit} sx={sendEmailBtnStyle} />
          )}
        >
          {formLoading ? (
            <Loader />
          ) : (
            <GenericForm
              {...{ control, errors, trigger }}
              fields={ReferenceCodeFormFields.edit}
            />
          )}
        </Edit>
      </div>
    </div>
  );
};

export default Item;
