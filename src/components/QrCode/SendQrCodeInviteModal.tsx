/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import { sendQrCodeInvite } from "api/qrCodeApi";
import { viewEmailTemplate, getEmailTemplateByType } from "api/emailApi";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import { SelectedOption } from "interfaces/applicant.interface";

interface SendQrCodeInviteModalProps {
  show: boolean;
  onHide: () => void;
  inviteType: "vendor" | "client";
}

const SendQrCodeInviteModal = ({
  show,
  onHide,
  inviteType,
}: SendQrCodeInviteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);
  const [templateTypes, setTemplateTypes] = useState<SelectedOption[]>([]);

  // Default template based on invite type
  const defaultTemplate =
    inviteType === "vendor" ? "qr_code_vendor_invite" : "qr_code_client_invite";

  const getRegistrationUrl = (email: string) => {
    const baseUrl = window.location.origin;
    const path =
      inviteType === "vendor"
        ? "/talent/vendor/vendor-add-qr-code"
        : "/talent/client/client-add-qr-code";
    return `${baseUrl}${path}?email=${encodeURIComponent(email)}`;
  };

  // Fetch email templates and load default template on mount
  useEffect(() => {
    const fetchTemplatesAndLoadDefault = async () => {
      try {
        // Fetch all templates
        const response = await viewEmailTemplate({ limit: 1000 });
        const types = response.data.templates.map(
          (template: any) => template.type
        );
        const mappedTypes = types.map((type: string) => ({
          label: type,
          value: type,
        }));
        setTemplateTypes(mappedTypes);

        // Set default template and load its content
        validation.setFieldValue("email_template", defaultTemplate);

        // Fetch and set the default template's message
        try {
          const templateData = await getEmailTemplateByType(defaultTemplate);
          validation.setFieldValue(
            "message",
            templateData.data.description || ""
          );
        } catch (templateError) {
          console.error("Error fetching default template:", templateError);
        }
      } catch (error) {
        console.error("Error fetching template types:", error);
      }
    };

    if (show) {
      fetchTemplatesAndLoadDefault();
    }
  }, [show, inviteType]);

  console.log(inviteType);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      recipients: "",
      email_template: defaultTemplate,
      message: "",
      recipientType: inviteType,
    },
    validationSchema: Yup.object({
      recipients: Yup.string()
        .required("At least one email is required.")
        .test(
          "valid-emails",
          "One or more email addresses are invalid",
          (value) => {
            if (!value) return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emails = value.split(",").map((email) => email.trim());
            return emails.every((email) => emailRegex.test(email));
          }
        ),
      email_template: Yup.string().required("Please select an email template."),
      message: Yup.string().required("Message is required."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const emailList = values.recipients
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0);

        const response = await sendQrCodeInvite({
          recipients: emailList,
          templateType: values.email_template,
          message: values.message,
          recipientType: values.recipientType,
        });

        if (response?.success) {
          toast.success(
            response?.message ||
              `QR code invitation sent successfully to ${emailList.length} recipient(s)!`
          );
          validation.resetForm();
          onHide();
        } else {
          toast.error(response?.message || "Failed to send invitation.");
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Something went wrong while sending the invitation.";
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleTemplateChange = async (selectedOption: SelectedOption) => {
    const selectedType = selectedOption?.value;
    validation.setFieldValue("email_template", selectedType);

    if (selectedType) {
      try {
        const templateData = await getEmailTemplateByType(selectedType);
        validation.setFieldValue(
          "message",
          templateData.data.description || ""
        );
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    } else {
      validation.setFieldValue("message", "");
    }
  };

  const handleCopyLink = () => {
    const emails = validation.values.recipients
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e);
    const firstEmail = emails[0] || "";
    const url = getRegistrationUrl(firstEmail);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Registration link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const handleDownloadQr = () => {
    const emails = validation.values.recipients
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
    const firstEmail = emails[0] || "";

    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${inviteType}-qr-code-${firstEmail}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const previewEmail =
      validation.values.recipients
        .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))[0] || "";

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="ri-qr-code-line me-2" />
          Send QR Code Invitation -{" "}
          {inviteType === "vendor" ? "Vendor" : "Client"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={validation.handleSubmit}>
          <div className="mb-4">
            <BaseSelect
              label="Select Email Template"
              name="email_template"
              className="select-border"
              options={templateTypes}
              placeholder={InputPlaceHolder("Email Template")}
              handleChange={handleTemplateChange}
              handleBlur={validation.handleBlur}
              value={
                dynamicFind(templateTypes, validation.values.email_template) ||
                ""
              }
              touched={validation.touched.email_template}
              error={validation.errors.email_template}
            />
          </div>

          <div className="mb-4">
            <BaseInput
              label="Email Address(es)"
              name="recipients"
              type="text"
              placeholder={InputPlaceHolder(
                "Enter email addresses (comma separated)"
              )}
              handleChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              value={validation.values.recipients}
              error={validation.errors.recipients}
              touched={validation.touched.recipients}
            />
            <small className="text-muted">
              Enter multiple emails separated by commas (e.g.,
              email1@example.com, email2@example.com)
            </small>
          </div>

          <div className="mb-4">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className={`form-control ${
                validation.touched.message && validation.errors.message
                  ? "is-invalid"
                  : ""
              }`}
              rows={4}
              placeholder="Enter invitation message..."
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.message}
            />
            {validation.touched.message && validation.errors.message && (
              <div className="invalid-feedback">
                {validation.errors.message}
              </div>
            )}
          </div>

          {/* QR Code Preview Section */}
          <div className="p-4 mb-4 border rounded bg-light">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="ri-qr-code-line me-2" />
                QR Code Preview
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowQrPreview(!showQrPreview)}
              >
                {showQrPreview ? "Hide" : "Show"} Preview
              </button>
            </div>

            {showQrPreview && previewEmail && (
              <div className="text-center">
                <div className="p-3 mb-3 bg-white d-inline-block rounded shadow-sm">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={getRegistrationUrl(previewEmail)}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="mb-2 text-muted small">
                  Registration URL for: <strong>{previewEmail}</strong>
                </div>
                <div className="gap-2 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopyLink}
                  >
                    <i className="ri-link me-1" />
                    Copy Link
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={handleDownloadQr}
                  >
                    <i className="ri-download-line me-1" />
                    Download QR
                  </button>
                </div>
              </div>
            )}

            {showQrPreview && !previewEmail && (
              <div className="py-4 text-center text-muted">
                <i className="mb-2 ri-mail-line d-block fs-3" />
                Enter a valid email address to preview the QR code
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          <div className="p-3 mb-4 border rounded bg-info bg-opacity-10">
            <h6 className="mb-2">
              <i className="ri-links-line me-2" />
              Direct Registration Links
            </h6>
            <div className="small">
              <div className="mb-1">
                <strong>
                  Generic {inviteType === "vendor" ? "Vendor" : "Client"}{" "}
                  Registration:
                </strong>
              </div>
              <code
                className="p-2 d-block bg-white rounded"
                style={{ fontSize: "12px" }}
              >
                {window.location.origin}
                {inviteType === "vendor"
                  ? "/talent/vendor/vendor-add-qr-code"
                  : "/talent/client/client-add-qr-code"}
              </code>
            </div>
          </div>

          <div className="gap-3 d-flex justify-content-end">
            <BaseButton
              type="button"
              color="secondary"
              onClick={onHide}
              disabled={isLoading}
            >
              Cancel
            </BaseButton>
            <BaseButton type="submit" color="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill me-2" />
                  Send Invitation
                </>
              )}
            </BaseButton>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SendQrCodeInviteModal;
