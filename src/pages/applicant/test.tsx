import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { importApplicant } from "path-to-importApplicant-function"; // import your importApplicant function here
import BasePopUpModal from "path-to-BasePopUpModal"; // import the modal component here
import { fetchApplicants } from "path-to-fetchApplicants-function"; // if needed, import your fetchApplicants function

const ImportApplicantComponent = () => {
  const [importLoader, setImportLoader] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExtension || "")) {
      toast.error("Please upload a valid CSV or Excel file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Large file detected. Import may take a few minutes.");
    }

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      // Assuming IMPORT_APPLICANT is 'applicants/importCsv/yes'
      const response = await importApplicant(formData, {
        onUploadProgress: (progressEvent: { loaded: number; total: any }) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      if (response?.success) {
        toast.success(response?.message || "File imported successfully!");

        // Check if there are existing applicants to be updated
        const duplicateEmails = response?.duplicateEmails || []; // Make sure the backend sends this list
        if (duplicateEmails.length > 0) {
          setShowPopupModal(true);
          setDuplicateEmails(duplicateEmails); // Save the duplicate emails for the modal
        } else {
          await fetchApplicants(); // If no duplicates, just fetch new applicants
        }
      } else {
        throw new Error(response?.message || "Import failed");
      }
    } catch (error: any) {
      console.error("Import error:", error);

      if (error.response?.data) {
        const errorMessage =
          error.response.data.message || error.response.data.error;
        toast.error(errorMessage || "Failed to import file");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during import");
      }
    } finally {
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleModalConfirm = async () => {
    const formData = new FormData();
    // Assuming you have the file to re-submit with "update=yes" flag
    // If not, you'll need to handle the re-upload separately, for now it's a placeholder.
    await importApplicant(formData, {
      params: { update: "yes" },
    });

    setShowPopupModal(false);
    await fetchApplicants(); // After update, fetch the applicants again
  };

  const handleModalCancel = () => {
    setShowPopupModal(false);
  };

  return (
    <div>
      {/* File Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv, .xlsx, .xls"
        onChange={handleFileImport}
      />

      {isImporting && (
        <div>
          <p>Importing...</p>
          <progress value={importProgress} max={100} />
        </div>
      )}

      {/* Pop-up Modal to confirm update for duplicates */}
      <BasePopUpModal
        isOpen={showPopupModal}
        onRequestClose={() => setShowPopupModal(false)}
        title="Duplicate Records Detected"
        message="The following records already exist in the system:"
        items={duplicateEmails}
        confirmAction={handleModalConfirm}
        cancelAction={handleModalCancel}
        confirmText="Yes, Update"
        cancelText="No, Don't Update"
        disabled={false}
      />
    </div>
  );
};

export default ImportApplicantComponent;


export const IMPORT_APPLICANT = "applicants/importCsv"; // Define the base endpoint

export const importApplicant = async (
  formData: FormData,
  updateFlag: "yes" | "no", // This allows passing the update flag as a parameter
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }
) => {
  const url = `${IMPORT_APPLICANT}/${updateFlag}`; // Dynamically build the URL with the update flag

  try {
    const response = await authServices.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
      timeout: 300000, // 5 minutes
    });

    return response?.data; // Return the data received from the server
  } catch (error) {
    console.error("Error in importApplicant:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate the file as before...

  setImportLoader(true);
  setIsImporting(true);
  setImportProgress(0);

  try {
    const formData = new FormData();
    formData.append("csvFile", file);

    // You can either hardcode "yes" or "no" based on the user's choice
    const updateFlag = "yes"; // or "no"

    const response = await importApplicant(formData, updateFlag, {
      onUploadProgress: (progressEvent: { loaded: number; total: any }) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        );
        setImportProgress(progress);
      },
    });

    if (response?.success) {
      toast.success(response?.message || "File imported successfully!");

      // Handle duplicates as needed
      const duplicateEmails = response?.duplicateEmails || [];
      if (duplicateEmails.length > 0) {
        setShowPopupModal(true);
        setDuplicateEmails(duplicateEmails);
      } else {
        await fetchApplicants(); // If no duplicates, fetch new applicants
      }
    } else {
      throw new Error(response?.message || "Import failed");
    }
  } catch (error: any) {
    console.error("Import error:", error);
    toast.error(error.message || "Failed to import file");
  } finally {
    setImportLoader(false);
    setIsImporting(false);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};


