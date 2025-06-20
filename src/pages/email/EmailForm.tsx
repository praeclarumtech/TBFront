/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useMounted } from "hooks/useMounted";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getEmailTemplateByType,
  sendEmail,
  viewEmailTemplate,
} from "api/emailApi";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "components/BaseComponents/BaseInput";
import appConstants from "constants/constant";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Label, Spinner } from "reactstrap";

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
    ["clean"],
  ],
};

const { projectTitle, Modules } = appConstants;

const EmailForm = () => {
  document.title = Modules.ComposeEmails + " | " + projectTitle;
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmailBcc = location.state?.email_bcc || "";

  const fromPage = location.state?.fromPage || "/email";
  // const initialName = location.state?.name || "";

  const [templateTypes, setTemplateTypes] = useState<SelectedOption[]>([]);
  const [showToTooltip, setShowToTooltip] = useState(false);
  const [showBccTooltip, setShowBccTooltip] = useState(false);
  const toTooltipRef = useRef<HTMLDivElement>(null);
  const bccTooltipRef = useRef<HTMLDivElement>(null);
  const [toInputFocused, setToInputFocused] = useState(false);
  const [bccInputFocused, setBccInputFocused] = useState(false);
  const getTemplateType = async () => {
    const response = await viewEmailTemplate({ limit: 1000 });
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

  function extractBase64Images(html: string) {
    const regex = /<img[^>]+src="(data:image\/[^;]+;base64[^"]+)"[^>]*>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html))) {
      matches.push(match[1]); // base64 string
    }
    return matches;
  }

  function base64ToFile(base64: string, filename: string) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const validation = useFormik({
    initialValues: {
      email_template: "",
      email_to: "talentboxhr5@gmail.com",
      email_bcc: initialEmailBcc || "",
      subject: "",
      description: "",
      sendQrCode: false,
    },
    validationSchema: Yup.object({
      email_to: Yup.string()
        .required("Recipient email is required")
        .test("valid-emails", "Invalid email address", (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const emails = value?.split(",").map((email) => email.trim());
          return emails?.every((email) => emailRegex.test(email));
        }),
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
      description: Yup.string().required("Description is required"),
      sendQrCode: Yup.boolean(),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const rawHtml = values.description;

        const base64Images = extractBase64Images(rawHtml);
        const attachments = base64Images.map((base64, index) => {
          const file = base64ToFile(base64, `image_${index + 1}.png`);
          return {
            file,
            cid: `image${index + 1}@cid`,
          };
        });

        let cleanedHtml = rawHtml;
        attachments.forEach((att) => {
          cleanedHtml = cleanedHtml.replace(
            /<img[^>]+src="data:image\/[^;]+;base64[^"]+"[^>]*>/,
            `<img src="cid:${att.cid}" alt="Image" />`
          );
        });
        const emailToArray = values.email_to
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0);

        const emailBccArray = values.email_bcc
          // ? values.email_bcc
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0);
        // : [];

        const formData = new FormData();

        emailToArray.forEach((email: string) => {
          formData.append("email_to[]", email);
        });

        emailBccArray.forEach((email: string) => {
          formData.append("email_bcc[]", email);
        });

        formData.append("subject", values.subject);
        formData.append("description", values.description);
        attachments.forEach((attachment) => {
          formData.append("attachments", attachment.file);
        });

        await sendEmail(formData, {
          params: { flag: values.sendQrCode.toString() },
        });

        toast.success("Email sent successfully!");
        validation.resetForm();
        setTimeout(() => {
          switch (fromPage) {
            case "/email":
              navigate("/email");
              break;
            case "/applicants":
              navigate("/applicants");
              break;
            case "/import-applicants":
              navigate("/import-applicants");
              break;
            default:
              navigate("/applicants"); // or any default fallback route
          }
        }, 3000);
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to send email. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      }
    },
  });

  // Click-away handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        toTooltipRef.current &&
        !toTooltipRef.current.contains(event.target as Node)
      ) {
        setShowToTooltip(false);
      }
      if (
        bccTooltipRef.current &&
        !bccTooltipRef.current.contains(event.target as Node)
      ) {
        setShowBccTooltip(false);
      }
    }
    if (showToTooltip || showBccTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToTooltip, showBccTooltip]);

  const renderToInputWithMore = () => {
    const arr = validation.values.email_to
      .split(",")
      .map((e: string) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const showMore = arr.length > 2;
    const displayEmails = showMore
      ? arr.slice(0, 2).join(", ") + ", "
      : arr.join(", ");
    return (
      <div style={{ position: "relative", marginBottom: 8 }}>
        <label className="block mb-1 font-medium">To</label>
        {toInputFocused || arr.length === 0 ? (
          <BaseInput
            name="email_to"
            className={`w-full p-2 rounded-md ${
              validation.touched.email_to && validation.errors.email_to
                ? "border-red-500 border-2"
                : ""
            }`}
            type="text"
            placeholder={InputPlaceHolder("Recipients")}
            handleChange={validation.handleChange}
            handleBlur={(e) => {
              validation.handleBlur(e);
              setToInputFocused(false);
            }}
            value={validation.values.email_to}
            error={
              typeof validation.errors.email_to === "string"
                ? validation.errors.email_to
                : undefined
            }
            touched={
              typeof validation.touched.email_to === "boolean"
                ? validation.touched.email_to
                : undefined
            }
          />
        ) : (
          <div
            style={{
              width: "100%",
              minHeight: 38,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "6px 12px",
              background: "#f9fafb",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              fontSize: 15,
              cursor: "text",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={() => setToInputFocused(true)}
            tabIndex={0}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayEmails}
            </span>
            {showMore && (
              <span
                style={{
                  color: "#1976d2",
                  cursor: "pointer",
                  marginLeft: 4,
                  textDecoration: "underline",
                  background: "#f9fafb",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToTooltip(!showToTooltip);
                }}
              >
                ...more
              </span>
            )}
          </div>
        )}
        {showToTooltip && (
          <div
            ref={toTooltipRef}
            style={{
              position: "absolute",
              top: 62,
              left: 0,
              width: 350,
              maxHeight: 200,
              zIndex: 9999,
              background: "#222",
              color: "#fff",
              borderRadius: 6,
              padding: "12px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              overflowY: "auto",
              whiteSpace: "normal",
              fontSize: 14,
            }}
          >
            {arr.map((e: string, i: number) => (
              <span key={i} style={{ display: "inline" }}>
                {e}
                {i !== arr.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBccInputWithMore = () => {
    const arr = validation.values.email_bcc
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const showMore = arr.length > 2;
    const displayEmails = showMore
      ? arr.slice(0, 2).join(", ") + ", "
      : arr.join(", ");
    return (
      <div style={{ position: "relative", marginBottom: 8 }}>
        <label className="block mb-1 font-medium">Bcc</label>
        {bccInputFocused || arr.length === 0 ? (
          <BaseInput
            name="email_bcc"
            className={`w-full p-2 rounded-md ${
              validation.touched.email_bcc && validation.errors.email_bcc
                ? "border-red-500 border-2"
                : ""
            }`}
            type="text"
            placeholder={InputPlaceHolder("Emails")}
            handleChange={validation.handleChange}
            handleBlur={(e) => {
              validation.handleBlur(e);
              setBccInputFocused(false);
            }}
            value={validation.values.email_bcc}
            error={
              typeof validation.errors.email_bcc === "string"
                ? validation.errors.email_bcc
                : undefined
            }
            touched={
              typeof validation.touched.email_bcc === "boolean"
                ? validation.touched.email_bcc
                : undefined
            }
          />
        ) : (
          <div
            style={{
              width: "100%",
              minHeight: 38,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "6px 12px",
              background: "#f9fafb",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              fontSize: 15,
              cursor: "text",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={() => setBccInputFocused(true)}
            tabIndex={0}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayEmails}
            </span>
            {showMore && (
              <span
                style={{
                  color: "#1976d2",
                  cursor: "pointer",
                  marginLeft: 4,
                  textDecoration: "underline",
                  background: "#f9fafb",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBccTooltip(!showBccTooltip);
                }}
              >
                ...more
              </span>
            )}
          </div>
        )}
        {showBccTooltip && (
          <div
            ref={bccTooltipRef}
            style={{
              position: "absolute",
              top: 62,
              left: 0,
              width: 350,
              maxHeight: 200,
              zIndex: 9999,
              background: "#222",
              color: "#fff",
              borderRadius: 6,
              padding: "12px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              overflowY: "auto",
              whiteSpace: "normal",
              fontSize: 14,
            }}
          >
            {arr.map((e: string, i: number) => (
              <span key={i} style={{ display: "inline" }}>
                {e}
                {i !== arr.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mt-6 mx-9">
        <div className="w-100">
          <div className="bg-white rounded-lg shadow">
            <div className="relative p-8">
              <button
                className="absolute flex items-center text-gray-600 left-5 top-5 hover:text-gray-800"
                // onClick={() =>
                //   // navigate(fromPage === "/applicants" ? "/applicants" : "/email")
                //   navigate(fromPage)
                // }
                onClick={() => {
                  switch (fromPage) {
                    case "/email":
                      navigate("/email");
                      break;
                    case "/applicants":
                      navigate("/applicants");
                      break;
                    case "/import-applicants":
                      navigate("/import-applicants");
                      break;
                    default:
                      navigate("/email"); // or any default fallback route
                  }
                }}
              >
                <i className="mr-2 fa fa-arrow-left"></i>
                Back
              </button>
              <div className="justify-center mt-1 mb-3 text-center ">
                <h4 className="text-base font-bold">Send Email to Applicant</h4>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div>
                  <i className="text-5xl fa fa-envelope text-primary"></i>
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

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>{renderToInputWithMore()}</div>
                      <div>{renderBccInputWithMore()}</div>
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

                    <div className="mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sendQrCode"
                          name="sendQrCode"
                          checked={validation.values.sendQrCode}
                          onChange={validation.handleChange}
                          className="w-4 h-4 mr-2 border-gray-300 rounded text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="sendQrCode"
                          className="text-sm font-medium text-gray-700"
                        >
                          Include QR Code in Email
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                      <button
                        type="submit"
                        disabled={validation.isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-primary hover:bg-primary-dark disabled:opacity-50"
                      >
                        {validation.isSubmitting ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Loading...
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
    </>
  );
};

export default EmailForm;
