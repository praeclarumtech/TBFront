/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Fragment } from "react";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import { Form, useParams, useNavigate } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import {
  CheckExistingApplicant,
  getApplicantDetails,
  updateApplicantQR,
  createApplicantQR,
} from "../../../api/applicantApi";
import {
  SelectedOption,
  QrApplicants,
  City,
} from "interfaces/applicant.interface";
import { ViewAppliedSkills } from "api/skillsApi";
import { viewAllDesignation } from "api/designation";
import BaseButton from "components/BaseComponents/BaseButton";
import { Card } from "antd";
import { toast } from "react-toastify";
import { viewRoleSkill } from "api/roleApi";
import uploadCloud from "assets/fonts/feather-icons/icons/upload-cloud.svg";
import { useLocation } from "react-router-dom";
import { viewAllCity } from "api/cityApis";
import { viewAllState } from "api/stateApi";

const { projectTitle, Modules, workPreferenceType, communicationOptions } =
  appConstants;

const QrFrom = () => {
  const location = useLocation();
  const jobId = location.state?.jobId;
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonloading, setButtonLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [selectedMulti, setSelectedMulti] = useState<any>([]);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [designationOptions, setDesignationOptions] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>();
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<City[]>([]);
  const [jobID, setJobID] = useState<any>();
  const [addedBy, setAddedBy] = useState<any>();
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const page = 1;
      const pageSize = 50;
      const limit = 1000;
      const response = await ViewAppliedSkills({ page, pageSize, limit });

      const options = response?.data?.data.map((item: any) => ({
        label: item.skills,
        value: item.skills,
      }));
      setSkillOptions(options);

      if (initialValues?.appliedSkills && initialValues?.appliedSkills.length) {
        const selectedSkills = options
          .filter((option: { skills: any }) =>
            initialValues.appliedSkills.includes(option.skills)
          )
          .map((item: { skills: any; _id: any }) => ({
            label: item.skills,
            value: item.skills,
          }));

        setSelectedMulti(selectedSkills);
      }
    } catch (error) {
      console.log("error skills", error);
      errorHandle(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await viewAllDesignation({ limit: 1000 });
      const designationData = response?.data.data || [];
      const options = designationData.map((item: any) => ({
        label: item.designation,
        value: item.designation,
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
            selectedDesignation.label
          );
        }
      }
    } catch (error) {
      errorHandle(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await viewRoleSkill({ limit: 1000 });
      const roleData = response?.data?.data || [];
      const options = roleData.map((item: any) => ({
        label: item.appliedRole,
        value: item.appliedRole,
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

  const getApplicant = (id: string | undefined | null) => {
    if (id !== undefined) {
      getApplicantDetails(id)
        .then((res: any) => {
          if (res.success) {
            setFormData(res.data);
          }
        })
        .catch((error) => {
          console.log("error getApplicant", error);

          errorHandle(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const getState = async () => {
      try {
        // const params = { country_id: selectedCountryId };
        const stateData = await viewAllState();
        if (stateData?.data) {
          setStates(
            stateData.data.item.map(
              (state: {
                state_name: string;
                _id: string;
                country_id: string;
              }) => ({
                label: state.state_name,
                value: state._id,
                country_id: state.country_id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      }
    };

    getState();
  }, []);

  useEffect(() => {
    const getCities = async (selectedStateId?: string) => {
      try {
        const params = { state_id: selectedStateId };
        const cityData = await viewAllCity(params);
        if (cityData?.data) {
          setCities(
            cityData.data.item.map(
              (city: { city_name: string; _id: string; state_id: string }) => ({
                label: city.city_name,
                value: city._id,
                state_id: city.state_id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      }
    };

    getCities();
  }, []);

  useEffect(() => {
    getApplicant(id);
    setJobID(jobId);
    setAddedBy("guest");
  }, [id, jobId]);

  useEffect(() => {
    fetchSkills();
    fetchDesignations();
    fetchRoles();
  }, []);

  const initialValues: any = formData;

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: initialValues?.name?.firstName || "",
      lastName: initialValues?.name?.lastName || "",
      phoneNumber: initialValues?.phone?.phoneNumber || "",
      email: initialValues?.email || "",
      currentPkg: initialValues?.currentPkg || "0",
      expectedPkg: initialValues?.expectedPkg || "0",
      noticePeriod: initialValues?.noticePeriod || "0",
      workPreference: initialValues?.workPreference || "",
      appliedSkills: initialValues?.appliedSkills || [],
      otherSkills: initialValues?.otherSkills || "",
      linkedinUrl: initialValues?.linkedinUrl || "",
      currentCompanyDesignation: initialValues?.currentCompanyDesignation || "",
      communicationSkill: initialValues?.communicationSkill || "",
      totalExperience: initialValues?.totalExperience || "",
      relevantSkillExperience: initialValues?.relevantSkillExperience || "",
      appliedRole: initialValues?.appliedRole || "",
      job_id: jobID || "",
      state: initialValues?.state || "",
      currentCity: initialValues?.currentCity || "",
      addedBy: addedBy || "",
    },
    validationSchema: QrApplicants,

    onSubmit: async (
      value: any
      // , { setSubmitting }
    ) => {
      setButtonLoading(true);
      // if (emailError) {
      //   // Optional: show a message or toast
      //   console.warn("Email validation error:", emailError);
      //   setSubmitting(false);
      //   setButtonLoading(false);
      //   return; // prevent submission
      // }
      try {
        const formData = new FormData();
        formData.append("name[firstName]", value.firstName);
        formData.append("name[lastName]", value.lastName);
        formData.append("phone[phoneNumber]", value.phoneNumber);
        formData.append("phone[whatsappNumber]", value.phoneNumber);
        formData.append("email", value.email);
        value.appliedSkills.forEach((skill: string) => {
          formData.append("appliedSkills[]", skill);
        });
        formData.append("otherSkills", value.otherSkills);
        formData.append("currentPkg", value.currentPkg);
        formData.append("expectedPkg", value.expectedPkg);
        formData.append("noticePeriod", value.noticePeriod);
        formData.append("workPreference", value.workPreference);
        formData.append(
          "currentCompanyDesignation",
          value.currentCompanyDesignation
        );
        formData.append("linkedinUrl", value.linkedinUrl);
        formData.append("communicationSkill", value.communicationSkill);
        formData.append("totalExperience", value.totalExperience);
        formData.append(
          "relevantSkillExperience",
          value.relevantSkillExperience
        );
        formData.append("appliedRole", value.appliedRole);
        formData.append("job_id", value.job_id);
        formData.append("state", value.state);
        formData.append("currentCity", value.currentCity);
        formData.append("addedBy", value.addedBy);
        if (resumeFile) {
          formData.append("attachments", resumeFile);
        }
        if (!id) {
          await createApplicantQR(formData, true);
          toast.success("Applicant created successfully");
          navigate("/applicants/qr-code-success");
        } else {
          await updateApplicantQR(formData, id, true);
          toast.success("Applicant updated successfully");
          navigate("/applicants/qr-code-success");
        }
      } catch (error: any) {
        setButtonLoading(false);
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage: string) => {
            toast.error(errorMessage);
          });
        } else {
          toast.error("An error occurred while updating the applicant.");
        }
      } finally {
        setButtonLoading(false);
      }
    },
  });

  const checkExistingField = async (field: string, value: string) => {
    if (field === "email") {
      setEmailError("");
    }
    if (field === "phoneNumber") {
      setPhoneNumberError("");
    }

    try {
      const params: {
        email?: string;
        phoneNumber?: number;
        whatsappNumber?: number;
      } = {};

      if (field === "email") {
        params.email = value;
      } else if (field === "phoneNumber") {
        params.phoneNumber = Number(value);
      } else if (field === "whatsappNumber") {
        params.whatsappNumber = Number(value);
      }

      const response = await CheckExistingApplicant(params);

      if (response?.data?.exists) {
        if (field === "email") {
          setEmailError(
            response?.message || "This email is already registered."
          );
        }
        if (field === "phoneNumber") {
          setPhoneNumberError("This phone number is already registered.");
        }
      } else {
        if (field === "email") {
          setEmailError("");
        }
        if (field === "phoneNumber") {
          setPhoneNumberError("");
        }
      }
    } catch (error) {
      errorHandle(error);

      return "Error while checking this field.";
    }
  };

  const handleMultiSkill = (selectedMulti: any) => {
    const skills = selectedMulti?.map((item: any) => item.label) || [];
    validation.setFieldValue("appliedSkills", skills);
    setSelectedMulti(selectedMulti);
  };

  const handleRoleChange = async (SelectedOptionRole: any) => {
    if (SelectedOptionRole) {
      const roleId = SelectedOptionRole.value;
      validation.setFieldValue("appliedRole", roleId);
    } else {
      validation.setFieldValue("appliedRole", "");
      validation.setFieldValue("meta", {});
    }
  };

  const handleStateChange = (selectedOption: SelectedOption) => {
    const selectedValue = selectedOption?.label || "";
    validation.setFieldValue("state", selectedValue);
  };

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card title="Job Profile">
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
                {loading ? (
                  <div className="my-5 d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <Row className="mb-2 g-3">
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="First Name"
                        name="firstName"
                        type="text"
                        className="select-border"
                        placeholder={InputPlaceHolder("First Name")}
                        handleChange={(e) => {
                          const value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          validation.setFieldValue("firstName", value);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.firstName}
                        touched={validation.touched.firstName}
                        error={validation.errors.firstName}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Last Name"
                        name="lastName"
                        type="text"
                        placeholder={InputPlaceHolder("Last Name")}
                        handleChange={(e) => {
                          const value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          validation.setFieldValue("lastName", value);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.lastName}
                        touched={validation.touched.lastName}
                        error={validation.errors.lastName}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Email"
                        name="email"
                        type="text"
                        className="select-border"
                        placeholder={InputPlaceHolder("Email")}
                        handleChange={async (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const emailValue = e.target.value;
                          validation.setFieldValue("email", emailValue);

                          setEmailError("");
                          const emailError = await checkExistingField(
                            "email",
                            emailValue
                          );
                          validation.setFieldError("email", emailError);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.email}
                        touched={validation.touched.email}
                        error={validation.errors.email || emailError}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Phone Number"
                        name="phoneNumber"
                        type="text"
                        className="select-border"
                        placeholder={InputPlaceHolder("Phone Number")}
                        handleChange={async (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const sanitizedValue = rawValue.slice(0, 10);
                          validation.setFieldValue(
                            "phoneNumber",
                            sanitizedValue
                          );
                          const phoneError = await checkExistingField(
                            "phoneNumber",
                            sanitizedValue
                          );
                          validation.setFieldError("phoneNumber", phoneError);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.phoneNumber}
                        touched={validation.touched.phoneNumber}
                        error={
                          validation.errors.phoneNumber || phoneNumberError
                        }
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    {/* Job Details */}

                    <Col xs={12} sm={6} md={6} lg={3}>
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Other Skills (Optional)"
                        name="otherSkills"
                        type="text"
                        placeholder={InputPlaceHolder(
                          "Other Skills (Optional)"
                        )}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.otherSkills}
                        touched={validation.touched.otherSkills}
                        error={validation.errors.otherSkills}
                        passwordToggle={false}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseSelect
                        label="Applied Role"
                        name="appliedRole"
                        className="select-border"
                        options={roleOptions}
                        placeholder={InputPlaceHolder("Applied Role")}
                        handleChange={handleRoleChange}
                        handleBlur={validation.appliedRole}
                        value={
                          dynamicFind(
                            roleOptions,
                            validation.values.appliedRole
                          ) || ""
                        }
                        touched={validation.touched.appliedRole}
                        error={validation.errors.appliedRole}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseSelect
                        label="Current Company Designation"
                        name="currentCompanyDesignation"
                        className="select-border"
                        options={designationOptions}
                        placeholder={InputPlaceHolder("Degination")}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "currentCompanyDesignation",
                            selectedOption?.label || ""
                          );
                        }}
                        handleBlur={validation.currentCompanyDesignation}
                        value={
                          dynamicFind(
                            designationOptions,
                            validation.values.currentCompanyDesignation
                          ) || ""
                        }
                        touched={validation.touched.currentCompanyDesignation}
                        error={validation.errors.currentCompanyDesignation}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
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

                          if (
                            !isNaN(numValue) &&
                            numValue >= 0 &&
                            numValue <= 30
                          ) {
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Relevant Experience(Year)"
                        name="relevantSkillExperience"
                        type="text"
                        placeholder={InputPlaceHolder(
                          "Relevant skill experience"
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

                          if (
                            !isNaN(numValue) &&
                            numValue >= 0 &&
                            numValue <= 30
                          ) {
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
                            validation.setFieldValue(
                              "relevantSkillExperience",
                              ""
                            );
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
                            validation.setFieldValue(
                              "relevantSkillExperience",
                              ""
                            );
                          }
                          validation.handleBlur(e);
                        }}
                        value={validation.values.relevantSkillExperience}
                        touched={validation.touched.relevantSkillExperience}
                        error={validation.errors.relevantSkillExperience}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3}>
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

                    <Col xs={12} sm={6} md={6} lg={3} className="mb-2 mb-sm-0">
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
                    <Col xs={12} sm={6} md={6} lg={3}>
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
                    <Col xs={12} sm={6} md={6} lg={3}>
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
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Linkedin URL (Optional)"
                        name="linkedinUrl"
                        type="url"
                        placeholder={InputPlaceHolder(
                          "Linkedin URL (Optional)"
                        )}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.linkedinUrl}
                        touched={validation.touched.linkedinUrl}
                        error={validation.errors.linkedinUrl}
                        passwordToggle={false}
                      />
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <BaseSelect
                        label="State"
                        name="state"
                        className="select-border"
                        options={states}
                        placeholder={InputPlaceHolder("State")}
                        handleChange={handleStateChange}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            states,
                            validation.values.state,
                            "location"
                          ) || ""
                        }
                        touched={validation.touched.state}
                        error={validation.errors.state}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                      <BaseSelect
                        label="City"
                        name="currentCity"
                        className="select-border"
                        options={cities}
                        placeholder={InputPlaceHolder("City")}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "currentCity",
                            selectedOption?.label || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            cities,
                            validation.values.currentCity,
                            "location"
                          ) || ""
                        }
                        touched={validation.touched.currentCity}
                        error={validation.errors.currentCity}
                        isRequired={false}
                      />
                    </Col>
                    <Col
                      xs={12}
                      sm={8}
                      md={8}
                      lg={8}
                      className="mb-2 d-flex align-items-end"
                    >
                      <div className="w-100">
                        <label
                          className="font-semibold text-gray-700 form-label"
                          htmlFor="resume-upload"
                        >
                          Resume Upload
                        </label>
                        <div className="d-flex align-items-center position-relative">
                          <input
                            id="resume-upload"
                            type="file"
                            accept="application/pdf,.doc,.docx"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setResumeFile(e.target.files[0]);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={() =>
                              document.getElementById("resume-upload")?.click()
                            }
                          >
                            <img
                              src={uploadCloud}
                              alt="Upload"
                              style={{ width: 22, height: 22, marginRight: 8 }}
                            />
                            {resumeFile ? "Change File" : "Upload Resume"}
                          </button>
                          {resumeFile && (
                            <>
                              <span
                                className="ms-2 text-truncate"
                                style={{ maxWidth: 120 }}
                              >
                                {resumeFile.name}
                              </span>
                              <button
                                type="button"
                                className="p-0 btn btn-link text-danger ms-2"
                                style={{ fontSize: 18 }}
                                onClick={() => {
                                  setResumeFile(null);
                                  // Also clear the file input value
                                  const input = document.getElementById(
                                    "resume-upload"
                                  ) as HTMLInputElement;
                                  if (input) input.value = "";
                                }}
                                title="Remove file"
                              >
                                &times;
                              </button>
                            </>
                          )}
                        </div>
                        <small className="text-muted">
                          PDF, DOC, DOCX only. Max 5MB.
                        </small>
                      </div>
                    </Col>
                    <Col xs={12} sm={4} md={4} lg={4}>
                      <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-end align-items-center">
                        <BaseButton
                          color="primary"
                          type="submit"
                          className="max-w-full mt-5 d-flex align-items-center justify-content-center"
                        >
                          {buttonloading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              {!id ? "Submitng..." : "Updating..."}
                            </>
                          ) : (
                            <>{!id ? "Submit" : "Update"}</>
                          )}
                        </BaseButton>
                      </div>
                    </Col>
                  </Row>
                )}
              </Form>
            </div>
          </Row>
        </Card>
      </Container>
    </Fragment>
  );
};

export default QrFrom;
