/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ReactNode } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { MailOutlined } from "@ant-design/icons";
import BaseInput from "components/BaseComponents/BaseInput";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import appEnv from "config/appEnv";
import {
  getPublicCities,
  getPublicQualifications,
  getPublicStates,
  submitTrainingApplication,
} from "api/trainingApplicationApi";
import { listTrainingTechnologies } from "api/trainingTechnologyApi";
import appConstants from "constants/constant";
import {
  APPLICANT_TYPE_OPTIONS,
  DURATION_OPTIONS,
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  SEMESTER_OPTIONS,
} from "./options";

const { projectTitle, Modules } = appConstants;

type Option = { label: string; value: string };

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  email: "",
  technology: "",
  qualification: "",
  collegeName: "",
  semester: "",
  duration: "15 Days",
  interestedFor: "",
  gender: "",
  applicantType: "",
  state: "",
  city: "",
  address: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required."),
  middleName: Yup.string().trim(),
  lastName: Yup.string().trim().required("Last name is required."),
  phone: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")
    .required("Contact number is required."),
  email: Yup.string()
    .trim()
    .test(
      "email-optional",
      "Enter a valid email id.",
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
  technology: Yup.string().trim(),
  qualification: Yup.string().trim(),
  collegeName: Yup.string().trim(),
  semester: Yup.string().trim(),
  duration: Yup.string().required("Duration is required."),
  interestedFor: Yup.string().required("Select online, offline, or hybrid."),
  gender: Yup.string().required("Gender is required."),
  applicantType: Yup.string().required("Select student, employee, or other."),
  state: Yup.string().trim().required("State is required."),
  city: Yup.string().trim().required("City is required."),
  address: Yup.string().trim().required("Address is required."),
});

