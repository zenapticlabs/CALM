import React, { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { Email_Schedule, EmailTemplate } from "@/types/types";
import FormControlWrapper from "../FormControlWrapper";
import { useCreate, useList, useNavigation, useUpdate } from "@refinedev/core";
import { Button } from "@mui/material";
import { modalOkBtnStyle } from "@data/MuiStyles";
import Loader from "@components/common/Loader";
import MuiDatePicker from "@components/Input/MuiDatePicker";
import MuiTimePicker from "@components/Input/MuiTimePicker";
import MuiDropdown from "@components/Input/MuiDropdown";
import MuiSwitch from "@components/Input/MuiSwitch";

interface NotificationSchedulesComponentProps {
  emailSchedule?: Email_Schedule;
  onSave?: () => void;
}

const NotificationSchedulesComponent: React.FC<
  NotificationSchedulesComponentProps
> = ({ emailSchedule, onSave }) => {
  const { push } = useNavigation();
  const {
    control,
    reset,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm<Email_Schedule>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const {
    data: emailTemplatesData,
    isLoading: emailTemplatesLoading,
    refetch,
  } = useList<EmailTemplate>({
    resource: "email-templates",
    hasPagination: false,
  }) as {
    data: { data: EmailTemplate[] } | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  useEffect(() => {
    if (!emailTemplatesLoading && emailSchedule && emailTemplatesData?.data) {
      reset({ ...emailSchedule });
      const email_id = emailTemplatesData.data.find(
        (item) => item.name === emailSchedule?.email_template
      )?.email_id;
      setValue("email_template", email_id);
      if (emailSchedule.scheduled_time) {
        setValue("scheduled_date", emailSchedule?.scheduled_time.split("T")[0]); // Extracting only the date part
        setValue(
          "scheduled_time",
          emailSchedule.scheduled_time.split("T")[1].split("Z")[0]
        ); // Extracting only the date part
      }
    } else {
      setValue("recurring_task", "None");
    }
  }, [emailSchedule, emailTemplatesLoading, emailTemplatesData]);

  const { mutate } = useCreate();
  const { mutate: update } = useUpdate();
  const [sendNow, setSendNow] = useState(
    // emailSchedule?.send_now ? true : false
    false
  );
  const [recurring, setRecurring] = useState(
    emailSchedule?.is_recurring ? true : false
  );
  const [browserTimezone, setBrowserTimezone] = useState("");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setBrowserTimezone(timezone);
  }, []);

  const onSubmit = () => {
    const data = getValues();
    let isValid = true;
    if (!sendNow && !data.scheduled_time) {
      setError("scheduled_time", {
        type: "manual",
        message: "This field is required",
      });
      isValid = false;
    }
    if (!data.email_template) {
      setError("email_template", {
        type: "manual",
        message: "This field is required",
      });
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const payload = {
      email_template: data.email_template,
      active: data.active,
      user_timezone: browserTimezone,
      is_recurring: data.recurring_task != "None",
      send_now: sendNow,
      scheduled_time: sendNow
        ? new Date().toISOString().replace("T", " ").slice(0, 19)
        : data.scheduled_date + " " + data.scheduled_time,
      ...(data.recurring_task != "None" && {
        recurring_task: data.recurring_task,
      }),
    };

    if (emailSchedule) {
      update(
        {
          resource: "schedule",
          id: `${emailSchedule.id as string}`,
          values: payload,
        },
        {
          onError: () => {},
          onSuccess: () => {
            push("/dashboard/notification-schedules/list");
          },
        }
      );
    } else {
      mutate(
        {
          resource: "schedule",
          values: payload,
        },
        {
          onError: (error) => {},
          onSuccess: () => {
            push("/dashboard/notification-schedules/list");
          },
        }
      );
    }
  };

  const emailOptions = emailTemplatesData?.data?.map((item) => ({
    value: item.email_id,
    label: item.name,
  }));

  const options = [
    {
      value: "None",
      label: "None",
    },
    {
      value: "daily",
      label: "Daily",
    },
    {
      value: "weekly",
      label: "Weekly",
    },
    {
      value: "monthly",
      label: "Monthly",
    },
    {
      value: "yearly",
      label: "Yearly",
    },
  ];

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="py-8 !font-satoshi text-2xl font-semibold text-[#1f325c]">
          {emailSchedule
            ? "Edit Notification Schedule"
            : "Create Notification Schedule"}
        </div>
      </div>
      {emailTemplatesLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-8 bg-white p-10 shadow-card">
          <div className="flex flex-col">
            {/* <div className="flex items-center text-base gap-4 font-medium">
              <div className="w-36">Send Now?</div>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ mx: 1 }}
                    checked={sendNow}
                    onChange={() => setSendNow(!sendNow)}
                  />
                }
                label=""
              />
            </div> */}
            {/* <Collapse in={!sendNow}> */}
            <div className="flex gap-4">
              <div className="flex items-center gap-4">
                <FormControlWrapper
                  name="scheduled_date"
                  control={control}
                  rules={{ required: "Time is required" }}
                  error={errors.scheduled_date?.message?.toString()}
                >
                  {(field) => (
                    <MuiDatePicker
                      {...field}
                      id="scheduled_date"
                      label="Send Date"
                      required={true}
                    />
                  )}
                </FormControlWrapper>
              </div>
              <div className="flex items-center gap-4">
                <FormControlWrapper
                  name="scheduled_time"
                  control={control}
                  rules={{ required: "Time is required" }}
                  error={errors.scheduled_time?.message?.toString()}
                >
                  {(field) => (
                    <MuiTimePicker
                      {...field}
                      id="scheduled_time"
                      label="Send Time"
                      required={true}
                    />
                  )}
                </FormControlWrapper>
              </div>
            </div>
            {/* </Collapse> */}
          </div>
          {/* <div className="flex items-center text-base px-2 gap-4 font-medium">
            <div className="">Is this recurring?</div>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ mx: 1 }}
                  checked={recurring}
                  onChange={() => setRecurring(!recurring)}
                />
              }
              label=""
            />
          </div> */}
          {/* <Collapse in={recurring}> */}
          <FormControlWrapper
            name="recurring_task"
            control={control}
            rules={{ required: "Select an option" }}
            error={errors.recurring_task?.message?.toString()}
          >
            {(field) => (
              <MuiDropdown
                {...field}
                id="recurring_task"
                label="Recurring"
                required={true}
                type="dropdown"
                options={options}
              />
            )}
          </FormControlWrapper>
          {/* </Collapse> */}
          <FormControlWrapper
            name="email_template"
            control={control}
            rules={{ required: "Select an option" }}
            error={errors.email_template?.message?.toString()}
          >
            {(field) => (
              <MuiDropdown
                {...field}
                id="email_template"
                label="Email Template"
                required={true}
                type="dropdown"
                options={emailOptions}
              />
            )}
          </FormControlWrapper>
          <div className="flex">
            <div className="w-48">Active</div>
            <FormControlWrapper
              name="active"
              control={control}
              error={errors.active?.message?.toString()}
            >
              {(field) => (
                <MuiSwitch
                  {...field}
                  id="active"
                  label="Active"
                  required={true}
                />
              )}
            </FormControlWrapper>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={onSubmit} variant="contained" sx={modalOkBtnStyle}>
              {emailSchedule ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSchedulesComponent;
