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
  // SelectedOptionRole,
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
import { viewAllDesignation } from "api/designation";
import { viewRoleSkill, getSkillsByAppliedRole } from "api/roleApi";

const {
  projectTitle,
  Modules,
  communicationOptions,
  anyHandOnOffers,
  workPreferenceType,
} = appConstants;

const JobDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;

  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [selectedMulti, setSelectedMulti] = useState<any>([]);

  const [designationOptions, setDesignationOptions] = useState<any[]>([]);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [roleSkills, setRoleSkills] = useState<string[]>([]);

  const [technologyExperience, setTechnologyExperience] = useState<{
    [skill: string]: string;
  }>(initialValues.meta || {});

  const formattedlastFollowUpDate = initialValues.lastFollowUpDate
    ? moment(initialValues.lastFollowUpDate).format("YYYY-MM-DD")
    : "";

  const initialDesignationValue =
    initialValues?.currentCompanyDesignation || "";

  const initialAppliedRoleValue = initialValues?.appliedRole || "";

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
      currentCompanyName: initialValues?.currentCompanyName || "",
      anyHandOnOffers: initialValues?.anyHandOnOffers || false,
      lastFollowUpDate: formattedlastFollowUpDate,
      totalExperience: initialValues?.totalExperience || "0",
      relevantSkillExperience: initialValues?.relevantSkillExperience || "0",
      appliedSkills: initialValues?.appliedSkills || [],
      otherSkills: initialValues?.otherSkills || "",
      referral: initialValues?.referral || "",
      resumeUrl: initialValues?.resumeUrl || "",
      gitHubUrl: initialValues?.gitHubUrl || "",
      rating: initialValues?.rating || "",
      portfolioUrl: initialValues?.portfolioUrl || "",
      currentCompanyDesignation: initialDesignationValue,
      preferredLocations: initialValues?.preferredLocations || "",
      linkedinUrl: initialValues?.linkedinUrl || "",
      clientCvUrl: initialValues?.clientCvUrl || "",
      clientFeedback: initialValues?.clientFeedback || "",
      appliedRole: initialAppliedRoleValue,
      meta: initialValues?.meta || {},
    },
    validationSchema: jobApplicantSchema,
    onSubmit: (data: any) => {
      setLoading(true);

      const appliedSkillsNames = selectedMulti.map((item: any) => item.label);

      const appliedRole = dynamicFind(roleOptions, data.appliedRole);
      const appliedRoleName = appliedRole ? appliedRole.label : "";
      const currentDesignation = dynamicFind(
        designationOptions,
        data.currentCompanyDesignation
      );
      const currentCompanyDesignation = currentDesignation
        ? currentDesignation.label
        : "";

      onNext({
        ...data,
        appliedSkills: appliedSkillsNames,
        currentCompanyDesignation: currentCompanyDesignation,
        appliedRole: appliedRoleName,
        roleSkills,
      });

      setLoading(false);
    },
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await viewAllDesignation({ limit: 1000 });
        const designationData = response?.data.data || [];
        const options = designationData.map((item: any) => ({
          label: item.designation,
          value: item._id,
        }));
        setDesignationOptions(options);

        // Set initial designation if it exists
        if (initialValues?.currentCompanyDesignation) {
          const selectedDesignation = options.find(
            (opt: any) => opt.label === initialValues.currentCompanyDesignation
          );
          if (selectedDesignation) {
            validation.setFieldValue(
              "currentCompanyDesignation",
              selectedDesignation.value
            );
          }
        }
      } catch (error) {
        errorHandle(error);
      }
    };
    fetchDesignations();
  }, [initialValues]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await viewRoleSkill({ limit: 1000 });
        const roleData = response?.data?.data || [];
        const options = roleData.map((item: any) => ({
          label: item.appliedRole,
          value: item._id,
        }));
        setRoleOptions(options);

        // Set initial role if it exists
        if (initialValues?.appliedRole) {
          const selectedRole = options.find(
            (opt: any) => opt.label === initialValues.appliedRole
          );
          if (selectedRole) {
            validation.setFieldValue("appliedRole", selectedRole.value);
            // Also trigger role change to load skills
            handleRoleChange(selectedRole);
          }
        }
      } catch (error) {
        errorHandle(error);
      }
    };
    fetchRoles();
  }, [initialValues]);

  useEffect(() => {
    if (
      validation.values.appliedRole &&
      designationOptions.length > 0 &&
      skillOptions.length > 0
    ) {
      const roleId = validation.values.appliedRole;
      const selectedDesignation = designationOptions.find(
        (opt) => opt.value === roleId
      );
      const roleLabel = selectedDesignation?.label;

      if (roleLabel) {
        viewRoleSkill({ page: 1, pageSize: 50, limit: 5000 })
          .then((response) => {
            if (response?.success) {
              const allRoleSkills = response.data.data || [];
              const selectedRoleSkills = allRoleSkills.find(
                (item: any) => item.appliedRole === roleLabel
              );

              if (selectedRoleSkills) {
                const skillIDs: string[] = selectedRoleSkills.skill || [];
                const skillLabels = skillOptions
                  .filter((item: any) => skillIDs.includes(item.value))
                  .map((item: any) => item.label);

                setRoleSkills(skillLabels);
              }
            }
          })
          .catch((error) => errorHandle(error));
      }
    }
  }, [designationOptions, skillOptions, validation.values.appliedRole]);

  useEffect(() => {
    setLoading(true);
    const fetchSkills = async () => {
      try {
        const page = 1;
        const pageSize = 50;
        const limit = 1000;
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

  useEffect(() => {
    // If editing and a role is already selected, fetch its skills
    if (
      validation.values.appliedRole &&
      roleOptions.length > 0 &&
      skillOptions.length > 0
    ) {
      const selectedRole = roleOptions.find(
        (opt) => opt.value === validation.values.appliedRole
      );
      const roleLabel = selectedRole?.label;
      if (roleLabel) {
        getSkillsByAppliedRole(roleLabel)
          .then((response) => {
            const skillIds = response?.data?.[0]?.skill || [];
            setRoleSkills(getSkillLabelsFromIds(skillIds));
          })
          .catch(() => setRoleSkills([]));
      }
    }
  }, [validation.values.appliedRole, roleOptions, skillOptions]);

  useEffect(() => {
    setTechnologyExperience(initialValues.meta || {});
  }, [initialValues.meta]);

  const handleMultiSkill = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.value) || [];
    validation.setFieldValue("appliedSkills", ids);
    setSelectedMulti(selectedMulti);
  };

  // Utility to map skill IDs to labels
  const getSkillLabelsFromIds = (ids: string[]) => {
    return skillOptions
      .filter((item: any) => ids.includes(item.value))
      .map((item: any) => item.label);
  };

  const handleRoleChange = async (SelectedOptionRole: any) => {
    if (SelectedOptionRole) {
      const roleId = SelectedOptionRole.value;
      validation.setFieldValue("appliedRole", roleId);

      // Find the role label (name) from roleOptions
      const selectedRole = roleOptions.find((opt) => opt.value === roleId);
      const roleLabel = selectedRole?.label;

      if (roleLabel) {
        try {
          const response = await getSkillsByAppliedRole(roleLabel);
          const skillIds = response?.data?.[0]?.skill || [];
          setRoleSkills(getSkillLabelsFromIds(skillIds));
          setTechnologyExperience({});
        } catch {
          setRoleSkills([]);
          setTechnologyExperience({});
        }
      } else {
        setRoleSkills([]);
        setTechnologyExperience({});
      }
    } else {
      validation.setFieldValue("appliedRole", "");
      validation.setFieldValue("meta", {});
      setRoleSkills([]);
      setTechnologyExperience({});
    }
  };

  const handleTechnologyExperienceChange = (skill: string, value: string) => {
    const updated = { ...technologyExperience, [skill]: value };
    setTechnologyExperience(updated);
    validation.setFieldValue("meta", updated);
  };

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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="mb-3">
                  <BaseInput
                    label="Other Skills (Optional)"
                    name="otherSkills"
                    type="text"
                    placeholder={InputPlaceHolder("Other Skills (Optional)")}
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
                    placeholder={InputPlaceHolder(
                      "Total Experience (Optional)"
                    )}
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
                            numValue.toFixed(1)
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
                    isRequired={false}
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
                            numValue.toFixed(1)
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
                    isRequired={false}
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
                    isRequired={false}
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
                    isRequired={false}
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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseSelect
                    label="Current Company Designation"
                    name="currentCompanyDesignation"
                    className="select-border"
                    options={designationOptions}
                    placeholder={InputPlaceHolder("Degination")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "currentCompanyDesignation",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.currentCompanyDesignation}
                    value={
                      dynamicFind(
                        designationOptions,
                        validation.values.currentCompanyDesignation
                      ) || "Na"
                    }
                    touched={validation.touched.currentCompanyDesignation}
                    error={validation.errors.currentCompanyDesignation}
                    isRequired={true}
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
                    isRequired={false}
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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Negotiation (₹) (Optional)"
                    name="negotiation"
                    type="text"
                    placeholder={InputPlaceHolder("Negotiation (₹) (Optional)")}
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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseSelect
                    label="Work Preference"
                    name="workPreference"
                    className="select-border"
                    options={workPreferenceType}
                    placeholder={InputPlaceHolder("Work Preference")}
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
                    isRequired={false}
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
                    isRequired={false}
                  />
                </Col>

                <Col xs={12} sm={6} md={6} lg={4} className="mb-3">
                  <BaseSelect
                    label="Applied Role"
                    name="appliedRole"
                    className="select-border"
                    options={roleOptions}
                    placeholder={InputPlaceHolder("Applied Role")}
                    handleChange={handleRoleChange}
                    handleBlur={validation.appliedRole}
                    value={
                      dynamicFind(roleOptions, validation.values.appliedRole) ||
                      ""
                    }
                    touched={validation.touched.appliedRole}
                    error={validation.errors.appliedRole}
                    isRequired={true}
                  />
                </Col>

                {roleSkills.length > 0 && (
                  <div className="mb-4">
                    <h5>
                      Technologies for{" "}
                      {
                        roleOptions.find(
                          (opt) => opt.value === validation.values.appliedRole
                        )?.label
                      }
                      :
                    </h5>
                    <Row>
                      {roleSkills.map((skill) => (
                        <Col key={skill} xs={12} sm={6} md={3} className="mb-3">
                          <label>
                            <b>{skill} Exp.(Yrs)</b>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={skill}
                            value={technologyExperience[skill] || ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              handleTechnologyExperienceChange(skill, value);
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} sm={4} md={4} lg={4} className="mb-3">
                  <BaseInput
                    label="Referral (Optional)"
                    name="referral"
                    type="text"
                    placeholder={InputPlaceHolder("Referral (Optional)")}
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
                <Col xs={12} sm={4} md={4} lg={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Last Follow Up Date (Optional)"
                    name="lastFollowUpDate"
                    type="date"
                    placeholder={InputPlaceHolder(
                      "Last Follow UpDate (Optional)"
                    )}
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
                    label="Portfolio URL (Optional)"
                    name="portfolioUrl"
                    type="text"
                    placeholder={InputPlaceHolder("Portfolio URL (Optional)")}
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
                    label="Resume URL"
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
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={4} sm={12} className="mb-3">
                  <BaseInput
                    label="Linkedin URL (Optional)"
                    name="linkedinUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Linkedin URL (Optional)")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.linkedinUrl}
                    touched={validation.touched.linkedinUrl}
                    error={validation.errors.linkedinUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={4} sm={12} className="mb-3">
                  <BaseInput
                    label="Git-Hub URL"
                    name="gitHubUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Git-hub URL")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.gitHubUrl}
                    touched={validation.touched.gitHubUrl}
                    error={validation.errors.gitHubUrl}
                    passwordToggle={false}
                    // title="Please Upload Resume on Google Drive and share pulic url (Only PDF files allowed)"
                    isRequired={false}
                  />
                </Col>
                <Col xs={12} md={12} lg={4} sm={12} className="mb-3">
                  <BaseInput
                    label="Client CV URL (Optional)"
                    name="clientCvUrl"
                    type="url"
                    placeholder={InputPlaceHolder("Client CV URL (Optional)")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.clientCvUrl}
                    touched={validation.touched.clientCvUrl}
                    error={validation.errors.clientCvUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={12} lg={4} sm={12} className="!mb-3  mb-sm-0">
                  <BaseInput
                    label="Practical URL (Optional)"
                    name="practicalUrl"
                    type="url"
                    className="mb-3"
                    placeholder={InputPlaceHolder("Practical URL (Optional)")}
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
                  lg={6}
                  className="!md:mb-3 !mb-3 mb-sm-0"
                >
                  <BaseTextarea
                    label="Client Feedback (Optional)"
                    name="clientFeedback"
                    className="mb-3"
                    placeholder={InputPlaceHolder("Feedback (Optional)")}
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

                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className="!md:mb-3 !mb-3  mb-sm-0"
                >
                  <BaseTextarea
                    label="Practical Feedback (Optional)"
                    name="practicalFeedback"
                    placeholder={InputPlaceHolder("Feedback (Optional)")}
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
                    placeholder={InputPlaceHolder("Add Comments")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.comment}
                    touched={validation.touched.comment}
                    error={validation.errors.comment}
                    passwordToggle={false}
                    multiline
                    isRequired={false}
                    rows={2}
                    cols={50}
                  />
                </Col>
              </Row>
            )}
            <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-end">
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
