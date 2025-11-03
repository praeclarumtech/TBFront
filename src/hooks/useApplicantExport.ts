import { useState, useCallback } from "react";
import saveAs from "file-saver";

import MESSAGES from "constants/messageConstants";
import toastify from "utils/toastify";

interface UseApplicantExportProps {
  exportApplicant: (params: any) => Promise<any>;
  onExportComplete?: () => void;
}

export const useApplicantExport = ({
  exportApplicant,
  onExportComplete,
}: UseApplicantExportProps) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exportOption, setExportOption] = useState("");
  const [exportableFields, setExportableFields] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportModalShow = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleExportModalClose = useCallback(() => {
    setShowExportModal(false);
    setExportOption("");
    setExportableFields([]);
  }, []);

  const handleConfirmExportModalShow = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const closeConfirmExportModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleExportOptionChange = useCallback((option: string) => {
    setExportOption(option);
    setExportableFields([]);
  }, []);

  const handleColumnSelected = useCallback((selectedOptions: any[]) => {
    setExportableFields(selectedOptions);
    setExportOption("");
  }, []);

  const handleExportExcel = useCallback(
    async (selectedApplicants: string[]) => {
      if (selectedApplicants.length === 0) {
        toastify(MESSAGES.ERROR.NO_RECORD_SELECTED.toString(), {
          type: "error",
        });
        return;
      }

      setIsExporting(true);

      try {
        const params = {
          ids: selectedApplicants,
          exportOption: exportOption,
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

        onExportComplete?.();
        setShowConfirmModal(false);
        handleExportModalClose();
      } catch (error: any) {
        toastify(
          error.response?.data?.message ||
            MESSAGES.ERROR.UNEXPECTED_JSON_RESPONSE_DURING_EXPORT.toString(),
          { type: "error" }
        );
      } finally {
        setIsExporting(false);
      }
    },
    [
      exportApplicant,
      exportOption,
      exportableFields,
      onExportComplete,
      handleExportModalClose,
    ]
  );

  return {
    // State
    showExportModal,
    showConfirmModal,
    exportOption,
    exportableFields,
    isExporting,

    // Handlers
    handleExportModalShow,
    handleExportModalClose,
    handleConfirmExportModalShow,
    closeConfirmExportModal,
    handleExportOptionChange,
    handleColumnSelected,
    handleExportExcel,
  };
};

export default useApplicantExport;