const TrainingForm = () => {
  document.title = (Modules.TrainingForm || "Application form") + " | " + projectTitle;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [technologies, setTechnologies] = useState<Option[]>([]);
  const [qualifications, setQualifications] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [stateId, setStateId] = useState("");

  const validation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await submitTrainingApplication({
          name: {
            firstName: values.firstName.trim(),
            middleName: values.middleName.trim(),
            lastName: values.lastName.trim(),
          },
          countryCode: "+91",
          phone: values.phone.trim(),
          email: values.email.trim(),
          technology: values.technology,
          interestedFor: values.interestedFor,
          qualification: values.qualification.trim(),
          collegeName: values.collegeName.trim(),
          semester: values.semester,
          duration: values.duration,
          gender: values.gender,
          applicantType: values.applicantType,
          state: values.state,
          city: values.city,
          address: values.address.trim(),
        });
        if (response?.success) {
          setSubmitted(true);
          resetForm();
          setStateId("");
          setCities([]);
        } else {
          toast.error(response?.message || "Unable to submit the form.");
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        toast.error(
          details?.[0] ||
            error?.response?.data?.message ||
            "Unable to submit the form."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [technologyBody, stateBody] = await Promise.all([
          listTrainingTechnologies({ page: 1, limit: 1000 }),
          getPublicStates(),
        ]);
        const technologyList = technologyBody?.data?.data || [];
        setTechnologies(
          technologyList
            .map((item: any) => ({
              label: item.name,
              value: item.name,
            }))
            .filter((item: Option) => item.label)
        );
        const stateList = stateBody?.data?.item || [];
        setStates(
          stateList.map((item: any) => ({
            label: item.state_name,
            value: item._id,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    loadOptions();
    getPublicQualifications()
      .then((qualificationBody) => {
        setQualifications(
          (qualificationBody?.data?.data || [])
            .map((item: any) => ({
              label: item.degree,
              value: item.degree,
            }))
            .filter((item: Option) => item.label)
        );
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      setCityLoading(false);
      return;
    }
    let cancelled = false;
    const loadCities = async () => {
      setCityLoading(true);
      try {
        const cityBody = await getPublicCities(stateId);
        if (cancelled) return;
        const cityList = cityBody?.data?.item || [];
        setCities(
          cityList.map((item: any) => ({
            label: item.city_name,
            value: item.city_name,
          }))
        );
      } catch (error) {
        console.error(error);
        if (!cancelled) setCities([]);
      } finally {
        if (!cancelled) setCityLoading(false);
      }
    };
    loadCities();
    return () => {
      cancelled = true;
    };
  }, [stateId]);

  const selectValue = (options: Option[], value: string) =>
    options.find((option) => option.value === value) || null;

  const fieldError = (name: keyof typeof initialValues) =>
    validation.touched[name] && validation.errors[name]
      ? String(validation.errors[name])
      : "";

  if (submitted) {
    return (
      <PageFrame>
        <div className="training-form-card training-form-success">
          <div className="training-form-check">✓</div>
          <h1>Application submitted</h1>
          <p>Thank you. Your training application has been received.</p>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <form
        className="training-form-card"
        onSubmit={validation.handleSubmit}
        noValidate
      >
        <div className="training-form-body">
          <div className="training-form-grid">
              <div className="training-field">
                <BaseInput
                  label="First name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  isRequired
                  value={validation.values.firstName}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  touched={!!validation.touched.firstName}
                  error={fieldError("firstName")}
                />
              </div>
              <div className="training-field">
                <BaseInput
                  label="Last name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  isRequired
                  value={validation.values.lastName}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  touched={!!validation.touched.lastName}
                  error={fieldError("lastName")}
                />
              </div>

            <div className="training-field">
              <label className="training-label" htmlFor="phone">
                Contact Number <span>*</span>
              </label>
              <div className={`training-phone ${fieldError("phone") ? "is-invalid" : ""}`}>
                <div className="training-phone-code">
                  +91 <span aria-hidden>🇮🇳</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your contact number"
                  value={validation.values.phone}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
                    validation.setFieldValue("phone", digits);
                  }}
                  onBlur={validation.handleBlur}
                />
              </div>
              {fieldError("phone") && (
                <div className="training-error">{fieldError("phone")}</div>
              )}
            </div>
            <div className="training-field">
              <BaseInput
                label="Email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={validation.values.email}
                handleChange={validation.handleChange}
                handleBlur={validation.handleBlur}
                touched={!!validation.touched.email}
                error={fieldError("email")}
                isRequired
              />
            </div>
            <div className="training-field">
              <BaseSelect
                label="Gender"
                name="gender"
                isRequired
                placeholder="Select gender"
                options={GENDER_OPTIONS}
                value={selectValue(GENDER_OPTIONS, validation.values.gender)}
                handleChange={(option: Option | null) =>
                  validation.setFieldValue("gender", option?.value || "")
                }
                handleBlur={() => validation.setFieldTouched("gender", true)}
                touched={!!validation.touched.gender}
                error={fieldError("gender")}
              />
            </div>
            <div className="training-field">
              <BaseSelect
                label="Student / Employee / Other"
                name="applicantType"
                isRequired
                placeholder="Select one"
                options={APPLICANT_TYPE_OPTIONS}
                value={selectValue(
                  APPLICANT_TYPE_OPTIONS,
                  validation.values.applicantType
                )}
                handleChange={(option: Option | null) =>
                  validation.setFieldValue("applicantType", option?.value || "")
                }
                handleBlur={() => validation.setFieldTouched("applicantType", true)}
                touched={!!validation.touched.applicantType}
                error={fieldError("applicantType")}
              />
            </div>

            <div className="training-field">
              <BaseSelect
                label="Technology"
                name="technology"
                placeholder="Select a technology"
                options={technologies}
                value={selectValue(technologies, validation.values.technology)}
                handleChange={(option: Option | null) =>
                  validation.setFieldValue("technology", option?.value || "")
                }
                handleBlur={() => validation.setFieldTouched("technology", true)}
              />
            </div>
          

            <div className="training-field">
              <BaseSelect
                label="Qualification"
                name="qualification"
                placeholder="Select your qualification"
                options={qualifications}
                value={selectValue(qualifications, validation.values.qualification)}
                handleChange={(option: Option | null) =>
                  validation.setFieldValue("qualification", option?.value || "")
                }
                handleBlur={() => validation.setFieldTouched("qualification", true)}
              />
            </div>
            <div className="training-field">
              <BaseInput
                label="College Name"
                name="collegeName"
                type="text"
                placeholder="Enter your college name"
                value={validation.values.collegeName}
                handleChange={validation.handleChange}
                handleBlur={validation.handleBlur}
              />
            </div>
            <div className="training-field">
              <BaseSelect
                label="Semester"
                name="semester"
                placeholder="Select your semester"
                options={SEMESTER_OPTIONS}
                value={selectValue(SEMESTER_OPTIONS, validation.values.semester)}
                handleChange={(option: Option | null) =>
                  validation.setFieldValue("semester", option?.value || "")
                }
                handleBlur={() => validation.setFieldTouched("semester", true)}
              />
            </div>

            <div className="training-field">
              {states.length > 0 ? (
                <BaseSelect
                  label="State"
                  name="state"
                  isRequired
                  placeholder="Select state"
                  options={states}
                  value={states.find((option) => option.label === validation.values.state) || null}
                  handleChange={(option: Option | null) => {
                    validation.setFieldValue("state", option?.label || "");
                    validation.setFieldValue("city", "");
                    setStateId(option?.value || "");
                  }}
                  handleBlur={() => validation.setFieldTouched("state", true)}
                  touched={!!validation.touched.state}
                  error={fieldError("state")}
                />
              ) : (
                <BaseInput
                  label="State"
                  name="state"
                  type="text"
                  isRequired
                  placeholder="Enter your state"
                  value={validation.values.state}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  touched={!!validation.touched.state}
                  error={fieldError("state")}
                />
              )}
            </div>

            <div className="training-field">
              {states.length > 0 && (cityLoading || cities.length > 0) ? (
                <BaseSelect
                  label="City"
                  name="city"
                  isRequired
                  placeholder={cityLoading ? "Loading cities..." : "Select city"}
                  options={cities}
                  value={selectValue(cities, validation.values.city)}
                  handleChange={(option: Option | null) =>
                    validation.setFieldValue("city", option?.value || "")
                  }
                  handleBlur={() => validation.setFieldTouched("city", true)}
                  touched={!!validation.touched.city}
                  error={fieldError("city")}
                  isDisabled={!validation.values.state || cityLoading}
                />
              ) : (
                <BaseInput
                  label="City"
                  name="city"
                  type="text"
                  isRequired
                  placeholder="Enter your city"
                  value={validation.values.city}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  touched={!!validation.touched.city}
                  error={fieldError("city")}
                />
              )}
            </div>

            <div className="training-field training-span-2">
              <label className="training-label" htmlFor="address">
                Address <span>*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                placeholder="Enter your address"
                value={validation.values.address}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                className={fieldError("address") ? "is-invalid" : ""}
              />
              {fieldError("address") && (
                <div className="training-error">{fieldError("address")}</div>
              )}
            </div>

            <div className="training-field training-span-2">
              <div className="training-label">
                Duration <span>*</span>
              </div>
              <div className="training-duration">
                {DURATION_OPTIONS.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="duration"
                      value={option.value}
                      checked={validation.values.duration === option.value}
                      onChange={validation.handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="training-help">
                Choose the training duration that best fits your plan.
              </p>
              {fieldError("duration") && (
                <div className="training-error">{fieldError("duration")}</div>
              )}
            </div>

            <div className="training-field training-span-2">
              <div className="training-label">
                Interested for <span>*</span>
              </div>
              <div className="training-duration">
                {INTEREST_OPTIONS.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="interestedFor"
                      value={option.value}
                      checked={validation.values.interestedFor === option.value}
                      onChange={validation.handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {fieldError("interestedFor") && (
                <div className="training-error">{fieldError("interestedFor")}</div>
              )}
            </div>
          </div>

          <div className="training-form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </div>
      </form>
    </PageFrame>
  );
};

const PageFrame = ({ children }: { children: ReactNode }) => (
  <div className="training-form-page">
    <header className="training-form-topbar">
      <img
        src={`${import.meta.env.BASE_URL}logo/logo.png`}
        alt="Talent Box"
      />
    </header>
    <div className="training-form-wrap">
      {children}
      <div className="training-assist">
        <div className="training-assist-title">
          <MailOutlined />
          <strong>Need Assistance?</strong>
        </div>
        <p>
          Experiencing technical difficulties or unable to complete the form?
          Please send your CV or describe your issue directly to our careers
          team at{" "}
          <a href={`mailto:${appEnv.CAREER_EMAIL}`}>{appEnv.CAREER_EMAIL}</a>.
          We will respond at the earliest.
        </p>
      </div>
      <p className="training-powered">
        Powered by {projectTitle}{" "}
        <span>© {new Date().getFullYear()} {projectTitle}</span>
      </p>
    </div>
    <FormStyles />
  </div>
);

const FormStyles = () => (
  <style>{`
    .training-form-page {
      min-height: 100vh;
      background: #f5f7fb;
      padding: 0 0 28px;
    }
    .training-form-topbar {
      background: #e6f4ff;
      border-bottom: 1px solid #d6e8f8;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 14px 16px;
    }
    .training-form-topbar img {
      height: 60px;
      width: auto;
      object-fit: contain;
    }
    .training-form-wrap {
      width: min(1200px, calc(100% - 32px));
      margin: 24px auto 0;
    }
    .training-form-card {
      width: 100%;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      overflow: visible;
    }
    .training-form-body { padding: 22px 24px 24px; }
    .training-form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px 22px;
      align-items: start;
    }
    .training-span-2 { grid-column: 1 / -1; }
    .training-field {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .training-field > .form-label,
    .training-field > .training-label {
      display: flex;
      align-items: flex-end;
      min-height: 40px;
      margin-bottom: 6px;
      line-height: 1.3;
    }
    .training-span-2 > .form-label,
    .training-span-2 > .training-label {
      min-height: 0;
      align-items: center;
    }
    .training-field .form-control,
    .training-field .select-border,
    .training-field .relative {
      width: 100%;
    }
    .training-form-card .form-control {
      height: 42px;
      border-radius: 10px;
      border-color: #d1d5db;
    }
    .training-form-card div.select-border [class*="-control"] {
      min-height: 42px !important;
      height: 42px !important;
      border-radius: 10px !important;
      border-color: #d1d5db !important;
    }
    .training-form-card .training-multi div.select-border [class*="-control"] {
      height: auto !important;
    }
    .training-multi [class*="-ValueContainer"] {
      max-height: none !important;
      overflow: visible !important;
    }
    .training-label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #374151;
    }
    .training-label span, .form-label .text-red-500 { color: #e11d48; }
    .training-phone {
      display: flex;
      align-items: stretch;
      height: 42px;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    .training-phone.is-invalid { border-color: #dc3545; }
    .training-phone-code {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      background: #f3f4f6;
      color: #111827;
      border-right: 1px solid #d1d5db;
      white-space: nowrap;
    }
    .training-phone input {
      flex: 1;
      border: 0;
      outline: none;
      padding: 10px 12px;
      min-width: 0;
    }
    .training-form-card textarea {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 10px 12px;
      resize: vertical;
    }
    .training-form-card textarea.is-invalid { border-color: #dc3545; }
    .training-duration {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    .training-duration label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
      font-weight: 500;
      color: #111827;
    }
    .training-duration label:last-child { border-bottom: 0; }
    .training-duration input { width: 16px; height: 16px; accent-color: #1d4ed8; }
    .training-help { margin: 8px 2px 0; color: #6b7280; font-size: 14px; }
    .training-error { color: #dc3545; font-size: 13px; margin-top: 4px; }
    .training-form-actions { display: flex; justify-content: flex-end; margin-top: 22px; }
    .training-form-actions button, .training-form-success button {
      background: #5b4dff;
      color: #fff;
      border: 0;
      border-radius: 8px;
      padding: 10px 22px;
      font-weight: 600;
      min-width: 180px;
    }
    .training-assist {
      margin-top: 16px;
      background: #e6f4ff;
      border-radius: 8px;
      border-left: 4px solid #1677ff;
      padding: 14px 16px;
    }
    .training-assist-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      color: #111827;
    }
    .training-assist p {
      margin: 0;
      color: #4b5563;
      font-size: 14px;
      line-height: 1.5;
    }
    .training-assist a { color: #1677ff; font-weight: 600; text-decoration: none; }
    .training-powered {
      margin: 22px 0 4px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      font-weight: 600;
    }
    .training-powered span { font-weight: 400; }
    .training-form-actions button:disabled { opacity: 0.7; }
    .training-form-success {
      text-align: center;
      padding: 56px 24px;
    }
    .training-form-check {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: #e0e7ff;
      color: #1e3a8a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
    }
    .training-form-success h1 { font-size: 24px; margin-bottom: 8px; }
    .training-form-success p { color: #4b5563; margin-bottom: 20px; }
    @media (max-width: 767px) {
      .training-field > .form-label,
      .training-field > .training-label {
        min-height: 0;
      }
    }
    @media (min-width: 768px) {
      .training-form-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (min-width: 1100px) {
      .training-form-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
      .training-duration {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .training-duration label {
        border-bottom: 0;
        border-right: 1px solid #e5e7eb;
      }
      .training-duration label:last-child { border-right: 0; }
    }
  `}</style>
);

export default TrainingForm;