export const importApplicant = async (
  formData: FormData,
  updateFlag: "yes" | "no", // Expecting a string 'yes' or 'no' directly
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }
) => {
  const url = `${IMPORT_APPLICANT}/${updateFlag}`; // Dynamically append the updateFlag to the URL

  try {
    const response = await authServices.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
      timeout: 300000, // 5 minutes
    });

    return response?.data;
  } catch (error) {
    console.error("Error in importApplicant:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const importApplicant = async (
  formData: FormData,
  updateFlag: "yes" | "no", // Expecting a string 'yes' or 'no' directly
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }
) => {
  const url = `${IMPORT_APPLICANT}/${updateFlag}`; // Dynamically append the updateFlag to the URL

  try {
    const response = await authServices.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
      timeout: 300000, // 5 minutes
    });

    return response?.data;
  } catch (error) {
    console.error("Error in importApplicant:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
await importApplicant(formData, "yes", {
  onUploadProgress: (progressEvent: { loaded: number; total: any }) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / (progressEvent.total || 100)
    );
    setImportProgress(progress);
  },
}); await importApplicant(formData, { params: { update: "yes" } });



export const importApplicantCsv = async (req, res) => {
  try {
    // Accept "yes" or "no" for updating existing records
    const updateFlag = req.params.update === "yes";
    console.log(
      "Update flag (should be true if you want to update):",
      updateFlag
    );

    uploadCv(req, res, async (err) => {
      if (err) {
        return HandleResponse(
          res,
          false,
          StatusCodes.BAD_REQUEST,
          `${Message.FAILED_TO} upload CSV`
        );
      }
      if (!req.file) {
        return HandleResponse(
          res,
          false,
          StatusCodes.BAD_REQUEST,
          `${Message.FAILED_TO} upload CSV - No file provided`
        );
      }

      const results = [];
      let headers = [];
      fs.createReadStream(req.file.path)
        .pipe(csvParser({ headers: false, skipEmptyLines: true }))
        .on("data", (row) => {
          if (headers.length === 0) {
            headers = Object.values(row);
          } else {
            const formattedRow = {};
            Object.values(row).forEach((value, i) => {
              formattedRow[headers[i]] = value;
            });
            results.push(formattedRow);
          }
        })
        .on("end", async () => {
          try {
            const processedApplicants = await Promise.all(
              results.map(processCsvRow)
            );
            const validApplicants = processedApplicants.filter(
              (applicant) => applicant !== null
            );

            if (validApplicants.length === 0) {
              return HandleResponse(
                res,
                false,
                StatusCodes.BAD_REQUEST,
                "No valid applicants found in CSV"
              );
            }

            // Convert emails to lowercase for consistent comparison
            const emails = validApplicants.map((applicant) =>
              applicant.email.trim().toLowerCase()
            );
            console.log("Extracted Emails from CSV:", emails);

            // Use Set to remove duplicates and then find existing applicants
            const uniqueEmails = [...new Set(emails)];
            const existingApplicants = await Applicant.find({
              email: { $in: uniqueEmails },
            });
            const existingEmails = new Set(
              existingApplicants.map((app) => app.email.trim().toLowerCase())
            );
            console.log("Existing Emails in DB:", [...existingEmails]);

            // Separate new and existing records
            const toInsert = validApplicants.filter(
              (applicant) =>
                !existingEmails.has(applicant.email.trim().toLowerCase())
            );
            console.log("To Insert ===>", toInsert);

            const toUpdate = validApplicants.filter((applicant) =>
              existingEmails.has(applicant.email.trim().toLowerCase())
            );
            console.log("To Update ===>", toUpdate);

            // Insert new records
            if (toInsert.length > 0) {
              const insertOperations = toInsert.map((applicant) => ({
                insertOne: { document: applicant },
              }));
              await Applicant.bulkWrite(insertOperations);
            }
            if (toUpdate.length > 0) {
              if (updateFlag) {
                const updateOperations = toUpdate.map((applicant) => ({
                  updateOne: {
                    filter: { email: applicant.email.trim().toLowerCase() },
                    update: { $set: applicant },
                    upsert: true,
                  },
                }));
                await Applicant.bulkWrite(updateOperations);
              } else {
                return HandleResponse(
                  res,
                  false,
                  StatusCodes.CONFLICT,
                  "Duplicate records found",
                  { existingEmails: toUpdate.map((record) => record.email) }
                );
              }
            }

            fs.unlinkSync(req.file.path);

            return HandleResponse(
              res,
              true,
              StatusCodes.OK,
              "CSV imported successfully",
              {
                insertedNewRecords: toInsert,
                updatedRecords: updateFlag
                  ? toUpdate.map((record) => record.email)
                  : [],
              }
            );
          } catch (dbError) {
            console.log("Error while saving to DB:", dbError);
            return HandleResponse(
              res,
              false,
              StatusCodes.INTERNAL_SERVER_ERROR,
              dbError.message
            );
          }
        })
        .on("error", (error) => {
          return HandleResponse(
            res,
            false,
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Error reading CSV file"
          );
        });
    });
  } catch (error) {
    console.log("Last catch block error:", error);
    return HandleResponse(
      res,
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${Message.FAILED_TO} import CSV`
    );
  }
};