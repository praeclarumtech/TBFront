/* eslint-disable @typescript-eslint/no-explicit-any */

import { Row, Col, Container } from "react-bootstrap";
import * as Yup from "yup";
import { InputPlaceHolder, projectTitle } from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment } from "react";
import { dynamicFind } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import { SelectedOption } from "interfaces/applicant.interface";

import BaseTextarea from "components/BaseComponents/BaseTextArea";

const JobDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPkg: initialValues?.currentPkg || "",
      expectedPkg: initialValues?.expectedPkg || "",
      negotiation: initialValues?.negotiation || "",
      noticePeriod: initialValues?.noticePeriod || "",
      readyForWork: initialValues?.readyForWork || "",
      workPreference: initialValues?.workPreference || "",
      practicalUrl: initialValues?.practicalUrl || "",
      practicalFeedback: initialValues?.practicalFeedback || "",
      aboutUs: initialValues?.aboutUs || "",
      communicationSkill: initialValues?.communicationSkill || "",
    },
    validationSchema: Yup.object({
      currentPkg: Yup.string().matches(
        /^\d+$/,
        "Current package must be a valid number."
      ),

      expectedPkg: Yup.string().matches(
        /^\d+$/,
        "Expected package must be a valid number."
      ),

      negotiation: Yup.string().matches(
        /^\d+$/,
        "Negotiation amount must be a valid number."
      ),

      noticePeriod: Yup.string()

        .min(0, "Notice period cannot be negative.")
        .matches(/^\d+$/, "Notice period must be a valid number."),

      readyForWork: Yup.string()
        .required("Ready for work is required.")
        .oneOf(["yes", "no"], "Ready for work must be either 'Yes' or 'No'."),

      workPreference: Yup.string()
        .required("Work preference is required.")
        .oneOf(
          ["remote", "onsite", "hybrid"],
          "Work preference must be one of 'remote', 'onsite', or 'hybrid'."
        ),

      practicalUrl: Yup.string().url("Please enter a valid URL."),

      practicalFeedback: Yup.string().min(
        10,
        "Feedback must be at least 10 characters long."
      ),
      communicationSkill: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be between 1 and 10")
        .max(10, "Rating must be between 1 and 10"),
      
      aboutUs: Yup.string()
        .required("About Us is required.")
        .min(10, "About Us description must be at least 10 characters long."),
    }),

    onSubmit: (data: any) => {
      console.log("Combined Form Data:", data);
      onNext(data);
    },
  });

  const communicationOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const workPreferenceType = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" },
  ];

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
                    placeholder={InputPlaceHolder("Enter expected package")}
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
                    placeholder={InputPlaceHolder("Enter current package")}
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
                    placeholder={InputPlaceHolder("Enter negotiation amount")}
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
                    placeholder={InputPlaceHolder("Enter notice period")}
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
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="   Practical Url"
                    name="practicalUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Enter Practical Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalUrl}
                    touched={validation.touched.practicalUrl}
                    error={validation.errors.practicalUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={8} className="mb-3 mb-sm-0">
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
