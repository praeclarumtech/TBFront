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
        <h2 className="mb-4 text-xl font-semibold text-primary">
          AI-Powered Resume Scoring
        </h2>
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium">How It Works</h3>
          <ul className="pl-6 space-y-2 text-gray-700 list-disc">
            <li>Upload Resume & Job Description</li>
            <li>AI analyzes and scores your match</li>
            <li>Get insights and recommendations</li>
          </ul>
        </div>
        <img
          src="/images/image_job.png"
          alt="How it works"
          className="w-full h-[330px]"
        />
      </div>

      {/* Right Section */}
      <div className="p-6 bg-white shadow-md lg:w-1/2 rounded-xl">
        <h3 className="mb-4 text-lg font-semibold">
          Get Instant Job Specific Resume Score
        </h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Upload Your Resume (PDF or DOCX)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 pr-10 border rounded"
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
            {file && <p className="mt-1 text-sm text-gray-600">{file.name}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Paste or Upload Job Description (JD)
            </label>
            <textarea
              rows={4}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Paste the JD here..."
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium">
              Choose Job Description (JD) File (PDF, DOCX, TXT)
            </label>
            <input
              type="file"
              ref={jdFileInputRef}
              accept=".pdf,.docx,.txt"
              onChange={handleJdFileChange}
              className="w-full p-2 border rounded"
            />
            {jdFile && (
              <button
                onClick={handleRemoveFileJd}
                type="button"
                className="absolute text-lg font-bold text-red-500 -translate-y-1/2 right-2 top-1/2"
                title="Remove file"
              >
                &times;
              </button>
            )}
          </div>
          {jdFile && (
            <p className="mt-1 text-sm text-gray-600">{jdFile.name}</p>
          )}
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
