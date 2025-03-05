import { Row, Col, Container } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  EducationApplicantSchema,
  SelectedOption,
} from "interfaces/applicant.interface";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";

const {
  projectTitle,
  Modules,
  passingYearType,
  qualification,
  skillOptions,
  designationType,
  maritalStatusType,
} = appConstants;

const EducationalDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      qualification: initialValues?.qualification || "",
      degree: initialValues?.degree || "",
      passingYear: initialValues?.passingYear || "",
      totalExperience: initialValues?.totalExperience || "",
      relevantSkillExperience: initialValues?.relevantSkillExperience || "",
      appliedSkills: initialValues?.appliedSkills || "",
      otherSkills: initialValues?.otherSkills || "",
      referral: initialValues?.referral || "",
      resumeUrl: initialValues?.resumeUrl || "",
      rating: initialValues?.rating || "",
      portfolioUrl: initialValues?.portfolioUrl || "",
      CurrentCompanyDesignation: initialValues?.CurrentCompanyDesignation || "",
      maritalStatus: initialValues?.maritalStatus || "",
    },
    validationSchema: EducationApplicantSchema,
    onSubmit: (data) => {
      onNext(data);
      console.log("onSubmit education submitted", data);
    },
  });

  const [selectedMulti, setSelectedMulti] = useState<any>(
    initialValues.appliedSkills || []
  );
  const [selectedQualification, setSelectedQualification] = useState<any>(
    initialValues.qualification || []
  );

  const handleMultiSkill = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.value) || [];
    validation.setFieldValue("appliedSkills", ids);
    setSelectedMulti(selectedMulti);
  };
  const handleMultiQualification = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.value) || [];
    validation.setFieldValue("qualification", ids);
    setSelectedQualification(selectedMulti);
  };

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              className="p-3"
            >
              <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                  <MultiSelect
                    label="Qualification"
                    isMulti={true}
                    onChange={handleMultiQualification}
                    name="qualification"
                    className="select-border"
                    options={qualification}
                    placeholder={InputPlaceHolder("Qualification")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "qualification",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={selectedQualification || ""}
                    touched={validation.touched.qualification}
                    error={validation.errors.qualification}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <BaseInput
                    label="Degree"
                    name="degree"
                    type="text"
                    placeholder={InputPlaceHolder("Degree")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.degree}
                    touched={validation.touched.degree}
                    error={validation.errors.degree}
                    passwordToggle={false}
                  />
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} md={3}>
                  <BaseSelect
                    label="Passing Year"
                    name="passingYear"
                    className="select-border"
                    options={passingYearType}
                    placeholder={InputPlaceHolder("Passing Year")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "passingYear",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        passingYearType,
                        validation.values.passingYear
                      ) || ""
                    }
                    touched={validation.touched.passingYear}
                    error={validation.errors.passingYear}
                  />
                </Col>
                <Col xs={12} md={3}>
                  <BaseSelect
                    label="Marital Status"
                    name="maritalStatus"
                    className="select-border"
                    options={maritalStatusType}
                    placeholder="Marital Status"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "maritalStatus",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        maritalStatusType,
                        validation.values.maritalStatus
                      ) || ""
                    }
                    touched={validation.touched.maritalStatus}
                    error={validation.errors.maritalStatus}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <MultiSelect
                    label="Applied Skills"
                    name="appliedSkills"
                    className="select-border"
                    value={selectedMulti || null}
                    isMulti={true}
                    onChange={handleMultiSkill}
                    options={skillOptions}
                    touched={validation.touched.appliedSkills}
                    error={validation.errors.appliedSkills}
                    handleBlur={validation.appliedSkills}
                  />
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Total Experience(Year)"
                    name="totalExperience"
                    type="text"
                    placeholder={InputPlaceHolder("Total Experience")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.totalExperience}
                    touched={validation.touched.totalExperience}
                    error={validation.errors.totalExperience}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Relevant Experience(Year)"
                    name="relevantSkillExperience"
                    type="text"
                    placeholder={InputPlaceHolder("Relevant skill experience")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.relevantSkillExperience}
                    touched={validation.touched.relevantSkillExperience}
                    error={validation.errors.relevantSkillExperience}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <BaseInput
                    label="Other Skill"
                    name="otherSkills"
                    type="text"
                    placeholder={InputPlaceHolder("Other Skill")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.otherSkills}
                    touched={validation.touched.otherSkills}
                    error={validation.errors.otherSkills}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <BaseSelect
                    label="Current Company Designation"
                    name="CurrentCompanyDesignation"
                    className="select-border"
                    options={designationType}
                    placeholder={InputPlaceHolder("Degination")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "CurrentCompanyDesignation",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.CurrentCompanyDesignation}
                    value={
                      dynamicFind(
                        designationType,
                        validation.values.CurrentCompanyDesignation
                      ) || ""
                    }
                    touched={validation.touched.CurrentCompanyDesignation}
                    error={validation.errors.CurrentCompanyDesignation}
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Javascript Rate(out of 10)"
                    name="rating"
                    type="number"
                    placeholder={InputPlaceHolder("Rating")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.rating}
                    touched={validation.touched.rating}
                    error={validation.errors.rating}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Referral"
                    name="referral"
                    type="text"
                    placeholder={InputPlaceHolder("Referral")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.referral}
                    touched={validation.touched.referral}
                    error={validation.errors.referral}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <BaseInput
                    label="Resume Url"
                    name="resumeUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Resume URL")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.resumeUrl}
                    touched={validation.touched.resumeUrl}
                    error={validation.errors.resumeUrl}
                    passwordToggle={false}
                    title="Please Upload Resume on Google Drive and share pulic url (Only PDF files allowed)"
                  />
                </Col>
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <BaseInput
                    label="Portfolio Url"
                    name="portfolioUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Portfolio Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.portfolioUrl}
                    touched={validation.touched.portfolioUrl}
                    error={validation.errors.portfolioUrl}
                    passwordToggle={false}
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

export default EducationalDetailsForm;
