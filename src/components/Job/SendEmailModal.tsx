/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import BaseTextarea from "components/BaseComponents/BaseTextArea";
import { SelectedOption } from "interfaces/applicant.interface";
import {
  getJobEmailRecipients,
  sendJobEmail,
  sendApplicantStatusEmail,
} from "api/apiJob";
import { getEmailTemplateByType, viewEmailTemplate } from "api/emailApi";
import { toast } from "react-toastify";
import { errorHandle, getCurrentUserRole } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import appConstants from "constants/constant";
import { useSettings, TemplateContext } from "contexts/SettingsProvider";
import {
  getVendorTemplates,
  getClientTemplates,
  getJobTemplates,
  getCustomTemplates,
} from "api/settingsApi";

const { roleEnums } = appConstants;

const DEFAULT_STATUSES = ["applied", ""];

interface SingleApplicantData {
  id: string;
  name: string;
  email: string;
  status?: string;
}

interface SendEmailModalProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
  jobTitle?: string;
  excludeJobTemplates?: boolean;
  singleApplicant?: SingleApplicantData;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  show,
  onHide,
  jobId,
  jobTitle,
  excludeJobTemplates = false,
  singleApplicant,
}) => {
  const currentRole = getCurrentUserRole();
  const { filterTemplatesByContext } = useSettings();
  const [vendorOptions, setVendorOptions] = useState<SelectedOption[]>([]);
  const [applicantOptions, setApplicantOptions] = useState<SelectedOption[]>(
    []
  );
  const [selectedVendors, setSelectedVendors] = useState<SelectedOption[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<
    SelectedOption[]
  >([]);
  const [emailTemplates, setEmailTemplates] = useState<SelectedOption[]>([]);
  const [emailTemplatesData, setEmailTemplatesData] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SelectedOption | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateSubject, setTemplateSubject] = useState<string>("");
  const [templateDescription, setTemplateDescription] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [fetchingVendors, setFetchingVendors] = useState(false);
  const [fetchingApplicants, setFetchingApplicants] = useState(false);

  // Determine the template context based on role
  const getTemplateContext = (): TemplateContext => {
    if (currentRole === roleEnums.Vendor) return "vendor";
    if (currentRole === roleEnums.Client) return "client";
    return "job";
  };

  // Check if applicant status has been changed from default
  const isStatusUnchanged =
    singleApplicant &&
    DEFAULT_STATUSES.includes(singleApplicant.status?.toLowerCase() || "");

  useEffect(() => {
    if (show && jobId) {
      if (!singleApplicant) {
        fetchVendors();
        fetchApplicants();
      }
      fetchEmailTemplates();
    }
  }, [show, jobId, singleApplicant]);

  useEffect(() => {
    if (show) {
      setSelectedVendors([]);
      setSelectedTemplate(null);
      setSelectedTemplateId("");
      setTemplateSubject("");
      setTemplateDescription("");
      setCustomMessage("");

      // Pre-select single applicant if provided
      if (singleApplicant) {
        setSelectedApplicants([
          {
            label: `${singleApplicant.name} (${singleApplicant.email})`,
            value: singleApplicant.id,
          },
        ]);
      } else {
        setSelectedApplicants([]);
      }
    }
  }, [show, singleApplicant]);

  const fetchVendors = async () => {
    setFetchingVendors(true);
    try {
      const res = await getJobEmailRecipients(roleEnums.Vendor, {
        limit: 2000,
      });
      if (res?.success) {
        const recipients = res?.data?.vendors || [];
        const options = recipients.map((vendor: any) => ({
          label: `${
            vendor.vendor_name ||
            vendor.vendorId?.name ||
            vendor.name ||
            "Vendor"
          }${
            vendor.vendorId?.email || vendor.email
              ? ` (${vendor.vendorId?.email || vendor.email})`
              : ""
          }`,
          value: vendor._id,
        }));
        setVendorOptions(options);
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      setFetchingVendors(false);
    }
  };

  const fetchApplicants = async () => {
    setFetchingApplicants(true);
    try {
      const res = await getJobEmailRecipients(
        "applicant",
        { limit: 2000 },
        jobId
      );
      if (res?.success) {
        const recipients = res?.data?.applicants || [];
        // Convert to options format for MultiSelect
        const options = recipients.map((applicant: any) => {
          const name = applicant.name;
          const fullName = name
            ? `${name.firstName || ""} ${name.middleName || ""} ${
                name.lastName || ""
              }`.trim()
            : applicant.applicantId?.name || "Applicant";
          return {
            label: `${fullName}${
              applicant.email || applicant.applicantId?.email
                ? ` (${applicant.email || applicant.applicantId?.email})`
                : ""
            }`,
            value: applicant._id,
          };
        });
        setApplicantOptions(options);
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      setFetchingApplicants(false);
    }
  };

  const handleVendorChange = (selected: any) => {
    setSelectedVendors(selected || []);
  };

  const fetchEmailTemplates = async () => {
    try {
      // Fetch all templates for data reference
      const res = await viewEmailTemplate({ limit: 1000 });
      const templates = res?.success ? res.data?.templates || [] : [];
      console.log("templates",templates);
      setEmailTemplatesData(templates);

      // Determine context and fetch templates from appropriate API
      const context = getTemplateContext();
      let templateOptions: SelectedOption[] = [];

      // Try to fetch from settings API based on context
      let settingsResponse = null;
      if (excludeJobTemplates) {
        // For custom emails (excluding job templates)
        settingsResponse = await getCustomTemplates();
      } else if (currentRole === roleEnums.Vendor) {
        settingsResponse = await getVendorTemplates();
      } else if (currentRole === roleEnums.Client) {
        settingsResponse = await getClientTemplates();
      } else {
        settingsResponse = await getJobTemplates();
      }

      console.log("settingsResponse",settingsResponse);

      if (settingsResponse?.success && settingsResponse?.data) {
        // Use templates from settings API
        templateOptions = settingsResponse.data?.map((template: any) => ({
          value: template.type,
          label: template.subject,
        }));
      } else {
        // Fallback: filter locally
        templateOptions = templates.map((template: any) => ({
          label: template.name || template.type,
          value: template.type,
        }));

        // Apply role-based filtering
        templateOptions = templateOptions.filter((option: SelectedOption) => {
          const templateType = option.value?.toUpperCase();

          if (excludeJobTemplates) {
            return (
              templateType !== "JOB_NOTIFICATION" &&
              templateType !== "CLIENT_JOB_EMAIL"
            );
          }

          if (currentRole === roleEnums.Client) {
            return templateType === "CLIENT_JOB_EMAIL";
          }
          if (currentRole === roleEnums.Vendor) {
            return templateType === "JOB_NOTIFICATION";
          }
          return true;
        });

        // Apply settings-based filtering
        templateOptions = filterTemplatesByContext(templateOptions, context);
      }

      setEmailTemplates(templateOptions);

      // Only auto-select default template when not excluding job templates
      if (!excludeJobTemplates) {
        let defaultTemplate: SelectedOption | null = null;
        if (currentRole === roleEnums.Client) {
          defaultTemplate =
            templateOptions.find(
              (opt: SelectedOption) =>
                opt.value?.toUpperCase() === "CLIENT_JOB_EMAIL"
            ) || null;
        } else if (currentRole === roleEnums.Vendor) {
          defaultTemplate =
            templateOptions.find(
              (opt: SelectedOption) =>
                opt.value?.toUpperCase() === "JOB_NOTIFICATION"
            ) || null;
        }

        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
          const templateData = await getEmailTemplateByType(
            defaultTemplate.value
          );
          const template = templates.find(
            (t: any) => t.type === defaultTemplate?.value
          );
          setSelectedTemplateId(template?._id || "");
          setTemplateSubject(templateData.data?.subject || "");
          setTemplateDescription(templateData.data?.description || "");
        }
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
      errorHandle(error);
    }
  };

  const handleTemplateChange = async (
    selectedOption: SelectedOption | null
  ) => {
    setSelectedTemplate(selectedOption);
    if (selectedOption?.value) {
      try {
        const templateData = await getEmailTemplateByType(selectedOption.value);
        const template = emailTemplatesData.find(
          (t: any) => t.type === selectedOption.value
        );
        setSelectedTemplateId(template?._id || "");
        setTemplateSubject(templateData.data?.subject || "");
        setTemplateDescription(templateData.data?.description || "");
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    } else {
      setSelectedTemplateId("");
      setTemplateSubject("");
      setTemplateDescription("");
    }
  };

  const handleApplicantChange = (selected: any) => {
    setSelectedApplicants(selected || []);
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast.error("Please select an email template");
      return;
    }

    setSending(true);
    try {
      if (singleApplicant) {
        const requestData = {
          applicantName: singleApplicant.name,
          applicantEmail: singleApplicant.email,
          templateType: selectedTemplate.value,
          applicantStatus: singleApplicant.status || "",
          applicantId: singleApplicant.id,
          jobId: jobId,
        };

        const res = await sendApplicantStatusEmail(requestData);

        if (res?.success) {
          toast.success(res?.message || "Email sent successfully!");
          onHide();
        } else {
          toast.error(res?.message || "Failed to send email");
        }
      } else {
        const hasVendorSelection = selectedVendors.length > 0;
        const hasApplicantSelection = selectedApplicants.length > 0;

        if (!hasVendorSelection && !hasApplicantSelection) {
          toast.error("Please select at least one vendor or applicant");
          return;
        }

        const vendorIds = selectedVendors.map((option) => option.value);

        const applicantIds = selectedApplicants.map((option) => option.value);

        const requestData: {
          vendorIds?: string[];
          applicantIds?: string[];
          customMessage?: string;
          emailTemplateId?: string;
        } = {};

        if (currentRole === roleEnums.Vendor) {
          requestData.applicantIds = applicantIds;
          requestData.customMessage = customMessage || "";
          requestData.vendorIds = [];
        } else {
          if (vendorIds.length > 0) {
            requestData.vendorIds = vendorIds;
          }

          if (applicantIds.length > 0) {
            requestData.applicantIds = applicantIds;
          }

          if (customMessage.trim()) {
            requestData.customMessage = customMessage.trim();
          }
        }

        if (selectedTemplateId) {
          requestData.emailTemplateId = selectedTemplateId;
        }

        const res = await sendJobEmail(jobId, requestData);

        if (res?.success) {
          toast.success(res?.message || "Email sent successfully!");
          onHide();
        } else {
          toast.error(res?.message || "Failed to send email");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send email");
      errorHandle(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Send Email - {jobTitle || "Job"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isStatusUnchanged && (
          <div className="alert alert-warning d-flex align-items-center mb-3">
            <i className="ri-error-warning-line fs-4 me-2"></i>
            <div>
              <strong>Cannot send email!</strong>
              <br />
              Please update the applicant status before sending a status update
              email.
            </div>
          </div>
        )}

        <Row className="mb-3">
          <Col>
            <BaseSelect
              name="emailTemplate"
              label="Email Template"
              options={emailTemplates}
              value={selectedTemplate}
              handleChange={(selected: any) => handleTemplateChange(selected)}
              placeholder="Select email template"
              isDisabled={isStatusUnchanged}
            />
          </Col>
        </Row>

        {singleApplicant ? (
          <Row className="mb-3">
            <Col>
              <label className="form-label">Recipient</label>
              <div className="p-3 bg-light rounded border">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-user-line text-primary"></i>
                  <div>
                    <strong>{singleApplicant.name}</strong>
                    <br />
                    <span className="text-muted">{singleApplicant.email}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            {currentRole === roleEnums.Client && (
              <Row className="mb-3">
                <Col>
                  {fetchingVendors ? (
                    <Skeleton count={5} />
                  ) : (
                    <CheckboxMultiSelect
                      name="vendors"
                      label="Select Vendors"
                      options={vendorOptions}
                      value={selectedVendors}
                      onChange={handleVendorChange}
                      placeholder="Select vendors..."
                      showSelectAll={true}
                      zIndex={9999}
                    />
                  )}
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <Col>
                {fetchingApplicants ? (
                  <Skeleton count={5} />
                ) : (
                  <CheckboxMultiSelect
                    name="applicants"
                    label="Select Applicants"
                    options={applicantOptions}
                    value={selectedApplicants}
                    onChange={handleApplicantChange}
                    placeholder="Select applicants..."
                    showSelectAll={true}
                    zIndex={9999}
                  />
                )}
              </Col>
            </Row>
          </>
        )}

        {selectedTemplate && (
          <Row className="mb-3">
            <Col>
              <div className="alert alert-info">
                <strong>Subject:</strong> {templateSubject}
                <br />
                <strong>Preview:</strong>{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: templateDescription.substring(0, 100) + "...",
                  }}
                />
              </div>
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col>
            <BaseTextarea
              name="customMessage"
              label="Custom Message (Optional)"
              placeholder="Enter custom message to include in the email..."
              value={customMessage}
              handleChange={(e) => setCustomMessage(e.target.value)}
              handleBlur={() => {}}
              rows={4}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <BaseButton
          color="outline-secondary"
          onClick={onHide}
          disabled={sending}
        >
          Cancel
        </BaseButton>
        <BaseButton
          color="primary"
          onClick={handleSendEmail}
          loader={sending}
          disabled={isStatusUnchanged}
        >
          Send Email
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
};

export default SendEmailModal;
