"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "@components/common/Loader";
import FormControlWrapper from "@components/Forms/FormControlWrapper";
import GeneralInput from "@components/Input/GeneralInput";
import EmailIcon from "@/assets/icons/email.svg?icon";
import PasswordIcon from "@/assets/icons/password.svg?icon";
import { Button } from "@mui/base";
import { useRegister } from "@refinedev/core";

interface DecodedToken {
  organization?: string;
  uid?: string;
  email?: string;
  scope?: string;
  exp?: number;
}
const SignUp: React.FC = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });
  const { mutate: register } = useRegister<FormData>();
  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<DecodedToken>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const validateInviteToken = async (token: string): Promise<DecodedToken> => {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      if (
        !decodedToken.organization ||
        !decodedToken.uid ||
        !decodedToken.email ||
        !decodedToken.scope
      ) {
        return Promise.reject(
          new Error("Invalid token: Missing required fields")
        );
      }
      const currentTime = Date.now() / 1000;
      if (decodedToken?.exp && decodedToken?.exp < currentTime) {
        return Promise.reject(new Error("Token has expired"));
      }
      return Promise.resolve(decodedToken);
    } catch (error) {
      return Promise.reject(new Error("Token validation failed"));
    }
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token")?.split("?to=")?.[0] || "";
    validateInviteToken(token)
      .then((data) => {
        setUserData(data);
        setToken(token);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [router]);
  const onSubmit = (data: any) => {
    if (data.password !== data.password2) {
      setError("password2", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    const { password2, ...dataWithoutPassword2 } = data;
    register({
      ...dataWithoutPassword2,
      token,
    });
  };
  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div className="min-w-[480px] rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark">
            <div className="w-full p-8">
              <div className="flex justify-between items-center mb-9">
                <h2 className="text-2xl font-bold text-black">
                  Activate your account
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-row space-x-4">
                    <FormControlWrapper
                      name="first_name"
                      control={control}
                      rules={{ required: "Please enter your first name!" }}
                      error={errors.first_name?.message?.toString()}
                    >
                      {(field) => (
                        <GeneralInput
                          {...field}
                          type={"text"}
                          label="First name"
                          required={true}
                          placeholder={"Enter your first name"}
                        />
                      )}
                    </FormControlWrapper>
                    <FormControlWrapper
                      name="last_name"
                      control={control}
                      rules={{ required: "Please enter your last name!" }}
                      error={errors.last_name?.message?.toString()}
                    >
                      {(field) => (
                        <GeneralInput
                          {...field}
                          type={"text"}
                          label="Last name"
                          placeholder={"Enter your last name"}
                        />
                      )}
                    </FormControlWrapper>
                  </div>
                  <FormControlWrapper name="organization" control={control}>
                    {(field) => (
                      <GeneralInput
                        {...field}
                        type={"text"}
                        label="Organization"
                        required={true}
                        value={userData?.organization}
                        disabled={true}
                      />
                    )}
                  </FormControlWrapper>
                  <FormControlWrapper name="email" control={control}>
                    {(field) => (
                      <GeneralInput
                        {...field}
                        type={"text"}
                        label="Email address"
                        value={userData?.email}
                        disabled={true}
                        required={true}
                        icon={<EmailIcon className="fill-current" />}
                      />
                    )}
                  </FormControlWrapper>
                  <FormControlWrapper
                    name="password"
                    control={control}
                    rules={{
                      required: "Please enter your password!",
                      validate: (value: string) => {
                        if (value.length < 8) {
                          return "Password must be at least 8 characters long";
                        }
                        if (!/\d/.test(value)) {
                          return "Password must include at least 1 number";
                        }
                        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                          return "Password must include at least 1 special character";
                        }
                        if (!/[A-Z]/.test(value)) {
                          return "Password must include at least 1 uppercase letter";
                        }
                        return true;
                      },
                    }}
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
                  <FormControlWrapper
                    name="password2"
                    control={control}
                    rules={{ required: "Please enter your password!" }}
                    error={errors.password2?.message?.toString()}
                  >
                    {(field) => (
                      <GeneralInput
                        {...field}
                        type={"password"}
                        label="Confirm password"
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
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
