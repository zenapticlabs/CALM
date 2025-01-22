"use client";

import Loader from "@components/common/Loader";
import FormControlWrapper from "@components/Forms/FormControlWrapper";
import GeneralInput from "@components/Input/GeneralInput";
// import { realAPI_URL } from "@data/UtilData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  FormGroup
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.split("?to=")?.[0] || "";

  // Add error handling for token decoding
  let decodedToken: any = {};
  try {
    if (!token) {
      router.push("/link-expired");
      return null;
    }
    decodedToken = jwtDecode(token);
  } catch (error) {
    router.push("/link-expired");
    return null;
  }

  const firstName = decodedToken?.first_name;
  const lastName = decodedToken?.last_name;
  const email = decodedToken?.email;
  const link = decodedToken?.link;
  const [isLoading, setIsLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agree, setAgree] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });
  useEffect(() => {
    setValue("firstName", firstName);
    setValue("lastName", lastName);
    setValue("email", email);
  }, [firstName, lastName, email]);
  // Add email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    validateToken(token);
  }, [router]);

  const validateToken = async (token: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/validate-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
    } else {
      router.push("/link-expired");
    }
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    try {
      setAcceptLoading(true);
      const response = await fetch(`${API_URL}/accept-license`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
      }
      setAcceptLoading(false);
    } catch (error) {
      // Handle error
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isSuccess) {
    return (
      <div className="flex justify-center h-screen items-center nobody knows">
        <div className="py-10 bg-white rounded-lg px-16 mt-10">
          <div className="flex justify-center items-center flex-col">
            <div className="text-2xl text-green-500 pb-6">
              <CheckCircleIcon sx={{ fontSize: 60 }} />
            </div>
            <div className="text-xl text-[#10132b]">
              Thank you, you will receive an email with a license key shortly.
            </div>
            <div className="text-xl text-[#10132b]">
              You can close this page now.
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center h-screen items-center nobody knows">
      <div className="w-[600px] py-10 bg-white rounded-lg px-8 mt-10">
        <div className="text-2xl font-semibold text-[#10132b] mb-4">
          Read and Accept the Agreement
        </div>
        <div className="text-sm mb-6 text-black">
          Please review below contact information where further communications will be sent and update if changes are required:
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <FormControlWrapper
              name="firstName"
              control={control}
              rules={{
                required: "Please enter your first name!",
              }}
              error={errors.firstName?.message?.toString()}
            >
              {(field) => (
                <GeneralInput
                  {...field}
                  type={"text"}
                  label="First Name"
                  placeholder="Enter your first name"
                  required={true}
                  disabled={false}
                />
              )}
            </FormControlWrapper>
            <FormControlWrapper
              name="lastName"
              control={control}
              rules={{
                required: "Please enter your last name!",
              }}
              error={errors.lastName?.message?.toString()}
            >
              {(field) => (
                <GeneralInput
                  {...field}
                  type={"text"}
                  label="Last Name"
                  placeholder="Enter your last name"
                  required={true}
                  disabled={false}
                />
              )}
            </FormControlWrapper>
            <FormControlWrapper
              name="email"
              control={control}
              rules={{
                required: "Please enter your email!",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Please enter a valid email address!",
                },
              }}
              error={errors.email?.message?.toString()}
            >
              {(field) => (
                <GeneralInput
                  {...field}
                  type={"text"}
                  label="Email"
                  placeholder="Enter your email"
                  required={true}
                  disabled={false}
                />
              )}
            </FormControlWrapper>
            <FormGroup className="mt-2">
              <div className="flex items-start mt-3">
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <div>
                  <div className="text-sm text-[#10132b] mt-2.5">
                    I have read and accept the{" "}
                    <a href={link}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PaperStream Capture Agreement
                    </a>{" "}
                    <i className="text-xs">REQUIRED</i>
                  </div>
                </div>
              </div>
            </FormGroup>
            <LoadingButton
              type="submit"
              loading={acceptLoading}
              disabled={!agree}
              variant="contained"
              sx={{
                width: "100%",
                marginBottom: "20px",
                backgroundColor: "#4580FF",
              }}
            >
              Accept
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Page;
