/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useMounted } from "hooks/useMounted";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getEmailTemplateByType,
  sendEmail,
  viewEmailTemplate,
} from "api/emailApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "components/BaseComponents/BaseInput";
import appConstants from "constants/constant";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Label } from "reactstrap";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const { projectTitle, Modules } = appConstants;

const EmailForm = () => {
  document.title = Modules.ComposeEmails + " | " + projectTitle;
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email_to || "";
  const initialName = location.state?.name || "";

  const [templateTypes, setTemplateTypes] = useState<SelectedOption[]>([]);

  const getTemplateType = async () => {
    const response = await viewEmailTemplate();
    const types = response.data.templates.map((template: any) => template.type);
    return types;
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getTemplateType();
        const mappedTypes = types.map((type: string) => ({
          label: type,
          value: type,
        }));
        setTemplateTypes(mappedTypes);
      } catch (error) {
        console.error("Error fetching template types:", error);
      }
    };

    fetchTypes();
    validation.validateForm();
  }, []);

  const handleTemplateChange = async (selectedOption: SelectedOption) => {
    const selectedType = selectedOption?.value;
    validation.setFieldValue("email_template", selectedType);

    if (selectedType) {
      try {
        const templateData = await getEmailTemplateByType(selectedType);

        validation.setFieldValue(
          "description",
          templateData.data.description || ""
        );
        validation.setFieldValue("subject", templateData.data.subject || "");
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    } else {
      validation.setFieldValue("description", "");
      validation.setFieldValue("subject", "");
    }
  };

  const validation = useFormik({
    initialValues: {
      email_template: "",
      email_to: initialEmail || "",
      email_bcc: "",
      subject: "",
      description: "",
      name: initialName || "",
    },
    validationSchema: Yup.object({
      email_to: Yup.string()
        .test("valid-emails", "Invalid email address", (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const emails = value?.split(",").map((email) => email.trim());
          return emails?.every((email) => emailRegex.test(email));
        })
        .required("Recipient email is required"),

      email_bcc: Yup.string().test(
        "valid-emails",
        "Invalid email address",
        (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const emails = value.split(",").map((email) => email.trim());
          return emails.every((email) => emailRegex.test(email));
        }
      ),

      subject: Yup.string().required("Subject is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      //  toast.success("Email sent successfully!");
      try {
        const emailToArray = values.email_to
          .split(",")
          .map((email: string) => email.trim());
        const emailBccArray = values.email_bcc
          .split(",")
          .map((email) => email.trim());

        await sendEmail({
          ...values,
          email_to: emailToArray,
          email_bcc: emailBccArray,
        });
        toast.success("Email sent successfully!");
        validation.resetForm();
        setTimeout(() => {
          navigate("/email");
        }, 3000);
      } catch (err) {
        toast.error("Failed to send email. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
        errorHandle(err);
      }
    },
  });

  useEffect(() => {
    validation.validateForm();
  }, []);

  return (
    <>
      <div className="mt-6 mx-9">
        <div className="w-100">
          <div className="bg-white rounded-lg shadow">
            <div className="p-8 relative">
              <button
                className="absolute left-5 top-5 text-gray-600 hover:text-gray-800 flex items-center"
                onClick={() => navigate("/email")}
              >
                <i className="fa fa-arrow-left mr-2"></i>
                Back
              </button>

              <div className="flex justify-center items-center mb-6">
                <div>
                  <i className="fa fa-envelope text-5xl text-primary"></i>
                </div>
              </div>

              <div>
                {hasMounted && (
                  <form onSubmit={validation.handleSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <BaseSelect
                          label="Select Email Template"
                          name="email_template"
                          className="select-border"
                          options={templateTypes}
                          placeholder={InputPlaceHolder("Email Template")}
                          handleChange={handleTemplateChange}
                          handleBlur={validation.handleBlur}
                          value={
                            dynamicFind(
                              templateTypes,
                              validation.values.email_template
                            ) || ""
                          }
                          touched={validation.touched.email_template}
                          error={validation.errors.email_template}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <BaseInput
                          label="To"
                          name="email_to"
                          className={`w-full p-2 rounded-md ${
                            validation.touched.email_to &&
                            validation.errors.email_to
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                          type="text"
                          placeholder={InputPlaceHolder("Recipients")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email_to}
                          title={validation.values.email_to}
                        />
                      </div>
                      <div>
                        <BaseInput
                          label="Bcc"
                          name="email_bcc"
                          className={`w-full p-2 rounded-md ${
                            validation.touched.email_bcc &&
                            validation.errors.email_bcc
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                          type="text"
                          placeholder={InputPlaceHolder("Emails")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email_bcc}
                          error={validation.errors.email_bcc}
                          touched={validation.touched.email_bcc}
                        />
                        {/* {validation.touched.email_bcc &&
                          validation.errors.email_bcc && (
                            <div className="text-red-500 text-sm mt-1">
                              {validation.errors.email_bcc}
                            </div>
                          )} */}
                      </div>
                    </div>

                    <div className="mb-3">
                      <BaseInput
                        label="Subject"
                        name="subject"
                        type="text"
                        className={`w-full p-2 rounded-md ${
                          validation.touched.subject &&
                          validation.errors.subject
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                        placeholder={InputPlaceHolder("Your Subject")}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.subject}
                        error={validation.errors.subject}
                        touched={validation.touched.subject}
                      />
                      {/* {validation.touched.subject &&
                        validation.errors.subject && (
                          <div className="text-red-500 text-sm mt-1">
                            {validation.errors.subject}
                          </div>
                        )} */}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description" className="form-label">
                        Description
                      </Label>
                      <ReactQuill
                        className="bg-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[300px]"
                        theme="snow"
                        value={validation.values.description}
                        onChange={(content) =>
                          validation.setFieldValue("description", content)
                        }
                        onBlur={() =>
                          validation.setFieldTouched("description", true)
                        }
                        modules={quillModules}
                      />
                    </div>

                    <div className="flex justify-end items-center gap-4">
                      <button
                        type="submit"
                        disabled={validation.isSubmitting}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
                      >
                        {validation.isSubmitting ? (
                          <>
                            Loading... <i className="fa fa-spinner fa-spin"></i>
                          </>
                        ) : (
                          <>
                            Send <i className="fa fa-paper-plane"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default EmailForm;
