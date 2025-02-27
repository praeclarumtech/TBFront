/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container } from "react-bootstrap";
import * as Yup from "yup";
import { InputPlaceHolder, projectTitle } from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import { dynamicFind } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import { SelectedOption } from "interfaces/applicant.interface";

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
      otherSkills: initialValues?.otherSkills || "",
      referral: initialValues?.referral || "",
      url: initialValues?.url || "",
      rating: initialValues?.rating || "",
    },
    validationSchema: Yup.object({
      qualification: Yup.string().required("Qualification is required"),
      degree: Yup.string().required("Degree Name is required"),
      passingYear: Yup.string().required("Passing Year is required"),
      appliedSkills: Yup.array()
        .required("Passing Skill is required")
        .min(1, "At least one skill must be selected"),
      otherSkills: Yup.string(),
      totalExperience: Yup.number()
        .positive("Total Experience must be a positive number")
        .required("Total Experience is required"),
      relevantSkillExperience: Yup.number()
        .min(0, "Relevant Skill Experience cannot be negative")
        .required("Relevant Skill Experience is required")
        .test(
          "is-less-than-or-equal-total",
          "Relevant Skill Experience must be less than or equal to Total Experience",
          function (value) {
            const totalExperience = this.parent.totalExperience;
            return value <= totalExperience;
          }
        ),
      referral: Yup.string(),
      url: Yup.string()
        .url("Please enter a valid URL")
        .required("Resume URL is required"),
      rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be between 1 and 10")
        .max(10, "Rating must be between 1 and 10"),
    }),

    onSubmit: (data) => {
      onNext(data);
    },
  });

  const qualification = [
    { label: "Bachelors", value: "Bachelors" },
    { label: "Masters", value: "masters" },
    { label: "PhD", value: "phd" },
    { label: "Diploma", value: "diploma" },
    { label: "Associate Degree", value: "associate_degree" },
    { label: "Certification", value: "certification" },
    { label: "Doctorate", value: "doctorate" },
    { label: "Post Graduate Diploma", value: "post_graduate_diploma" },
    { label: "Advanced Diploma", value: "advanced_diploma" },
  ];

  const passingYeatType = [
    { label: "2005", value: 2005 },
    { label: "2006", value: 2006 },
    { label: "2007", value: 2007 },
    { label: "2008", value: 2008 },
    { label: "2009", value: 2009 },
    { label: "2010", value: 2010 },
    { label: "2011", value: 2011 },
    { label: "2012", value: 2012 },
    { label: "2013", value: 2013 },
    { label: "2014", value: 2014 },
    { label: "2015", value: 2015 },
    { label: "2016", value: 2016 },
    { label: "2017", value: 2017 },
    { label: "2018", value: 2018 },
    { label: "2019", value: 2019 },
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
    { label: "2027", value: 2027 },
    { label: "2028", value: 2028 },
    { label: "2029", value: 2029 },
  ];

  const appliedSkillsType = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "Node Js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "C++", value: "C++" },
    { label: "Express Js", value: "Express Js" },
    { label: "DotNet", value: "DotNet" },
    { label: "Testing", value: "Testing" },
    { label: "React Native", value: "React Native" },
    { label: "Ionic", value: "Ionic" },
    { label: "Flutter", value: "Flutter" },
    { label: "Tailwind Css", value: "Tailwind Css" },
    { label: "React", value: "React" },
    { label: "Redux", value: "Redux" },
  ];

  const [selectedMulti, setSelectedMulti] = useState<any>(
    initialValues.appliedSkills || []
  );

  const handleMulti = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.value) || [];
    validation.setFieldValue("appliedSkills", ids);

    setSelectedMulti(selectedMulti);
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
                  <BaseSelect
                    label="Qualification"
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
                    value={
                      dynamicFind(
                        qualification,
                        validation.values.qualification
                      ) || ""
                    }
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
                <Col xs={12} md={6}>
                  <BaseSelect
                    label="Passing Year"
                    name="passingYear"
                    className="select-border"
                    options={passingYeatType}
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
                        passingYeatType,
                        validation.values.passingYear
                      ) || ""
                    }
                    touched={validation.touched.passingYear}
                    error={validation.errors.passingYear}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <MultiSelect
                    label="Applied Skills"
                    name="appliedSkills"
                    className="select-border"
                    value={selectedMulti || null}
                    isMulti={true}
                    onChange={handleMulti}
                    options={appliedSkillsType}
                    touched={validation.touched.serviceType}
                    error={validation.errors.serviceType}
                    handleBlur={validation.handleBlur}
                  />
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Total Experience"
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
                    label="Relevant Skill Experience"
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

                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Resume Url"
                    name="url"
                    type="url"
                    placeholder={InputPlaceHolder("URL")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.url}
                    touched={validation.touched.url}
                    error={validation.errors.url}
                    passwordToggle={false}
                    title="Please Upload Resume on Google Drive and share pulic url (Only PDF files allowed)"
                  />
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Javascript Rating"
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
