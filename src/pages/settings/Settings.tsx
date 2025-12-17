import { Fragment, useState } from "react";
import {
  Row,
  Col,
  Card,
  Container,
  CardBody,
  Nav,
  Tab,
  Form,
  Badge,
  Table,
} from "react-bootstrap";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import {
  useSettings,
  dateFormatOptions,
  timeFormatOptions,
  type TemplateVisibility,
} from "contexts/SettingsProvider";
import appConstants from "constants/constant";
import "./Settings.css";

const Settings = () => {
  const {
    settings,
    isLoading,
    updateSetting,
    updateTemplateVisibility,
    toggleAllTemplatesForContext,
    resetSettings,
    saveDateTimeSettings,
    saveTemplateVisibilitySettings,
    formatDate,
  } = useSettings();

  const [activeTab, setActiveTab] = useState("datetime");

  // Handle save based on active tab
  const handleSave = async () => {
    if (activeTab === "datetime") {
      await saveDateTimeSettings();
    } else if (activeTab === "templates") {
      await saveTemplateVisibilitySettings();
    }
  };

  // Preview date
  const previewDate = new Date();

  // Context column definitions
  const contextColumns: {
    key: keyof Omit<TemplateVisibility, "templateType" | "templateName">;
    label: string;
    shortLabel: string;
    color: string;
  }[] = [
    {
      key: "vendor",
      label: "Vendor Email",
      shortLabel: "Vendor",
      color: "primary",
    },
    {
      key: "client",
      label: "Client Email",
      shortLabel: "Client",
      color: "info",
    },
    {
      key: "job",
      label: "Job Email",
      shortLabel: "Job",
      color: "success",
    },
    {
      key: "qrCode",
      label: "QR Code Invite",
      shortLabel: "QR Code",
      color: "warning",
    },
    {
      key: "custom",
      label: "Custom Email",
      shortLabel: "Custom",
      color: "secondary",
    },
  ];

  // Check if all templates are enabled for a context
  const isAllEnabledForContext = (
    context: keyof Omit<TemplateVisibility, "templateType" | "templateName">
  ): boolean => {
    return settings.emailTemplateVisibility.every((tpl) => tpl[context]);
  };

  // Check if some (but not all) templates are enabled for a context
  const isSomeEnabledForContext = (
    context: keyof Omit<TemplateVisibility, "templateType" | "templateName">
  ): boolean => {
    const enabled = settings.emailTemplateVisibility.filter(
      (tpl) => tpl[context]
    ).length;
    return enabled > 0 && enabled < settings.emailTemplateVisibility.length;
  };

  return (
    <Fragment>
      <Container fluid>
        <Row>
          <Col>
            <Card className="settings-card my-3 mb-3">
              <CardBody>
                <div className="settings-header">
                  <div className="settings-title">
                    <i className="ri-settings-3-line settings-icon" />
                    <h4 className="mb-0">Application Settings</h4>
                  </div>
                  <p className="text-muted mb-0">
                    Configure date formats and email template visibility
                  </p>
                </div>

                <Tab.Container
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k || "datetime")}
                >
                  <Row className="mt-4">
                    <Col lg={3}>
                      <Nav variant="pills" className="flex-column settings-nav">
                        <Nav.Item>
                          <Nav.Link
                            eventKey="datetime"
                            className="settings-nav-link"
                          >
                            <i className="ri-calendar-line me-2" />
                            Date & Time
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="templates"
                            className="settings-nav-link"
                          >
                            <i className="ri-mail-settings-line me-2" />
                            Email Templates
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>

                    <Col lg={9}>
                      <Tab.Content>
                        {/* Date & Time Tab */}
                        <Tab.Pane eventKey="datetime">
                          <Card className="settings-panel">
                            <CardBody>
                              <h5 className="panel-title">
                                <i className="ri-calendar-line me-2" />
                                Date & Time Format
                              </h5>
                              <hr />

                              <Row className="mb-4">
                                <Col md={6}>
                                  <div className="setting-item">
                                    <label className="setting-label">
                                      Date Format
                                    </label>
                                    <BaseSelect
                                      name="dateFormat"
                                      options={dateFormatOptions.map((opt) => ({
                                        label: `${opt.label} (${opt.example})`,
                                        value: opt.value,
                                      }))}
                                      value={{
                                        label: dateFormatOptions.find(
                                          (opt) =>
                                            opt.value === settings.dateFormat
                                        )?.label,
                                        value: settings.dateFormat,
                                      }}
                                      handleChange={(option: {
                                        value: string;
                                      }) =>
                                        updateSetting(
                                          "dateFormat",
                                          option.value
                                        )
                                      }
                                      placeholder="Select date format"
                                    />
                                    <small className="text-muted">
                                      Choose how dates appear throughout the
                                      application
                                    </small>
                                  </div>
                                </Col>

                                <Col md={6}>
                                  <div className="setting-item">
                                    <label className="setting-label">
                                      Time Format
                                    </label>
                                    <BaseSelect
                                      name="timeFormat"
                                      options={timeFormatOptions}
                                      value={timeFormatOptions.find(
                                        (opt) =>
                                          opt.value === settings.timeFormat
                                      )}
                                      handleChange={(option: {
                                        value: string;
                                      }) =>
                                        updateSetting(
                                          "timeFormat",
                                          option.value
                                        )
                                      }
                                      placeholder="Select time format"
                                    />
                                    <small className="text-muted">
                                      12-hour (AM/PM) or 24-hour format
                                    </small>
                                  </div>
                                </Col>
                              </Row>

                              <Row className="mb-4">
                                <Col md={6}>
                                  <div className="setting-item">
                                    <label className="setting-label">
                                      Timezone
                                    </label>
                                    <BaseSelect
                                      name="timezone"
                                      options={appConstants.timeZoneOptions}
                                      value={appConstants.timeZoneOptions.find(
                                        (opt) => opt.value === settings.timezone
                                      )}
                                      handleChange={(option: {
                                        value: string;
                                      }) =>
                                        updateSetting("timezone", option.value)
                                      }
                                      placeholder="Select timezone"
                                    />
                                    <small className="text-muted">
                                      Used for scheduling and date calculations
                                    </small>
                                  </div>
                                </Col>
                              </Row>

                              {/* Date Preview */}
                              <div className="date-preview-card">
                                <h6 className="preview-title">
                                  <i className="ri-eye-line me-2" />
                                  Preview
                                </h6>
                                <div className="preview-content">
                                  <div className="preview-item">
                                    <span className="preview-label">
                                      Current Date:
                                    </span>
                                    <span className="preview-value">
                                      {formatDate(previewDate)}
                                    </span>
                                  </div>
                                  <div className="preview-item">
                                    <span className="preview-label">
                                      Sample Date:
                                    </span>
                                    <span className="preview-value">
                                      {formatDate(new Date("2024-12-25"))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab.Pane>

                        {/* Email Templates Tab */}
                        <Tab.Pane eventKey="templates">
                          <Card className="settings-panel">
                            <CardBody>
                              <h5 className="panel-title">
                                <i className="ri-mail-settings-line me-2" />
                                Email Template Visibility
                              </h5>
                              <p className="text-muted mb-3">
                                Control which email templates appear in
                                different dropdown menus.
                              </p>
                              <hr />

                              {/* Context Legend */}
                              <div className="context-legend mb-4">
                                <span className="legend-title me-3">
                                  Contexts:
                                </span>
                                {contextColumns.map((col) => (
                                  <Badge
                                    key={col.key}
                                    bg={col.color}
                                    className="me-2 legend-badge"
                                  >
                                    {col.label}
                                  </Badge>
                                ))}
                              </div>

                              {/* Template Visibility Table */}
                              <div className="template-table-wrapper">
                                <Table
                                  responsive
                                  bordered
                                  hover
                                  className="template-visibility-table"
                                >
                                  <thead>
                                    <tr>
                                      <th className="template-name-col">
                                        Template Name
                                      </th>
                                      {contextColumns.map((col) => (
                                        <th
                                          key={col.key}
                                          className="context-col text-center"
                                        >
                                          <div className="context-header">
                                            <span className="context-label">
                                              {col.shortLabel}
                                            </span>
                                            <Form.Check
                                              type="checkbox"
                                              className="context-toggle-all"
                                              checked={isAllEnabledForContext(
                                                col.key
                                              )}
                                              ref={(
                                                input: HTMLInputElement | null
                                              ) => {
                                                if (input) {
                                                  input.indeterminate =
                                                    isSomeEnabledForContext(
                                                      col.key
                                                    );
                                                }
                                              }}
                                              onChange={(e) =>
                                                toggleAllTemplatesForContext(
                                                  col.key,
                                                  e.target.checked
                                                )
                                              }
                                              title={`Toggle all for ${col.label}`}
                                            />
                                          </div>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {settings.emailTemplateVisibility.map(
                                      (template) => (
                                        <tr key={template.templateType}>
                                          <td className="template-name-cell">
                                            <span className="template-name">
                                              {template.templateName}
                                            </span>
                                            <small className="template-type text-muted d-block">
                                              {template.templateType}
                                            </small>
                                          </td>
                                          {contextColumns.map((col) => (
                                            <td
                                              key={col.key}
                                              className="context-cell text-center"
                                            >
                                              <Form.Check
                                                type="switch"
                                                className="template-switch"
                                                checked={template[col.key]}
                                                onChange={(e) =>
                                                  updateTemplateVisibility(
                                                    template.templateType,
                                                    col.key,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                            </td>
                                          ))}
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </Table>
                              </div>

                              {/* Summary */}
                              <div className="template-summary-grid mt-4">
                                {contextColumns.map((col) => {
                                  const enabledCount =
                                    settings.emailTemplateVisibility.filter(
                                      (t) => t[col.key]
                                    ).length;
                                  return (
                                    <div key={col.key} className="summary-item">
                                      <Badge
                                        bg={col.color}
                                        className="summary-badge"
                                      >
                                        {enabledCount}
                                      </Badge>
                                      <span className="summary-label">
                                        {col.shortLabel} templates
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardBody>
                          </Card>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>

                {/* Action Buttons */}
                <div className="settings-actions">
                  <BaseButton
                    className="btn btn-outline-secondary"
                    onClick={resetSettings}
                    disabled={isLoading}
                  >
                    <i className="ri-refresh-line me-2" />
                    Reset to Defaults
                  </BaseButton>
                  <BaseButton
                    className="btn btn-success px-4"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line me-2" />
                        {activeTab === "datetime"
                          ? "Save Date & Time"
                          : "Save Template Settings"}
                      </>
                    )}
                  </BaseButton>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Settings;
