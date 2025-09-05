import React, { useState, useEffect, Fragment } from "react";
import { Upload, message, Skeleton } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { InboxOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import appConstants from "constants/constant";
import BaseButton from "components/BaseComponents/BaseButton";
import { viewJobById } from "api/apiJob";
import { errorHandle } from "utils/commonFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addJobApplicant } from "api/apiVendor";
import ViewJd from "./ViewJd";

const { Dragger } = Upload;
const { projectTitle } = appConstants;

const ApplyNowJob = () => {
  document.title = projectTitle;

  const navigate = useNavigate();
  const location = useLocation();
  const _id = location.state?.jobId;

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [applied, setApplied] = useState(false);

  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!_id) return;
      setLoading(true);
      try {
        const res = await viewJobById({ _id });
        if (res?.success) {
          setFormData(res.data);
        }
      } catch (err) {
        errorHandle(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a resume file first.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const response = await addJobApplicant(file, formData.job_id);
      if (response?.success) {
        setApplied(true);
        setScore(response.data.applicant.score);
        toast.success(response?.message || "Resume scored successfully!");
      } else {
        throw new Error(response?.message || "Scoring failed");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Unexpected error.";
      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  const handlApplied = () => {
    navigate("/Vendor/appliedJobList");
  };

  const handleView = (id: string[]) => {
    console.log("id is:-", id);
    setSelectedId(id);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf,.doc,.docx",
    fileList,
    beforeUpload(file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isAllowedType = ["pdf", "doc", "docx"].includes(ext || "");
      const isUnderSizeLimit = file.size <= 5 * 1024 * 1024;

      if (!isAllowedType) {
        message.error("Only PDF, DOC, or DOCX files are allowed.");
        return Upload.LIST_IGNORE;
      }

      if (!isUnderSizeLimit) {
        message.error("File size must be 5MB or less.");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto-upload
    },
    onChange(info) {
      const incomingList = info.fileList;

      if (incomingList.length > 1) {
        message.error("Only one file can be uploaded.");
        setFileList([]);
        setFile(null);
        return;
      }

      const selected = incomingList[0]?.originFileObj;
      if (selected) {
        setFileList([incomingList[0]]);
        setFile(selected); // ✅ Here’s your line
        message.success(`${incomingList[0].name} selected.`);
      } else {
        setFileList([]);
        setFile(null);
      }
    },
    onRemove() {
      setFileList([]);
      setFile(null);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Skeleton active className="w-[800px]" />
      </div>
    );

  return (
    <Fragment>
      {showViewModal && selectedId && (
        <ViewJd
          show={showViewModal}
          onHide={handleCloseModal}
          _id={selectedId}
        />
      )}
      <div className="flex items-center justify-center flex-1 p-6 ">
        <div className="p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-medium text-blue-600 underline"
          >
            <ArrowLeftOutlined /> Back
          </button>

          <h1 className="mb-4 font-semibold text-center text-primary">
            Apply For Job: {formData?.job_subject}
          </h1>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label>
                Please read the job description before applying.{" "}
                <a
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => handleView(formData?._id)}
                >
                  Click here
                </a>{" "}
                to view the job description.
              </label>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Upload Your Resume (PDF or DOCX)
              </label>

              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">PDF, DOC, DOCX only. Max 5MB.</p>
              </Dragger>
            </div>

            {uploading && (
              <div className="w-full mt-2">
                <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="h-full transition-all bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-center text-gray-600">
                  Scoring... {progress}%
                </p>
              </div>
            )}

            {score === null && (
              <div className="flex justify-center mt-4">
                <BaseButton
                  type="submit"
                  className="px-4 py-2 text-white rounded bg-primary"
                  disabled={uploading}
                >
                  {uploading ? "Scoring..." : "Get Your JobScore"}
                </BaseButton>
              </div>
            )}

            {applied && (
              <div className="flex justify-center mt-4">
                <BaseButton
                  type="button"
                  className="px-4 py-2 text-white rounded bg-primary"
                  onClick={handlApplied}
                >
                  View Applied Application
                </BaseButton>
              </div>
            )}

            {score !== null && (
              <div className="mt-4 text-lg font-semibold text-center text-green-600">
                Your JobScore:{" "}
                <span className="inline-block px-3 py-1 ml-2 text-white bg-green-500 rounded-full">
                  {score}%
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ApplyNowJob;
