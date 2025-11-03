/**
 * Export Modal Component for Applicant Data
 * Handles export functionality with different options (Resume, CSV, Both)
 */

import React, { useState } from "react";
import { Row } from "react-bootstrap";
import saveAs from "file-saver";

import BaseModal from "components/BaseComponents/BaseModal";
import ConfirmModal from "components/BaseComponents/BaseConfirmModal";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import appConstants from "constants/constant";
import MESSAGES from "constants/messageConstants";
import toastify from "utils/toastify";

const { exportableFieldOption } = appConstants;

interface ExportModalProps {
  show: boolean;
  onClose: () => void;
  selectedApplicants: string[];
  onExportComplete: () => void;
  exportApplicant: (params: any) => Promise<any>;
}

const ExportModal: React.FC<ExportModalProps> = ({
  show,
  onClose,
  selectedApplicants,
  onExportComplete,
  exportApplicant,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exportOption, setExportOption] = useState("");
  const [exportableFields, setExportableFields] = useState<SelectedOption[]>(
    []
  );
  const [modelLoading, setModelLoading] = useState(false);

  const handleExportOptionChange = (option: string) => {
    setExportOption(option);
    setExportableFields([]);
  };

  const handleColumnSelected = (selectedOptions: SelectedOption[]) => {
    setExportableFields(selectedOptions);
    setExportOption("");
  };

  const handleConfirmExportModalShow = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmExportModal = () => {
    setShowConfirmModal(false);
  };

  const handleExportExcel = async (option: string) => {
    if (selectedApplicants.length === 0) {
      toastify(MESSAGES.ERROR.NO_RECORD_SELECTED.toString(), { type: "error" });
      return;
    }

    setModelLoading(true);

    try {
      const params = {
        ids: selectedApplicants,
        exportOption: option,
        exportableFields: exportableFields.map((field) => field.value),
      };

      const response = await exportApplicant(params);
      const text = await response.text();

      try {
        const parsed = JSON.parse(text);
        if (parsed.success) {
          toastify(MESSAGES.SUCCESS.APPLICANT_EXPORTED.toString(), {
            type: "success",
          });
        } else {
          toastify(
            parsed.message || MESSAGES.ERROR.OPERATION_FAILED.toString(),
            {
              type: "error",
            }
          );
        }
      } catch {
        const blob = new Blob([text], { type: "text/csv" });
        saveAs(blob, "Main_Applicants_Data.csv");
        toastify(MESSAGES.SUCCESS.FILE_DOWNLOADED_SUCCESSFULLY.toString(), {
          type: "success",
        });
      }

      onExportComplete();
      setShowConfirmModal(false);
    } catch (error: any) {
      toastify(
        error.response?.data?.message ||
          MESSAGES.ERROR.UNEXPECTED_JSON_RESPONSE_DURING_EXPORT.toString(),
        { type: "error" }
      );
    } finally {
      setModelLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setExportOption("");
    setExportableFields([]);
  };

  const ModalTitle = () => (
    <div className="d-flex align-items-center">
      <i className="ri-upload-2-line me-2"></i>
      <span>Export Applicants</span>
    </div>
  );

  return (
    <>
      <ConfirmModal
        show={showConfirmModal}
        loader={modelLoading}
        onYesClick={() => handleExportExcel(exportOption)}
        onCloseClick={closeConfirmExportModal}
        flag={false}
      />

      <BaseModal
        show={show}
        onSubmitClick={handleConfirmExportModalShow}
        onCloseClick={handleCancel}
        loader={false}
        submitButtonText="Export"
        closeButtonText="Close"
        setShowBaseModal={setShowConfirmModal}
        modalTitle={<ModalTitle />}
        children={
          <div>
            <Row>
              <div>
                <h5>Select export option:</h5>
                {["Resume", "Csv", "both"].map((option) => (
                  <div key={option}>
                    <input
                      className="m-2"
                      type="radio"
                      id={option}
                      name="exportOption"
                      disabled={
                        exportableFields.length > 0 ||
                        selectedApplicants.length > 0
                      }
                      checked={exportOption === option}
                      onChange={() => handleExportOptionChange(option)}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
                {exportOption && exportableFields.length === 0 && (
                  <button
                    className="mt-2 btn btn-sm btn-outline-secondary"
                    onClick={() => setExportOption("")}
                  >
                    Reset Export Option
                  </button>
                )}
              </div>
            </Row>

            <Row className="mt-4">
              <div>
                <h5>Select columns to export:</h5>
                <CheckboxMultiSelect
                  name="exportableFields"
                  options={exportableFieldOption}
                  value={exportableFields}
                  onChange={handleColumnSelected}
                  placeholder="Select columns..."
                  isDisabled={exportOption !== ""}
                />
                {exportableFields.length > 0 && (
                  <button
                    className="mt-2 btn btn-sm btn-outline-secondary"
                    onClick={() => setExportableFields([])}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </Row>

            {selectedApplicants.length > 0 && (
              <Row className="mt-3">
                <div className="alert alert-info">
                  <i className="ri-information-line me-2"></i>
                  {selectedApplicants.length} applicant(s) selected for export
                </div>
              </Row>
            )}
          </div>
        }
      />
    </>
  );
};

export default ExportModal;
