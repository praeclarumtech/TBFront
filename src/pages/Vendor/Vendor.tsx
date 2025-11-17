/* eslint-disable @typescript-eslint/no-explicit-any */

import { message } from "antd";
import appConstants from "constants/constant";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { getJobScore } from "api/apiVendor";

const { projectTitle } = appConstants;

const Vendor = () => {
  document.title = projectTitle;

  const [file, setFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>("");

  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingJd, setIsDraggingJd] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef<React.ReactText | null>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    setFile(null);
    setJdFile(null);
    setJdText("");
    setScore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB in bytes
        // alert("File size should not exceed 5MB.");
        toast.warning("File size should not exceed 5MB.");
        e.target.value = ""; // Clear the input
        return;
      }
      setFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.warning("File size should not exceed 5MB.");
        return;
      }
      const validExtensions = [".pdf", ".docx"];
      const fileExtension = droppedFile.name
        .substring(droppedFile.name.lastIndexOf("."))
        .toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleJdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB in bytes
        // alert("File size should not exceed 5MB.");
        toast.warning("File size should not exceed 5MB.");
        e.target.value = ""; // Clear the input
        return;
      }
      setJdFile(file);
    }
  };

  const handleDragOverJd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingJd(true);
  };

  const handleDragLeaveJd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingJd(false);
  };

  const handleDropJd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingJd(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.warning("File size should not exceed 5MB.");
        return;
      }
      const validExtensions = [".pdf", ".docx", ".txt"];
      const fileExtension = droppedFile.name
        .substring(droppedFile.name.lastIndexOf("."))
        .toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        setJdFile(droppedFile);
      } else {
        toast.error("Please upload a PDF, DOCX, or TXT file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFileJd = () => {
    setJdFile(null);
    if (jdFileInputRef.current) {
      jdFileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      message.error("Please upload a resume file.");
      return;
    }

    if (!jdText && !jdFile) {
      message.error("Please paste or upload a job description.");
      return;
    }

    try {
      setLoading(true);

      const result = await getJobScore(
        file ?? undefined,
        jdFile ?? undefined,
        jdText
      );

      if (result?.success) {
        setScore(result.data.score);
        toast.success(result?.message || "Resume scored successfully!");
      } else {
        toast.error(result?.message || "Failed to get score.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 lg:flex-row">
      {/* Left Section */}
      <div className="p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
        <h2 className="mb-4 text-xl font-bold text-primary">
          AI-Powered Resume Scoring
        </h2>
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-bold">How It Works</h3>
          <ul className="pl-6 space-y-2 text-gray-700 list-disc">
            <li>Upload Resume & Job Description</li>
            <li>AI analyzes and scores your match</li>
            <li>Get insights and recommendations</li>
          </ul>
        </div>
        <img
          src="images/image_job.png"
          alt="How it works"
          className="w-full h-[330px] rounded-xl"
        />
      </div>

      {/* Right Section */}
      <div className="p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
        <h2 className="mb-4 text-xl font-bold">
          Get Instant Job Specific Resume Scoreimage.png
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-base font-semibold text-gray-800">
              <span className="mr-4">Step 1</span>Upload Your Resume (PDF or
              DOCX)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-blue-50"
                  : "border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <svg
                      className="w-10 h-10 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  {file ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        {file.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <p className="text-base text-gray-600">
                      Drop your resume here or click to upload (PDF / DOCX)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block mb-3 text-base font-semibold text-gray-800">
              <span className="mr-4">Step 2</span>Paste or Upload Job
              Description (JD)
            </label>

            {/* Textarea Section */}
            <div className="mb-1">
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Paste Job Description
              </label>
              <textarea
                rows={3}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                placeholder="Paste the JD here..."
              />
            </div>
            {/* File Upload Section */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-800">
                Upload File
              </label>
              <div
                className={`relative border border-dashed rounded-md py-2 px-3 cursor-pointer transition-all duration-200 ${
                  isDraggingJd
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 bg-white hover:border-primary hover:bg-blue-50/30"
                }`}
                onDragOver={handleDragOverJd}
                onDragLeave={handleDragLeaveJd}
                onDrop={handleDropJd}
                onClick={() => jdFileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={jdFileInputRef}
                  accept=".pdf,.docx,.txt"
                  onChange={handleJdFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2.5">
                  {jdFile ? (
                    <>
                      <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {jdFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(jdFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFileJd();
                        }}
                        type="button"
                        className="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                        title="Remove file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">
                          Drop file here or click to upload
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded bg-primary"
            disabled={loading}
          >
            {loading ? "Scoring..." : "Get Your JobScore"}
          </button>

          {score !== null && (
            <div className="mt-4 text-lg font-semibold text-green-600">
              Your JobScore: {score}%
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Vendor;
