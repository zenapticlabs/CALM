"use client";

import { Asset, InputTransaction, Transaction } from "@/types/types";
import {
  useBack,
  useNavigation,
  useOne,
  useParsed,
  useUpdate,
} from "@refinedev/core";
import ArrowIcon from "@/assets/icons/arrow.svg?icon";
import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { sendEmailBtnStyle } from "@data/MuiStyles";
import Loader from "@components/common/Loader";
import UpdateCustomerForm from "@components/Forms/UpdateCustomer/UpdateCustomerForm";
const Page = () => {
  const { params } = useParsed();
  const { data: assetData, isLoading: assetLoading } = useOne<Asset>({
    resource: "assets",
    id: params?.asset_id,
  });

  const transaction = {
    ship_customer: assetData?.data?.owner,
    ...(assetData?.data as Transaction),
  };

  const {
    saveButtonProps,
    refineCore: { formLoading, queryResult },
    control,
    trigger,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<InputTransaction>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const { mutate: UpdateCustomer } = useUpdate();
  const { push } = useNavigation();
  const handleSubmit = async () => {
    const payload = getValues();
    UpdateCustomer(
      {
        resource: `assets`,
        values: payload,
        id: params?.asset_id,
      },
      {
        onError: (error) => console.log("error", error),
        onSuccess: () => push(`/dashboard/assets/show?id=${params?.asset_id}`),
      }
    );
  };

  return (
    <div className="flex justify-center py-6">
      <div className="w-2/3">
        <Create
          goBack={
            <button
              onClick={useBack()}
              className="inline-block mx-2 p-2 rounded-xl border duration-500 border-transparent hover:border-black"
            >
              {" "}
              <ArrowIcon />
            </button>
          }
          breadcrumb={false}
          headerButtons={<div></div>}
          title={
            <div className="!font-satoshi text-2xl font-semibold text-[#1f325c] flex items-center" onClick={() => console.log(getValues())}>
              Update Customers
            </div>
          }
          wrapperProps={{
            className: "rounded-none bg-[#f2f6fa] shadow-none",
          }}
          saveButtonProps={{ ...saveButtonProps, hidden: false }}
          footerButtons={({ saveButtonProps }) => (
            <SaveButton onClick={handleSubmit} sx={sendEmailBtnStyle} />
          )}
        >
          {assetLoading ? (
            <Loader />
          ) : (
            <UpdateCustomerForm
              {...{ control, errors, trigger }}
              setValue={setValue}
              reset={reset}
              watch={watch}
              transaction={transaction}
            />
          )}
        </Create>
      </div>
    </div>
  );
};

export default Page;
