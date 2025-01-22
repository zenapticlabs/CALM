import ArrowIcon from "@/assets/icons/arrow.svg?icon";
import { useBack, useCreate, useNavigation, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Contact } from "@/types/types";
import { useEffect } from "react";
import GenericForm from "@components/Forms/GenericForm";
import { Button } from "@mui/material";
import { sendEmailBtnStyle } from "@data/MuiStyles";
import { ContactFormFields } from "@components/Forms/Partners/ContactFormFields";
interface ContactFormProps {
  contact: Contact | null;
  partner_id: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, partner_id }) => {
  const { push } = useNavigation();
  const {
    control,
    trigger,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Contact>({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const previousContact = getValues();
    if (contact != null) {
      reset({
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone: contact.phone,
        email: contact.email,
        job_title: contact.job_title,
        renewal_notification: contact.renewal_notification,
        primary: contact.primary,
        active: contact.active,
      });
    } else {
      Object.keys(previousContact).forEach((key) => setValue(key, null));
    }
  }, [open]);

  const { mutate: updateContact } = useUpdate();
  const { mutate: createContact } = useCreate();

  const handleSubmit = async () => {
    const isValid = await trigger(); // Triggers validation for all fields

    if (isValid) {
      const payload = getValues();

      if (contact) {
        updateContact(
          {
            resource: `partners/${partner_id}/contacts`,
            id: `${contact?.contact_id}`,
            values: payload,
          },
          {
            onError: (error) => console.log("error", error),
            onSuccess: () => push(`/dashboard/partners/show?id=${partner_id}`),
          }
        );
      } else {
        createContact(
          {
            resource: `partners/${partner_id}/contacts`,
            values: payload,
          },
          {
            onError: (error) => console.log("error", error),
            onSuccess: () => push(`/dashboard/partners/show?id=${partner_id}`),
          }
        );
      }
    } else {
      console.log("Validation errors:", errors);
    }
  };
  return (
    <>
      <div className="flex items-center gap-3">
        <div>
          <button
            onClick={useBack()}
            className="inline-block p-2 rounded-xl border duration-500 border-transparent hover:border-black"
          >
            {" "}
            <ArrowIcon />
          </button>
        </div>
        <div className="py-8 !font-satoshi text-2xl font-semibold text-[#1f325c]">
          {contact ? "Edit Contact" : "Create Contact"}
        </div>
      </div>
      {/* {formLoading ? (
        <Loader />
      ) : ( */}
      <>
        <GenericForm
          {...{ control, errors, trigger }}
          fields={contact ? ContactFormFields.edit : ContactFormFields.create}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} sx={sendEmailBtnStyle}>
            Save
          </Button>
        </div>
      </>
      {/* )} */}
    </>
  );
};

export default ContactForm;
