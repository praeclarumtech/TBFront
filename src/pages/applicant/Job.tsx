/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  jobApplicantSchema,
  SelectedOption,
  SelectedOptionRole,
} from "interfaces/applicant.interface";
import BaseTextarea from "components/BaseComponents/BaseTextArea";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import moment from "moment";
import { ViewAppliedSkills } from "api/skillsApi";

const {
  projectTitle,
  Modules,
  communicationOptions,
  designationType,
  anyHandOnOffers,
  workPreferenceType,
  // skillOptions,
} = appConstants;

type Role =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Data Analyst"
  | "Data Scientist"
  | "Product Manager"
  | "UX/UI Designer"
  | "QA Engineer"
  | "DevOps Engineer"
  | "Business Analyst"
  | "Technical Support Engineer"
  | "Software Engineer"
  | "MERN Stack Developer" 
  | "MEAN Stack Developer" 
  | "DotNet Full Stack Developer" 
  | "Java Developer" 
  | "Python Developer" 
  | "PHP Developer" 
  | "Other"
  | "Na";

const technologyOptions: Record<Role, string[]> = {
  "Frontend Developer": ["React", "MUI", "TypeScript", "JavaScript", "Angular"],
  "Backend Developer": ["Nodejs", "Nextjs", "Express", "MongoDB", "GraphQL"],
  "Full Stack Developer": [
    "React",
    "Nodejs",
    // "Next.js",
    "Express",
    "MongoDB",
    "GraphQL",
  ],
  "Data Analyst": ["Python", "R", "SQL", "Power BI", "Excel"],
  "Data Scientist": ["Python", "R", "Pandas", "Matplotlib"],
  "Product Manager": ["Jira", "Trello", "Confluence", "Asana"],
  "UX/UI Designer": ["Figma", "Sketch", "Adobe XD", "InVision"],
  "QA Engineer": ["Selenium", "Jest", "Mocha", "JUnit", "Cypress"],
  "DevOps Engineer": ["Docker", "Kubernetes", "Terraform", "AWS"],
  "Business Analyst": ["SQL", "Excel", "Tableau", "Power BI"],
  "Technical Support Engineer": ["Zendesk", "Freshdesk", "Jira", "ServiceNow"],
  "Software Engineer": ["Java", "Python", "C#", "SQL", "Git"], 
  "MERN Stack Developer": [
    "MongoDB",
    "Express",
    "React",
    "NodeJs",
    "JavaScript",
  ],
  "MEAN Stack Developer": [
    "MongoDB",
    "Express",
    "Angular",
    "NodeJs",
    "JavaScript",
  ], 
  "DotNet Full Stack Developer": [".NET", "C#", "SQL", "JavaScript", "Angular"], 
  "Java Developer": ["Java", "Spring Boot", "Hibernate", "SQL", "Maven"], 
  "Python Developer": ["Python", "Django", "Flask", "SQL", "Git"], 
  "PHP Developer": ["PHP", "Laravel", "MySQL", "JavaScript", "HTML/CSS"], 
  Other: [],
  Na: [],
};

const JobDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [selectedMulti, setSelectedMulti] = useState<any>([]);
  // const [selectedMultiRole, setSelectedMultiRole] = useState<any>([]);
  const [selectedRole, setSelectedRole] = useState<string>(
    initialValues?.appliedRole || ""
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  // const [meta, setTechnologyExperience] = useState<any>({});

  const formattedlastFollowUpDate = initialValues.lastFollowUpDate
    ? moment(initialValues.lastFollowUpDate).format("YYYY-MM-DD")
    : "";
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPkg: initialValues?.currentPkg || "0",
      expectedPkg: initialValues?.expectedPkg || "0",
      negotiation: initialValues?.negotiation || "0",
      noticePeriod: initialValues?.noticePeriod || "0",
      workPreference: initialValues?.workPreference || "",
      practicalUrl: initialValues?.practicalUrl || "",
      practicalFeedback: initialValues?.practicalFeedback || "",
      comment: initialValues?.comment || "",
      communicationSkill: initialValues?.communicationSkill || "",
      // appliedRole: initialValues?.appliedRole || "",
      currentCompanyName: initialValues?.currentCompanyName || "",
      anyHandOnOffers: initialValues?.anyHandOnOffers || false,
      // lastFollowUpDate: initialValues?.lastFollowUpDate || "",
      lastFollowUpDate: formattedlastFollowUpDate,
      totalExperience: initialValues?.totalExperience || "0",
      relevantSkillExperience: initialValues?.relevantSkillExperience || "0",
      appliedSkills: initialValues?.appliedSkills || [],
      otherSkills: initialValues?.otherSkills || "",
      referral: initialValues?.referral || "",
      resumeUrl: initialValues?.resumeUrl || "",
      rating: initialValues?.rating || "",
      portfolioUrl: initialValues?.portfolioUrl || "",
      currentCompanyDesignation: initialValues?.currentCompanyDesignation || "",
      preferredLocations: initialValues?.preferredLocations || "",
      linkedinUrl: initialValues?.linkedinUrl || "",
      clientCvUrl: initialValues?.clientCvUrl || "",
      clientFeedback: initialValues?.clientFeedback || "",
      appliedRole: initialValues?.appliedRole || selectedRole || "",
      // meta: initialValues?.meta || "",
      meta: initialValues?.meta || {},
    },
    validationSchema: jobApplicantSchema,
    onSubmit: (data: any) => {
      setLoading(true);

      const appliedSkillsNames = selectedMulti.map((item: any) => item.label);

      const updatedData = {
        ...data,
        appliedSkills: appliedSkillsNames,
        // meta,
      };

      onNext(updatedData);
      // console.log("job Data:", updatedData);
      // onNext(data);

      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    const fetchSkills = async () => {
      try {
        const page = 1;
        const pageSize = 50;
        const limit = 200;
        const response = await ViewAppliedSkills({ page, pageSize, limit });
        const skillData = response?.data.data || [];

        setSkillOptions(
          skillData.map((item: any) => ({
            label: item.skills,
            value: item._id,
          }))
        );

        if (
          initialValues?.appliedSkills &&
          initialValues?.appliedSkills.length
        ) {
          const selectedSkills = skillData
            .filter((option: { skills: any }) =>
              initialValues.appliedSkills.includes(option.skills)
            )
            .map((item: { skills: any; _id: any }) => ({
              label: item.skills,
              value: item._id,
            }));

          setSelectedMulti(selectedSkills);
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [initialValues]);

  const handleMultiSkill = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.value) || [];
    validation.setFieldValue("appliedSkills", ids);
    setSelectedMulti(selectedMulti);
  };

  // const handleRoleChange = (selectedOption: SelectedOption) => {
  //   setSelectedRole(selectedOption.value);
  //   validation.setFieldValue("appliedRole", selectedOption.value);

  //   setTechnologyExperience({});
  // };
  // const handleRoleChange = (selectedOption: SelectedOption | null) => {
  //   if (selectedOption) {
  //     setSelectedRole(selectedOption.value);
  //     validation.setFieldValue("appliedRole", selectedOption.value);

  //     setTechnologyExperience({});
  //   } else {
  //     console.error("handleRoleChange: selectedOption is null");
  //   }
  // };

  // const handleRoleChange = (SelectedOptionRole: SelectedOptionRole | null) => {
  //   if (SelectedOptionRole) {
  //     setSelectedRole(SelectedOptionRole.value);
  //     validation.setFieldValue("appliedRole", SelectedOptionRole.value);

  //     setTechnologyExperience({});
  //   } else {
  //     setSelectedRole("");
  //     validation.setFieldValue("appliedRole", "");

  //     setTechnologyExperience({});
  //   }
  // };

  const handleRoleChange = (SelectedOptionRole: SelectedOptionRole | null) => {
    if (SelectedOptionRole) {
      const newRole = SelectedOptionRole.value;
      setSelectedRole(newRole);
      validation.setFieldValue("appliedRole", newRole);

      const roleTechnologies = technologyOptions[newRole as Role] || [];
      const newMeta = roleTechnologies.reduce((acc: any, tech: string) => {
        acc[tech] = validation.values.meta[tech] || "";
        return acc;
      }, {});
      validation.setFieldValue("meta", newMeta);
    } else {
      setSelectedRole("");
      validation.setFieldValue("appliedRole", "");
      validation.setFieldValue("meta", {});
    }
  };

  // const handleTechnologyExperienceChange = (tech: string, value: string) => {
  //   setTechnologyExperience((prevState: any) => ({
  //     ...prevState,
  //     [tech]: value,
  //   }));
  // };
 const handleTechnologyExperienceChange = (tech: string, value: string) => {
   validation.setFieldValue(`meta.${tech}`, value);
 };


  // useEffect(() => {
  //   if (selectedRole in technologyOptions) {
  //     const roleTechnologies = technologyOptions[selectedRole as Role] || [];
  //     const updatedMeta = roleTechnologies.reduce((acc: any, tech: string) => {
  //       acc[tech] = initialValues?.meta?.[tech] || "";
  //       return acc;
  //     }, {});
  //     setTechnologyExperience(updatedMeta);
  //   }
  // }, [selectedRole, initialValues?.meta]);


  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Row className="mb-4">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            className="p-3"
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Row className="mb-4">
                <Col xs={12} sm={12} md={12} lg={6} className="mb-3">
                  <MultiSelect
                    label="Applied Skills"
                    name="appliedSkills"
                    className="select-border"
                    value={selectedMulti || []}
                    isMulti={true}
                    onChange={handleMultiSkill}
                    options={skillOptions}
                    touched={validation.touched.appliedSkills}
                    error={validation.errors.appliedSkills}
                    handleBlur={validation.handleBlur}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="mb-3">
                  <BaseInput
                    label="Other Skills"
                    name="otherSkills"
                    type="text"
                    placeholder={InputPlaceHolder("Other Skills")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.otherSkills}
                    touched={validation.touched.otherSkills}
                    error={validation.errors.otherSkills}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                  <BaseInput
                    label="Total Experience(Year)"
                    name="totalExperience"
                    type="text"
                    placeholder={InputPlaceHolder("Total Experience")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 30) {
                        validation.setFieldValue("totalExperience", value);
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue("totalExperience", value);
                      } else if (!value) {
                        validation.setFieldValue("totalExperience", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 30) {
                          validation.setFieldValue(
                            "totalExperience",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue("totalExperience", "");
                        }
                      } else {
                        validation.setFieldValue("totalExperience", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.totalExperience}
                    touched={validation.touched.totalExperience}
                    error={validation.errors.totalExperience}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                  <BaseInput
                    label="Relevant Experience(Year)"
                    name="relevantSkillExperience"
                    type="text"
                    placeholder={InputPlaceHolder("Relevant skill experience")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 30) {
                        validation.setFieldValue(
                          "relevantSkillExperience",
                          value
                        );
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue(
                          "relevantSkillExperience",
                          value
                        );
                      } else if (!value) {
                        validation.setFieldValue("relevantSkillExperience", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 30) {
                          validation.setFieldValue(
                            "relevantSkillExperience",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue(
                            "relevantSkillExperience",
                            ""
                          );
                        }
                      } else {
                        validation.setFieldValue("relevantSkillExperience", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.relevantSkillExperience}
                    touched={validation.touched.relevantSkillExperience}
                    error={validation.errors.relevantSkillExperience}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                  <BaseSelect
                    label="Javascript Rate(out of 10)"
                    name="rating"
                    className="select-border"
                    options={communicationOptions}
                    placeholder="Rating"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "rating",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        communicationOptions,
                        String(validation.values.rating)
                      ) || ""
                    }
                    touched={validation.touched.rating}
                    error={validation.errors.rating}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                  <BaseSelect
                    label="English Communication(out of 10)"
                    name="communicationSkill"
                    className="select-border"
                    options={communicationOptions}
                    placeholder="Communication Skill"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "communicationSkill",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        communicationOptions,
                        String(validation.values.communicationSkill)
                      ) || ""
                    }
                    touched={validation.touched.communicationSkill}
                    error={validation.errors.communicationSkill}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Current Company"
                    name="currentCompanyName"
                    type="text"
                    placeholder={InputPlaceHolder("Current Company")}
                    handleChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                      validation.setFieldValue("currentCompanyName", value);
                    }}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentCompanyName}
                    touched={validation.touched.currentCompanyName}
                    error={validation.errors.currentCompanyName}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseSelect
                    label="Current Company Designation"
                    name="currentCompanyDesignation"
                    className="select-border"
                    options={designationType}
                    placeholder={InputPlaceHolder("Degination")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "currentCompanyDesignation",
                        selectedOption?.value || "Na"
                      );
                    }}
                    handleBlur={validation.currentCompanyDesignation}
                    value={
                      dynamicFind(
                        designationType,
                        validation.values.currentCompanyDesignation
                      ) || 'Na'
                    }
                    touched={validation.touched.currentCompanyDesignation}
                    error={validation.errors.currentCompanyDesignation}
                  />
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} className="mb-3">
                  <BaseInput
                    label="Current Package (LPA)"
                    name="currentPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Current package")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 1000
                      ) {
                        validation.setFieldValue("currentPkg", value);
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue("currentPkg", value);
                      } else if (!value) {
                        validation.setFieldValue("currentPkg", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 1000) {
                          validation.setFieldValue(
                            "currentPkg",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue("currentPkg", "");
                        }
                      } else {
                        validation.setFieldValue("currentPkg", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.currentPkg}
                    touched={validation.touched.currentPkg}
                    error={validation.errors.currentPkg}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Expected Package (LPA)"
                    name="expectedPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Expected Package")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 1000
                      ) {
                        validation.setFieldValue("expectedPkg", value);
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue("expectedPkg", value);
                      } else if (!value) {
                        validation.setFieldValue("expectedPkg", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 1000) {
                          validation.setFieldValue(
                            "expectedPkg",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue("expectedPkg", "");
                        }
                      } else {
                        validation.setFieldValue("expectedPkg", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.expectedPkg}
                    touched={validation.touched.expectedPkg}
                    error={validation.errors.expectedPkg}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Negotiation (₹)"
                    name="negotiation"
                    type="text"
                    placeholder={InputPlaceHolder("Negotiation (₹)")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 100000
                      ) {
                        validation.setFieldValue("negotiation", value);
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue("negotiation", value);
                      } else if (!value) {
                        validation.setFieldValue("negotiation", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 100000) {
                          validation.setFieldValue(
                            "negotiation",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue("negotiation", "");
                        }
                      } else {
                        validation.setFieldValue("negotiation", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.negotiation}
                    touched={validation.touched.negotiation}
                    error={validation.errors.negotiation}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseInput
                    label="Notice Period (Days)"
                    name="noticePeriod"
                    type="text"
                    placeholder={InputPlaceHolder("Notice period")}
                    handleChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9.]/g, "");

                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }

                      if (parts[1]?.length > 2) {
                        value = parts[0] + "." + parts[1].slice(0, 2);
                      }

                      const numValue = parseFloat(value);

                      if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 100
                      ) {
                        validation.setFieldValue("noticePeriod", value);
                      } else if (value === "" || value === ".") {
                        validation.setFieldValue("noticePeriod", value);
                      } else if (!value) {
                        validation.setFieldValue("noticePeriod", "");
                      }
                    }}
                    handleBlur={(e) => {
                      const value = e.target.value;

                      if (value && !isNaN(parseFloat(value))) {
                        const numValue = parseFloat(value);
                        if (numValue >= 0 && numValue <= 100000) {
                          validation.setFieldValue(
                            "noticePeriod",
                            numValue.toFixed(2)
                          );
                        } else {
                          validation.setFieldValue("noticePeriod", "");
                        }
                      } else {
                        validation.setFieldValue("noticePeriod", "");
                      }
                      validation.handleBlur(e);
                    }}
                    value={validation.values.noticePeriod}
                    touched={validation.touched.noticePeriod}
                    error={validation.errors.noticePeriod}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
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
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseInput
                    label="Preferred Location(s)"
                    name="preferredLocations"
                    type="text"
                    placeholder={InputPlaceHolder("Preferred Locations")}
                    handleChange={(e) => {
                      let value = e.target.value;

                      value = value.replace(/[^a-zA-Z, ]/g, "");

                      validation.setFieldValue("preferredLocations", value);

                      validation.validateField("preferredLocations");
                    }}
                    handleBlur={validation.handleBlur}
                    value={validation.values.preferredLocations}
                    touched={validation.touched.preferredLocations}
                    error={validation.errors.preferredLocations}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseSelect
                    label="Applied Role"
                    name="appliedRole"
                    className="select-border"
                    options={designationType}
                    placeholder={InputPlaceHolder("Applied Role")}
                    handleChange={handleRoleChange}
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
                {selectedRole &&
                  selectedRole !== "Other" &&
                  selectedRole !== "Na" && (
                    <div className="mb-4 ">
                      <h5>Technologies for {selectedRole}:</h5>
                      <div className="d-flex flex-wrap space-x-2  ">
                        {technologyOptions[selectedRole as Role].map(
                          (tech: string) => (
                            <Col
                              xs={12}
                              sm={2}
                              md={2}
                              lg={2}
                              xl={2}
                              className="mb-3"
                              key={tech}
                            >
                              {/* <BaseInput
                                name={tech}
                                type="text"
                                className=" "
                                label={`${tech} Exp.(Yrs)`}
                                placeholder={` ${tech}`}
                                value={meta[tech] || ""}
                                handleChange={(e) => {
                                  handleTechnologyExperienceChange(
                                    tech,
                                    e.target.value
                                  );
                                  validation.setFieldValue(
                                    tech,
                                    e.target.value
                                  );
                                }}
                              /> */}

                              <BaseInput
                                name={tech}
                                type="text"
                                className=" "
                                label={`${tech} Exp.(Yrs)`}
                                placeholder={`${tech}`}
                                // value={meta[tech] || ""}
                                value={validation.values.meta[tech] || ""}
                                handleChange={(e) => {
                                  let value = e.target.value;

                                  value = value.replace(/[^0-9.]/g, "");

                                  const parts = value.split(".");

                                  if (parts.length > 2) {
                                    value =
                                      parts[0] + "." + parts.slice(1).join("");
                                  }

                                  if (parts[1]?.length > 2) {
                                    value =
                                      parts[0] + "." + parts[1].slice(0, 2);
                                  }

                                  const numValue = parseFloat(value);
                                  if (
                                    !isNaN(numValue) &&
                                    numValue >= 0 &&
                                    numValue <= 30
                                  ) {
                                    validation.setFieldValue(tech, value);
                                    handleTechnologyExperienceChange(
                                      tech,
                                      value
                                    );
                                  } else if (value === "" || value === ".") {
                                    validation.setFieldValue(tech, value);
                                    handleTechnologyExperienceChange(
                                      tech,
                                      value
                                    );
                                  } else {
                                    // Don't update anything if the value is invalid
                                    return;
                                  }
                                  validation.setFieldValue(
                                    `meta.${tech}`,
                                    value
                                  );
                                }}
                                handleBlur={(e) => {
                                  const value = e.target.value;

                                  if (value && !isNaN(parseFloat(value))) {
                                    const numValue = parseFloat(value);
                                    if (numValue >= 0 && numValue <= 30) {
                                      validation.setFieldValue(
                                        tech,
                                        numValue.toFixed(2)
                                      );
                                    } else {
                                      validation.setFieldValue(tech, "");
                                    }
                                  } else {
                                    validation.setFieldValue(tech, "");
                                  }

                                  validation.handleBlur(e);
                                }}
                                // value={validation.values[tech]}
                                touched={validation.touched.meta?.[tech]}
                                error={validation.errors.meta?.[tech]}
                                passwordToggle={false}
                              />
                            </Col>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {/* {(selectedRole === "Other" || selectedRole === "Na") && (
                  <Col xs={12} sm={4} md={3} lg={1} className="mb-3">
                    <BaseInput
                      type="text"
                      name="otherTechnologies"
                      label="Other Technologies"
                      placeholder={InputPlaceHolder("Other Technologies")}
                      value={validation.values.otherSkills}
                      handleChange={(e) =>
                        validation.setFieldValue("otherSkills", e.target.value)
                      }
                      handleBlur={validation.handleBlur}
                    />
                  </Col>
                )} */}

                <Col xs={12} sm={4} md={4} lg={4} className="mb-3">
                  <BaseSelect
                    label="Any Hand On Offers ?"
                    name="anyHandOnOffers"
                    className="select-border"
                    options={anyHandOnOffers}
                    placeholder="Select an option"
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "anyHandOnOffers",
                        selectedOption?.value || false
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        anyHandOnOffers,
                        validation.values.anyHandOnOffers
                      ) || false
                    }
                    touched={validation.touched.anyHandOnOffers}
                    error={validation.errors.anyHandOnOffers}
                  />
                </Col>
                <Col xs={12} sm={4} md={4} lg={4} className="mb-3">
                  <BaseInput
                    label="Referral"
                    name="referral"
                    type="text"
                    placeholder={InputPlaceHolder("Referral")}
                    handleChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                      validation.setFieldValue("referral", value);
                    }}
                    handleBlur={validation.handleBlur}
                    value={validation.values.referral}
                    touched={validation.touched.referral}
                    error={validation.errors.referral}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={4} lg={4} className="mb-3  mb-sm-0">
                  <BaseInput
                    label="Last Follow Up Date"
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
                <Col xs={12} md={8} lg={4} sm={12} className="mb-3">
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
                <Col xs={12} md={6} lg={4} sm={12} className="mb-3">
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
                <Col xs={12} md={6} lg={4} sm={12} className="mb-3">
                  <BaseInput
                    label="Linkedin Url"
                    name="linkedinUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Linkedin URL")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.linkedinUrl}
                    touched={validation.touched.linkedinUrl}
                    error={validation.errors.linkedinUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={12} lg={4} sm={12} className="mb-3">
                  <BaseInput
                    label="Client Cv Url"
                    name="clientCvUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Client Cv Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.clientCvUrl}
                    touched={validation.touched.clientCvUrl}
                    error={validation.errors.clientCvUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  className="!md:mb-3 !mb-3 mb-sm-0"
                >
                  <BaseTextarea
                    label="Client Feedback"
                    name="clientFeedback"
                    className="mb-3"
                    placeholder={InputPlaceHolder(
                      "Describe about Us Practical Task..."
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.clientFeedback}
                    touched={validation.touched.clientFeedback}
                    error={validation.errors.clientFeedback}
                    passwordToggle={false}
                    rows={2}
                    cols={50}
                  />
                </Col>
                <Col xs={12} md={12} lg={4} sm={12} className="!mb-3  mb-sm-0">
                  <BaseInput
                    label="Practical Url"
                    name="practicalUrl"
                    type="url"
                    className="mb-3"
                    placeholder={InputPlaceHolder("Practical Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalUrl}
                    touched={validation.touched.practicalUrl}
                    error={validation.errors.practicalUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  className="!md:mb-3 !mb-3  mb-sm-0"
                >
                  <BaseTextarea
                    label="Practical Feedback"
                    name="practicalFeedback"
                    className="mb-3"
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
                <Col xs={12} sm={12} md={12} lg={12}>
                  <BaseTextarea
                    label="Comments"
                    name="comment"
                    placeholder={InputPlaceHolder(
                      "Describe your experience and expectations"
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.comment}
                    touched={validation.touched.comment}
                    error={validation.errors.comment}
                    passwordToggle={false}
                    multiline
                    rows={2}
                    cols={50}
                  />
                </Col>
              </Row>
            )}
            <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
              {" "}
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
        </Row>
      </Container>
    </Fragment>
  );
};

export default JobDetailsForm;
