"use client";
import FormControlWrapper from "@components/Forms/FormControlWrapper";
import { Button } from "@mui/base";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity, useLogin, useNavigation } from "@refinedev/core";
import { User } from "@/types/types";
import Loader from "@components/common/Loader";
import Link from "next/link";
import EmailIcon from "@/assets/icons/email.svg?icon";
import GeneralInput from "@components/Input/GeneralInput";
import PasswordIcon from "@/assets/icons/password.svg?icon";

const Page: React.FC = () => {
  const { push } = useNavigation();
  const { data: identity, isLoading } = useGetIdentity<User>();
  if (identity) {
    push("/dashboard");
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onSubmit"
  });
  const { mutate: login, isLoading: isLoginLoading } = useLogin<FormData>();
  const onSubmit = async (data: any) => {
    const loginForm = data as FormData;
    login({
      ...loginForm,
    });
  };

  return (
    <>
      <div className="bg-[#f7f9fa] flex justify-center items-center min-h-screen py-10">
        {isLoading || isLoginLoading ? (
          <Loader />
        ) : (
          <div className="min-w-[480px] rounded-xl border border-stroke bg-white shadow-default">
            <div className="flex flex-wrap items-center">
              <div className="w-full border-stroke dark:border-strokedark">
                <div className="w-full p-8">
                  <div className="flex justify-between items-center mb-9">
                    <h2 className="text-2xl font-bold text-black">
                      Sign in as super user
                    </h2>
                    <Link
                      href={"/auth/signin"}
                      className="text-sm text-primary font-medium"
                    >
                      back
                    </Link>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-4">
                      <FormControlWrapper
                        name="username"
                        control={control}
                        rules={{
                          required: "Please enter your username!",
                        }}
                        error={errors.username?.message?.toString()}
                      >
                        {(field) => (
                          <GeneralInput
                            {...field}
                            type={"text"}
                            label="Username"
                            placeholder="Enter your username"
                            disabled={false}
                            required={true}
                            icon={<EmailIcon className="fill-current" />}
                          />
                        )}
                      </FormControlWrapper>
                      <FormControlWrapper
                        name="password"
                        control={control}
                        rules={{ required: "Please enter your password!" }}
                        error={errors.password?.message?.toString()}
                      >
                        {(field) => (
                          <GeneralInput
                            {...field}
                            type={"password"}
                            label="Password"
                            placeholder="Enter your password"
                            disabled={false}
                            required={true}
                            icon={<PasswordIcon className="fill-current" />}
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
