import { Row, Col, Container } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  jobApplicantSchema,
  SelectedOption,
} from "interfaces/applicant.interface";
import BaseTextarea from "components/BaseComponents/BaseTextArea";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";

const {
  projectTitle,
  Modules,
  communicationOptions,
  designationType,
  anyHandOnOffers,
  workPreferenceType,
} = appConstants;

const JobDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPkg: initialValues?.currentPkg || "",
      expectedPkg: initialValues?.expectedPkg || "",
      negotiation: initialValues?.negotiation || "",
      noticePeriod: initialValues?.noticePeriod || "",
      workPreference: initialValues?.workPreference || "",
      practicalUrl: initialValues?.practicalUrl || "",
      practicalFeedback: initialValues?.practicalFeedback || "",
      aboutUs: initialValues?.aboutUs || "",
      communicationSkill: initialValues?.communicationSkill || "",
      appliedRole: initialValues?.appliedRole || "",
      currentCompanyName: initialValues?.currentCompanyName || "",
      anyHandOnOffers: initialValues?.anyHandOnOffers || "",
      lastFollowUpDate: initialValues?.lastFollowUpDate || "",
    },
    validationSchema: jobApplicantSchema,
    onSubmit: (data: any) => {
      onNext(data);
     
    },
  });

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Row className="mb-4">
          <div>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              className="p-3"
            >
              <Row className="mb-4">
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Expected Package (LPA)"
                    name="expectedPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Expected package")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.expectedPkg}
                    touched={validation.touched.expectedPkg}
                    error={validation.errors.expectedPkg}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} sm={4}>
                  <BaseInput
                    label="Current Package (LPA)"
                    name="currentPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Current package")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentPkg}
                    touched={validation.touched.currentPkg}
                    error={validation.errors.currentPkg}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label=" Negotiation (₹)"
                    name="negotiation"
                    type="text"
                    placeholder={InputPlaceHolder("Negotiation amount")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.negotiation}
                    touched={validation.touched.negotiation}
                    error={validation.errors.negotiation}
                    passwordToggle={false}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12} sm={4}>
                  <BaseInput
                    label=" Notice Period (Days)"
                    name="noticePeriod"
                    type="text"
                    placeholder={InputPlaceHolder("Notice period")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.noticePeriod}
                    touched={validation.touched.noticePeriod}
                    error={validation.errors.noticePeriod}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseSelect
                    label="Communication Skill(out of 10)"
                    name="communicationSkill"
                    className="select-border"
                    options={communicationOptions}
                    placeholder="CommunicationSkill"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "communicationSkill",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.communicationSkill}
                    value={
                      dynamicFind(
                        communicationOptions,
                        validation.values.communicationSkill
                      ) || ""
                    }
                    touched={validation.touched.communicationSkill}
                    error={validation.errors.communicationSkill}
                  />
                </Col>
                <Col xs={12} sm={4}>
                  <BaseSelect
                    label="Work Preference"
                    name="workPreference"
                    className="select-border"
                    options={workPreferenceType}
                    placeholder={InputPlaceHolder("workPreference")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "workPreference",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        workPreferenceType,
                        validation.values.workPreference
                      ) || ""
                    }
                    touched={validation.touched.workPreference}
                    error={validation.errors.workPreference}
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs={12} lg={4} md={4}>
                  <BaseSelect
                    label="Applied Role"
                    name="appliedRole"
                    className="select-border"
                    options={designationType}
                    placeholder={InputPlaceHolder("Applied Role")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "appliedRole",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.appliedRole}
                    value={
                      dynamicFind(
                        designationType,
                        validation.values.appliedRole
                      ) || ""
                    }
                    touched={validation.touched.appliedRole}
                    error={validation.errors.appliedRole}
                  />
                </Col>

                <Col xs={12} sm={4} md={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Current Company"
                    name="currentCompanyName"
                    type="text"
                    placeholder={InputPlaceHolder("Current Company")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentCompanyName}
                    touched={validation.touched.currentCompanyName}
                    error={validation.errors.currentCompanyName}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={4}>
                  <BaseSelect
                    label="Any Hand On Offers ?"
                    name="anyHandOnOffers"
                    className="select-border"
                    options={anyHandOnOffers}
                    placeholder="anyHandOnOffers"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "anyHandOnOffers",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        anyHandOnOffers,
                        validation.values.anyHandOnOffers
                      ) || ""
                    }
                    touched={validation.touched.anyHandOnOffers}
                    error={validation.errors.anyHandOnOffers}
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs={12} sm={6} md={6} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Last Follow UpDate"
                    name="lastFollowUpDate"
                    type="date"
                    placeholder={InputPlaceHolder("Last Follow UpDate")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.lastFollowUpDate}
                    touched={validation.touched.lastFollowUpDate}
                    error={validation.errors.lastFollowUpDate}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Practical Url"
                    name="practicalUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Practical Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalUrl}
                    touched={validation.touched.practicalUrl}
                    error={validation.errors.practicalUrl}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} sm={12} md={12} className="mb-3 mb-sm-0">
                  <BaseTextarea
                    label="Practical Feedback"
                    name="practicalFeedback"
                    placeholder={InputPlaceHolder(
                      "Describe about Us Practical Task..."
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalFeedback}
                    touched={validation.touched.practicalFeedback}
                    error={validation.errors.practicalFeedback}
                    passwordToggle={false}
                    rows={2}
                    cols={50}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12}>
                  <BaseTextarea
                    label="About Us"
                    name="aboutUs"
                    placeholder={InputPlaceHolder(
                      "Describe your experience and expectations"
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.aboutUs}
                    touched={validation.touched.aboutUs}
                    error={validation.errors.aboutUs}
                    passwordToggle={false}
                    multiline
                    rows={2}
                    cols={50}
                  />
                </Col>
              </Row>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <BaseButton
                  className="order-1 order-md-0"
                  type="submit"
                  onClick={() => {
                    onBack(validation.values);
                  }}
                >
                  Previous
                </BaseButton>
                <BaseButton
                  color="primary"
                  className="order-0 order-md-1"
                  type="submit"
                >
                  Next
                </BaseButton>
              </div>
            </Form>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default JobDetailsForm;
