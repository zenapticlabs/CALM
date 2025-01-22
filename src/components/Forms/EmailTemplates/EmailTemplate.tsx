import React, { useEffect, useRef, useState } from "react";
import { EmailTemplate } from "@/types/types";
import GeneralInput from "@components/Input/GeneralInput";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import FormControlWrapper from "../FormControlWrapper";
import Dropdown from "@components/Input/Dropdown";
import ErrorIcon from '@mui/icons-material/Error';

interface EmailTemplateComponentProps {
  template: EmailTemplate | null;
  control: any;
  errors: any;
  watch: any;
  reset: any;
  setEmailBody: any;
}

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: "off",
  detectIndentation: false,
  tabSize: 2,
};

const handleEditorDidMount = (editor: any, monaco: any) => {
  monaco.editor.defineTheme("custom-theme", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: { "editor.background": "#dfe6ec" },
  });
  monaco.editor.setTheme("custom-theme");
};

const EmailTemplateComponent: React.FC<EmailTemplateComponentProps> = ({
  template,
  control,
  errors,
  watch,
  reset,
  setEmailBody,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>(template?.body || "");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const updateIframeContent = () => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  };
  const onEmailBodyChange = (value: string) => {
    setEmailBody(value);
    setHtmlContent(value);
  };

  const type = watch("type");
  const [requireEventType, setRequireEventType] = React.useState<boolean>(
    template?.type === "event"
  );
  useEffect(() => {
    setRequireEventType(type === "event");
    if (type === "scheduled") {
      reset((prevValues: any) => ({
        ...prevValues,
        type,
        event_type: template?.event_type || "",
      }));
    }
  }, [type, reset, template]);

  useEffect(() => {
    updateIframeContent();
  }, [htmlContent]);

  const VariableBadge = ({ text }: { text: string }) => (
    <span className="text-[0.6rem] bg-[#d5dce3] rounded-full py-0.5 px-2">{`{${text}}`}</span>
  );


  return (
    <Accordion
      elevation={0}
      disableGutters
      expanded={true}
      sx={{
        // border: "1px solid #d7dde4",
        borderBottom: "1",
        pt: "6px",
        "&::before": { display: "none" },
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
      }}
    >
      <AccordionDetails>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <div className="flex flex-col gap-4 w-full py-2 px-2">
          <FormControlWrapper
            name="subject"
            control={control}
            rules={{ required: "Subject is required" }}
            error={errors.subject?.message?.toString()}
          >
            {(field) => (
              <GeneralInput
                {...field}
                id="subject"
                label="Subject"
                type="text"
                required={true}
                defaultValue={template?.subject}
              />
            )}
          </FormControlWrapper>
          <div className="pl-2 mt-1 text-[0.75rem]">
            Available placeholder parameters:{" "}
            <VariableBadge text="partner_name" />,{" "}
            <VariableBadge text="partner_firstname" />,{" "}
            <VariableBadge text="partner_lastname" />,{" "}
            <VariableBadge text="product_name" />,{" "}
            <VariableBadge text="license_code" />
          </div>
          <FormControlWrapper
            name="from_email"
            control={control}
            rules={{ required: "From email is required" }}
            error={errors.from_email?.message?.toString()}
          >
            {(field) => (
              <GeneralInput
                {...field}
                id="from_email"
                label="From"
                type="text"
                required={true}
                defaultValue={template?.from_email}
              />
            )}
          </FormControlWrapper>
          <FormControlWrapper
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            error={errors.description?.message?.toString()}
          >
            {(field) => (
              <GeneralInput
                {...field}
                id="description"
                label="Description"
                type="text"
                required={true}
                defaultValue={template?.description}
              />
            )}
          </FormControlWrapper>
          <FormControlWrapper name="cc" control={control}>
            {(field) => (
              <GeneralInput
                {...field}
                id="cc"
                label="CC"
                type="text"
                defaultValue={template?.cc}
              />
            )}
          </FormControlWrapper>
          <FormControlWrapper name="bcc" control={control}>
            {(field) => (
              <GeneralInput
                {...field}
                id="bcc"
                label="BCC"
                type="text"
                defaultValue={template?.bcc}
              />
            )}
          </FormControlWrapper>
          <div className="grid grid-cols-2 gap-4 w-full">
            <FormControlWrapper
              name="type"
              control={control}
              rules={{ required: "Type is required" }}
              error={errors.type?.message?.toString()}
            >
              {(field) => (
                <Dropdown
                  {...field}
                  id="type"
                  label="Type"
                  type="dropdown"
                  required={true}
                  defaultValue={template?.type}
                  options={[
                    { value: "event", label: "Event" },
                    { value: "scheduled", label: "Scheduled" },
                  ]}
                />
              )}
            </FormControlWrapper>
            <FormControlWrapper
              name="event_type"
              control={control}
              rules={requireEventType && { required: "Event type is required" }}
              error={requireEventType && errors.event_type?.message?.toString()}
            >
              {(field) => (
                <Dropdown
                  {...field}
                  id="event_type"
                  label="Event Type"
                  type="dropdown"
                  defaultValue={template?.event_type}
                  disabled={!requireEventType}
                  required={requireEventType}
                  options={[
                    { value: "user_invited", label: "User Invited" },
                    { value: "license_created", label: "License Created" },
                    { value: "license_revoked", label: "License Revoked" },
                    { value: "license_renewed", label: "License Renewed" },
                    { value: "terms_and_conditions", label: "Terms and Conditions" },
                  ]}
                />
              )}
            </FormControlWrapper>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <FormControlWrapper
              name="product_type"
              control={control}
            >
              {(field) => (
                <Dropdown
                  {...field}
                  id="product_type"
                  label="Product Type"
                  type="dropdown"
                  defaultValue={template?.product_type}
                  resource="lookups/PRODUCT_TYPE/values"
                  valueKey="value"
                  labelKey="value"
                  selectNoneOption={true}
                />
              )}
            </FormControlWrapper>
            <FormControlWrapper name="product_family" control={control}>
              {(field) => (
                <GeneralInput
                  {...field}
                  id="product_family"
                  label="Product Family"
                  type="text"
                  defaultValue={template?.product_family}
                />
              )}
            </FormControlWrapper>
          </div>
          <div className="flex flex-col">
            <div className="bg-[#dfe6ec] rounded-t-lg border-r-ful font-medium text-sm p-4 text-[#0000009c]">
              Body(HTML)
            </div>
            <div className="px-2 py-2 mb-2 bg-[#fdedef] text-black flex gap-2 items-center text-sm">
              <span className="text-[#ef4d61] pb-0.5"><ErrorIcon /></span>
              Please avoid using {'<style>'} tags within this HTML template. Instead, use inline CSS only
            </div>
            <Editor
              defaultValue={template?.body}
              height="500px"
              defaultLanguage="html"
              options={editorOptions}
              theme="custom-theme"
              onMount={handleEditorDidMount}
              onChange={(value) => onEmailBodyChange(value as string)}
            />
            <div className="pl-2 mt-1 text-[0.75rem]">
              Available placeholder parameters:{" "}
              <VariableBadge text="partner_name" />,{" "}
              <VariableBadge text="partner_firstname" />,{" "}
              <VariableBadge text="partner_lastname" />,{" "}
              <VariableBadge text="product_name" />,{" "}
              <VariableBadge text="license_code" />,{" "}
              <VariableBadge text="terms_and_conditions_link" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="bg-[#dfe6ec] rounded-t-lg border-r-ful font-medium text-sm p-4 text-[#0000009c]">
              HTML Preview
            </div>
            <div className="flex-grow p-4 bg-white">
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                style={{ width: "100%", height: "500px", border: "none" }}
              />
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default EmailTemplateComponent;