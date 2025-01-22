import { getRealFormFields } from "@utils/utilFunctions";
import { InitialFieldConfig } from "../InitialFieldConfig";

const InitialField: InitialFieldConfig[] = [
  {
    name: "password",
    label: "Current Password",
    required: "password",
    type: "password",
    size: 2,
  },
  {
    name: "password1",
    label: "New Password",
    required: "password",
    type: "password",
    size: 2,
  },
  {
    name: "password2",
    label: "Confirm Password",
    required: "password",
    type: "password",
    size: 2,
  },
];

export default getRealFormFields(InitialField);
