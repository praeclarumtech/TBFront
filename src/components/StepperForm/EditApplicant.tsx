import React from "react";
import PersonalDetailsForm from "./PersonalDetailsForm";
import EducationalDetailsForm from "./EducationSkillsForm";
import JobDetailsForm from "./JobDetailsForm";
import { Button } from "@mui/material";

interface PreviewFormProps {
  data: {
    personal: unknown;
    education: unknown;
    job: unknown;
  };
  // onEdit: (step: number) => void;
  onSubmit: () => void;
}

const EditApplicant: React.FC<PreviewFormProps> = ({
  data,
  onEdit,
  onSubmit,
}) => {
  return (
    <div>
      <PersonalDetailsForm
        onNext={function (data: any): void {
          throw new Error("Function not implemented.");
        }}
        onCancel={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialValues={undefined}
      />

      <EducationalDetailsForm
        onNext={function (data: any): void {
          throw new Error("Function not implemented.");
        }}
        onBack={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialValues={undefined}
      />

      <JobDetailsForm
        onNext={function (data: any): void {
          throw new Error("Function not implemented.");
        }}
        onBack={function (): void {
          throw new Error("Function not implemented.");
        }}
        initialValues={undefined}
      />

      <div className="mb-3 ">
        <div className="mb-3 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            // onClick={() => onEdit(2)}
            type="submit"
            className="!bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 px-4 rounded"
          >
            Update
          </Button>
          <Button
            onClick={onSubmit}
            className="!bg-purple-600 font-bold text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 px-4 rounded"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditApplicant;
