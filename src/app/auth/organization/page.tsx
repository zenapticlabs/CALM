"use client";
import FormControlWrapper from "@components/Forms/FormControlWrapper";
import useStore from "@hooks/globalStore";
import { Button } from "@mui/base";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import Dropdown from "@components/Input/Dropdown";
import { Organization } from "@/types/types";
import { useState } from "react";
import Loader from "@components/common/Loader";

const Page: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onSubmit"
  });
  const realAPI_URL = "http://localhost:8000/api";
  const API_URL = process.env.API_URL;
  const [loading, setLoading] = useState(false);
  const organizations = useStore().organizations;
  const { push } = useNavigation();
  const onSubmit = async (data: any) => {
    setLoading(true);
    const orgForm = data as FormData;
    const response = await fetch(`${API_URL ?? realAPI_URL}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tempToken")}`,
      },
      body: JSON.stringify({ organization: (orgForm as any).organization }),
    });
    if (response.ok) {
      const data: any = await response.json();
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      push("/dashboard");
    }
    // push("/dashboard");
  };

  return (
    <>
      <div className="bg-[#f7f9fa] flex justify-center items-center min-h-screen py-10">
        {loading ? (
          <Loader />
        ) : (
          <div className="min-w-[480px] rounded-xl border border-stroke bg-white shadow-default">
            <div className="flex flex-wrap items-center">
              <div className="w-full border-stroke dark:border-strokedark">
                <div className="w-full p-8">
                  <div className="flex justify-between items-center mb-9">
                    <h2 className="text-2xl font-bold text-black">
                      Select organization
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-4">
                      <FormControlWrapper
                        name="organization"
                        control={control}
                        rules={{
                          required: "Please choose an organization!",
                        }}
                        error={errors.email?.message?.toString()}
                      >
                        {(field) => (
                          <Dropdown
                            {...field}
                            type={"dropdown"}
                            label="Organization"
                            placeholder="Select your organization"
                            required={true}
                            options={organizations.map(
                              (organization: Organization) => ({
                                label: organization.organization_code,
                                value: organization.organization_code,
                              })
                            )}
                          />
                        )}
                      </FormControlWrapper>
                      <Button
                        type="submit"
                        className="text-center w-full block mb-5 cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                      >
                        Sign in
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Page;
