import React from 'react';
import BaseButton from "components/BaseComponents/BaseButton";
import { toast } from "react-toastify";

interface ActionButtonsProps {
  currentRole: string;
  selectedApplicants: string[];
  onDeleteAll: () => void;
  onSendEmail: () => void;
  onExportModalShow: () => void;
  onNavigate: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentRole,
  selectedApplicants,
  onDeleteAll,
  onSendEmail,
  onExportModalShow,
  onNavigate,
}) => {
  const handleActionWithPermission = (action: () => void) => {
    if (currentRole === "admin") {
      action();
    } else {
      toast.error(
        "Access denied you do not have permission to access this resource."
      );
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="d-md-none">
        {/* Conditional buttons for selected applicants */}
        {selectedApplicants.length > 0 && (
          <div className="flex gap-2 mb-2">
            <BaseButton
              className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={onDeleteAll}
            >
              <i className="ri-delete-bin-fill mr-1" />
              Delete
            </BaseButton>
            <BaseButton
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={onSendEmail}
            >
              <i className="ri-mail-close-line mr-1" />
              Email
            </BaseButton>
          </div>
        )}

        {/* Export and Add buttons */}
        <div className="flex gap-2">
          <BaseButton
            className="flex-1 px-3 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-800"
            onClick={() =>
              handleActionWithPermission(onExportModalShow)
            }
          >
            <i className="ri-upload-2-line mr-1" />
            Export
          </BaseButton>
          <BaseButton
            className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => handleActionWithPermission(onNavigate)}
          >
            <i className="ri-add-line mr-1" />
            Add
          </BaseButton>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="d-none d-md-flex justify-content-end align-items-center gap-2">
        {selectedApplicants.length > 0 && (
          <>
            <BaseButton
              className="border-0 btn bg-danger"
              onClick={onDeleteAll}
            >
              <i className="ri-delete-bin-fill" />
            </BaseButton>

            <BaseButton className="btn bg-primary" onClick={onSendEmail}>
              <i className="ri-mail-close-line" />
            </BaseButton>
          </>
        )}

        <BaseButton
          color="primary"
          className="bg-green-900 btn btn-soft-secondary edit-list"
          onClick={() =>
            handleActionWithPermission(onExportModalShow)
          }
        >
          <i className="ri-upload-2-line me-1" />
          Export
        </BaseButton>

        <BaseButton
          color="success"
          onClick={() => handleActionWithPermission(onNavigate)}
        >
          <i className="ri-add-line me-1" />
          Add
        </BaseButton>
      </div>
    </>
  );
};

export default ActionButtons;
