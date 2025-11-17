import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewJobById } from "api/apiJob";
import { Skeleton } from "antd";
import { errorHandle } from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { Container } from "reactstrap";

const DetailedJob = () => {
  const { id: _id } = useParams();
  const location = useLocation();
  const isFromAppliedJob = location.state?.from === "/appliedJobList";
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const token = localStorage.getItem("authUser");
  const isLoggedIn = !!token && token !== "undefined" && token.trim() !== "";

  const handleNavigate = () => {
    // navigate("/Vendor/applyNow");
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } }); // 👈 Or your specific login route
    } else {
      navigate("/Vendor/applyNow", { state: { jobId: formData._id } });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl px-4">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  if (!formData) return null;

  return (
    <Container fluid className="py-4 ">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h1
                  className="text-2xl font-bold text-gray-900 mb-1"
                  dangerouslySetInnerHTML={{
                    __html: formData.job_subject,
                  }}
                />
                <p className="text-sm text-gray-600">
                  Job Details & Requirements
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-5">
            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Location */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formData.job_location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Job Type */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Job Type
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formData.job_type || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Salary */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Salary
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formData.min_salary && formData.max_salary
                      ? `${formData.salary_currency || ""} ${
                          formData.min_salary
                        } - ${formData.max_salary}`
                      : formData.min_salary
                      ? `${formData.salary_currency || ""} ${
                          formData.min_salary
                        }+`
                      : "Not specified"}
                  </p>
                  {formData.salary_frequency && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formData.salary_frequency}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience */}
              {formData.min_experience && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Experience
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formData.min_experience} years
                    </p>
                  </div>
                </div>
              )}

              {/* Deadline */}
              {formData.application_deadline &&
                !isNaN(new Date(formData.application_deadline).getTime()) && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Deadline
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(
                          formData.application_deadline
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

              {/* Time Zone */}
              {formData.time_zone && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Time Zone
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formData.time_zone}
                    </p>
                  </div>
                </div>
              )}

              {/* Contract Duration */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Contract Duration
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formData.contract_duration || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {formData.start_time && formData.end_time && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Working Hours
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formData.start_time} - {formData.end_time}
                  </p>
                </div>
              )}
              {formData.createdAt &&
                !isNaN(new Date(formData.createdAt).getTime()) && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Posting Date
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(formData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
            </div>

            {/* Required Skills */}
            {formData.required_skills &&
              formData.required_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.required_skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Job Description */}
            {formData.sub_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job Description
                </h3>
                <div
                  className="ql-editor text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formData.sub_description,
                  }}
                />
              </div>
            )}

            {/* Job Details */}
            {formData.job_details && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job Details
                </h3>
                <div
                  className="ql-editor text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formData.job_details,
                  }}
                />
              </div>
            )}

            {/* Apply Button */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <BaseButton
                color="primary"
                className="px-8 py-3 text-base font-semibold !flex items-center justify-center gap-2"
                onClick={handleNavigate}
                disabled={isFromAppliedJob}
              >
                {isFromAppliedJob ? (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Applied
                  </>
                ) : (
                  <>
                    Apply Now
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DetailedJob;
