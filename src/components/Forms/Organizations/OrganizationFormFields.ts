import { getRealFormFields } from "@utils/utilFunctions";
import { InitialFieldConfig } from "../InitialFieldConfig";

const OrganizationEditFormInitialFields: InitialFieldConfig[] = [
  {
    name: "organization_code",
    required: "text",
    disabled: true,
    size: 1,
  },
  {
    name: "organization_name",
    required: "text",
    size: 1,
  },
  {
    name: "address",
    size: 2,
  },
  {
    name: "country",
    size: 2,
    type: "dropdown",
    options: [
      { value: "United States", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "Japan", label: "Japan" },
    ],
  },
  {
    name: "active",
    type: "switch",
  },
  {
    name: "settings.add_all_customers_in_email",
    label: "Include Billing customer and Reseller in the CC of email",
    size: 2,
    type: "checkbox"
  },
];

const OrganizationCreateInitialFields: InitialFieldConfig[] = [
  {
    name: "organization_code",
    required: "text",
    size: 1,
  },
  {
    name: "organization_name",
    required: "text",
    size: 1,
  },
  {
    name: "address",
    size: 2,
  },
  {
    name: "country",
    size: 2,
    type: "dropdown",
    options: [
      { value: "United States", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "Japan", label: "Japan" },
    ],
  },
];

const OrganizationEditFormFields = getRealFormFields(
  OrganizationEditFormInitialFields
);
const OrganizationCreateFormFields = getRealFormFields(
  OrganizationCreateInitialFields
);

export { OrganizationCreateFormFields, OrganizationEditFormFields };
