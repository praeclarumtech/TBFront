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
      appliedSkills: initialValues?.appliedSkills || "",
      otherSkills: initialValues?.otherSkills || "",
      referral: initialValues?.referral || "",
      resumeUrl: initialValues?.resumeUrl || "",
      rating: initialValues?.rating || "",
      portfolioUrl: initialValues?.portfolioUrl || "",
      designation: initialValues?.designation || "",
    },
    validationSchema: Yup.object({
      qualification: Yup.array()
        .required("Qualification is required")
        .min(1, "At least one skill must be selected"),
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
      designation: Yup.string().required("Designation is required"),
      referral: Yup.string(),
      portfolioUrl: Yup.string().url("Invalid URL"),
      resumeUrl: Yup.string()
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
    { label: "Express Js", value: "Express Js" },
    { label: "DotNet", value: "DotNet" },
    { label: "Testing", value: "Testing" },
    { label: "React Native", value: "React Native" },
    { label: "Ionic", value: "Ionic" },
    { label: "Flutter", value: "Flutter" },
    { label: "Tailwind Css", value: "Tailwind Css" },
    { label: "React", value: "React" },
    { label: "Redux", value: "Redux" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "C", label: "C" },
    { value: "C++", label: "C++" },
    { value: "C#", label: "C#" },
    { value: "SQL", label: "SQL" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Ruby", label: "Ruby" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "PHP", label: "PHP" },
    { value: "Swift", label: "Swift" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Go", label: "Go" },
    { value: "R", label: "R" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Django", label: "Django" },
    { value: "Flask", label: "Flask" },
    { value: "Laravel", label: "Laravel" },
    { value: "Spring Boot", label: "Spring Boot" },
    { value: "ASP.NET", label: "ASP.NET" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "Google Cloud", label: "Google Cloud" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "TensorFlow", label: "TensorFlow" },
    { value: "PyTorch", label: "PyTorch" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Deep Learning", label: "Deep Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "Git", label: "Git" },
    { value: "GitHub", label: "GitHub" },
    { value: "Jenkins", label: "Jenkins" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "RESTful APIs", label: "RESTful APIs" },
    { value: "Firebase", label: "Firebase" },
    { value: "SQLite", label: "SQLite" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "MySQL", label: "MySQL" },
    { value: "Redis", label: "Redis" },
    { value: "Elasticsearch", label: "Elasticsearch" },
    { value: "Apache Kafka", label: "Apache Kafka" },
    { value: "Apache Hadoop", label: "Apache Hadoop" },
    { value: "Unity", label: "Unity" },
    { value: "Unreal Engine", label: "Unreal Engine" },
    { value: "Arduino", label: "Arduino" },
    { value: "Raspberry Pi", label: "Raspberry Pi" },
    { value: "VMware", label: "VMware" },
    { value: "Linux", label: "Linux" },
    { value: "Shell Scripting", label: "Shell Scripting" },
    { value: "Data Structures", label: "Data Structures" },
    { value: "Algorithms", label: "Algorithms" },
    { value: "Operating Systems", label: "Operating Systems" },
    { value: "Computer Networks", label: "Computer Networks" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "DevOps", label: "DevOps" },
    { value: "Agile", label: "Agile" },
    { value: "Scrum", label: "Scrum" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Design Patterns", label: "Design Patterns" },
    { value: "Test Automation", label: "Test Automation" },
    { value: "Manual Testing", label: "Manual Testing" },
    { value: "Business Intelligence", label: "Business Intelligence" },
    { value: "Tableau", label: "Tableau" },
    { value: "Power BI", label: "Power BI" },
  ];

  const designationType = [
    { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
    { value: "FRONTED_DEVLOPER", label: "Frontend Developer" },
    { value: "BACKEND_DEVLOPER", label: "Backend Developer" },
    { value: "FULL_STACK_DEVLOPER", label: "Full Stack Developer" },
    { value: "DATA_ANALYST", label: "Data Analyst" },
    { value: "DATA_SCIENTIST", label: "Data Scientist" },
    { value: "PRODUCT_MANAGER", label: "Product Manager" },
    { value: "UI_UX", label: "UX/UI Designer" },
    { value: "QA", label: "QA Engineer" },
    { value: "DEVOPS", label: "DevOps Engineer" },
    { value: "BUSNESS_ANALYST", label: "Business Analyst" },
    { value: "TECHNICSL_SUPPORT", label: "Technical Support Engineer" },
  ];


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
                    onChange={handleMultiSkill}
                    options={appliedSkillsType}
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
                    type="number"
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
                    type="number"
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
                    label="Designation"
                    name="designation"
                    className="select-border"
                    options={designationType}
                    placeholder={InputPlaceHolder("Degination")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "designation",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.designation}
                    value={
                      dynamicFind(
                        designationType,
                        validation.values.designation
                      ) || ""
                    }
                    touched={validation.touched.designation}
                    error={validation.errors.designation}
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
