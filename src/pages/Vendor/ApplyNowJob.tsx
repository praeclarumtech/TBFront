import { Skeleton } from "antd";
import appConstants from "constants/constant";
import { useState, useRef, useEffect } from "react";
import React from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { viewJobById } from "api/apiJob";
import { errorHandle } from "utils/commonFunctions";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { addJobApplicant } from "api/apiVendor";

const { projectTitle } = appConstants;

const ApplyNowJob = () => {
  document.title = projectTitle;

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownToastId = useRef<React.ReactText | null>(null);
  const location = useLocation();
  const _id = location.state?.jobId;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = files[0];
    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx"].includes(ext || "")) {
      toast.error("Only PDF or DOCX files allowed.");
      return;
    }
    console.log("object");
    setFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setScore(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (countdownToastId.current) toast.dismiss(countdownToastId.current);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a resume file to score.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const response = await addJobApplicant(file, formData.job_id);
      if (response?.success) {
        setScore(response.data.score);
        toast.success("Resume scored successfully!");
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Skeleton active className="w-[800px]" />
      </div>
    );

  return (
    <div className="flex items-center justify-center flex-1 p-6 mt-10">
      <div className="p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
        <h1 className="mb-4 font-semibold text-center text-primary">
          Apply For Job: {formData?.job_subject}
        </h1>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label>
              Please read the job description before applying.{" "}
              <a className="text-blue-600 underline cursor-pointer">
                Click here
              </a>{" "}
              to view the job description.
            </label>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload Your Resume (PDF or DOCX)
            </label>

            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 pr-10 border rounded select-border"
              />
              {file && (
                <button
                  onClick={handleRemoveFile}
                  type="button"
                  className="absolute text-lg font-bold text-red-500 -translate-y-1/2 right-2 top-1/2"
                  title="Remove file"
                >
                  &times;
                </button>
              )}
            </div>
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
  );
};

export default ApplyNowJob;
