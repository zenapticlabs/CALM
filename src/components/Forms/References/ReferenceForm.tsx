import { Reference } from "../../../types/types";
import { GenericFormProps } from "../FormControlWrapper";
// import ReferenceFormFields from "./ReferenceFormFields";

export type ReferenceFormProps = GenericFormProps & {
  reference?: Reference;
};

const ReferenceForm = (props: GenericFormProps) => {
  return (
    <div className="px-4">
      {/* <GenericForm {...{ ...props, fields: ReferenceFormFields }} /> */}
    </div>
  );
};

export default ReferenceForm;
