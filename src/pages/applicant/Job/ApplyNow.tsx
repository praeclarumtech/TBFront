/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Fragment } from "react";
import {
  BaseSelect,
  PaginateSelect,
  PaginateMultiSelect,
} from "components/BaseComponents/BaseSelect";
import { useParams, useNavigate } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import {
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
import { Card, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { viewRoleSkill } from "api/roleApi";
import uploadCloud from "assets/fonts/feather-icons/icons/upload-cloud.svg";
import { useLocation } from "react-router-dom";
import { viewAllCity } from "api/cityApis";
import { viewAllState } from "api/stateApi";
import toastify from "utils/toastify";
import appEnv from "config/appEnv";

const { projectTitle, Modules, communicationOptions } = appConstants;

const ApplyNow = () => {
  const location = useLocation();
  const jobId = location.state?.jobId;
  document.title = Modules.Jobs + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonloading, setButtonLoading] = useState<boolean>(false);
  const [selectedMulti, setSelectedMulti] = useState<any>([]);
  const PAGE_SIZE = 20;
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [skillPage, setSkillPage] = useState(1);
  const [hasMoreSkills, setHasMoreSkills] = useState(true);
  const [loadingMoreSkills, setLoadingMoreSkills] = useState(false);
  const [designationOptions, setDesignationOptions] = useState<any[]>([]);
  const [designationPage, setDesignationPage] = useState(1);
  const [hasMoreDesignations, setHasMoreDesignations] = useState(true);
  const [loadingMoreDesignations, setLoadingMoreDesignations] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [rolePage, setRolePage] = useState(1);
  const [hasMoreRoles, setHasMoreRoles] = useState(true);
  const [loadingMoreRoles, setLoadingMoreRoles] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>("");
  const [jobID, setJobID] = useState<any>();
  const [addedBy, setAddedBy] = useState<any>();
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<City[]>([]);
  const [statePage, setStatePage] = useState(1);
  const [hasMoreStates, setHasMoreStates] = useState(true);
  const [loadingMoreStates, setLoadingMoreStates] = useState(false);
  const [cityPage, setCityPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMoreCities, setLoadingMoreCities] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<string | undefined>();
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchSkills = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) setLoadingMoreSkills(true);
      const response = await ViewAppliedSkills({
        page,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const data = response?.data?.data || [];
      const options = data.map((item: any) => ({
        label: item.skills,
        value: item.skills,
      }));
      if (append) {
        setSkillOptions((prev) => {
          const existingLabels = new Set(prev.map((o: any) => o.value));
          const newOptions = options.filter(
            (o: any) => !existingLabels.has(o.value),
          );
          return [...prev, ...newOptions];
        });
        setHasMoreSkills(options.length >= PAGE_SIZE);
        setSkillPage((p) => p + 1);
      } else {
        setSkillOptions(options);
        setHasMoreSkills(options.length >= PAGE_SIZE);
        setSkillPage(2);
      }
      if (!append && initialValues?.appliedSkills?.length) {
        const selectedSkills = options.filter((opt: any) =>
          initialValues.appliedSkills.includes(opt.value),
        );
        setSelectedMulti(selectedSkills);
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      if (append) setLoadingMoreSkills(false);
    }
  };

  const loadMoreSkills = () => {
    if (!loadingMoreSkills && hasMoreSkills) {
      fetchSkills(skillPage, true);
    }
  };

  const fetchDesignations = async (
    page: number = 1,
    append: boolean = false,
  ) => {
    try {
      if (append) setLoadingMoreDesignations(true);
      const response = await viewAllDesignation({
        page,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const designationData = response?.data?.data || [];
      const options = designationData.map((item: any) => ({
        label: item.designation,
        value: item.designation,
      }));
      if (append) {
        setDesignationOptions((prev) => {
          const existingLabels = new Set(prev.map((o: any) => o.value));
          const newOptions = options.filter(
            (o: any) => !existingLabels.has(o.value),
          );
          return [...prev, ...newOptions];
        });
        setHasMoreDesignations(options.length >= PAGE_SIZE);
        setDesignationPage((p) => p + 1);
      } else {
        setDesignationOptions(options);
        setHasMoreDesignations(options.length >= PAGE_SIZE);
        setDesignationPage(2);
      }
      if (
        !append &&
        initialValues?.currentCompanyDesignation &&
        validation?.setFieldValue
      ) {
        const selectedDesignation = options.find(
          (opt: any) => opt.label === initialValues.currentCompanyDesignation,
        );
        if (selectedDesignation) {
          validation.setFieldValue(
            "currentCompanyDesignation",
            selectedDesignation.label,
          );
        }
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      if (append) setLoadingMoreDesignations(false);
    }
  };

  const loadMoreDesignations = () => {
    if (!loadingMoreDesignations && hasMoreDesignations) {
      fetchDesignations(designationPage, true);
    }
  };

  const fetchRoles = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) setLoadingMoreRoles(true);
      const response = await viewRoleSkill({
        page,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const roleData = response?.data?.data || [];
      const options = roleData.map((item: any) => ({
        label: item.appliedRole,
        value: item.appliedRole,
      }));
      if (append) {
        setRoleOptions((prev) => {
          const existingLabels = new Set(prev.map((o: any) => o.value));
          const newOptions = options.filter(
            (o: any) => !existingLabels.has(o.value),
          );
          return [...prev, ...newOptions];
        });
        setHasMoreRoles(options.length >= PAGE_SIZE);
        setRolePage((p) => p + 1);
      } else {
        setRoleOptions(options);
        setHasMoreRoles(options.length >= PAGE_SIZE);
        setRolePage(2);
      }
      if (
        !append &&
        initialValues?.appliedRole &&
        validation?.setFieldValue &&
        options.length
      ) {
        const selectedRole = options.find(
          (opt: any) => opt.label === initialValues.appliedRole,
        );
        if (selectedRole) {
          validation.setFieldValue("appliedRole", selectedRole.value);
          handleRoleChange(selectedRole);
        }
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      if (append) setLoadingMoreRoles(false);
    }
  };

  const loadMoreRoles = () => {
    if (!loadingMoreRoles && hasMoreRoles) {
      fetchRoles(rolePage, true);
    }
  };

  const fetchStates = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) setLoadingMoreStates(true);
      const stateData = await viewAllState({
        page,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const stateItems = stateData?.data?.item ?? stateData?.item ?? [];
      const options = stateItems.map(
        (state: { state_name: string; _id: string; country_id: string }) => ({
          label: state.state_name,
          value: state._id,
          country_id: state.country_id,
        }),
      );
      if (append) {
        setStates((prev) => {
          const existingIds = new Set(prev.map((o: any) => o.value));
          const newOptions = options.filter(
            (o: any) => !existingIds.has(o.value),
          );
          return [...prev, ...newOptions];
        });
        setHasMoreStates(options.length >= PAGE_SIZE);
        setStatePage((p) => p + 1);
      } else {
        setStates(options);
        setHasMoreStates(options.length >= PAGE_SIZE);
        setStatePage(2);
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      if (append) setLoadingMoreStates(false);
    }
  };

  const loadMoreStates = () => {
    if (!loadingMoreStates && hasMoreStates) {
      fetchStates(statePage, true);
    }
  };

  const fetchCities = async (
    page: number = 1,
    append: boolean = false,
    stateId?: string,
  ) => {
    try {
      if (append) setLoadingMoreCities(true);
      const params: any = {
        page,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
      };
      if (stateId) params.state_id = stateId;
      const cityData = await viewAllCity(params);
      const cityItems = cityData?.data?.item ?? cityData?.item ?? [];
      const options = cityItems.map(
        (city: { city_name: string; _id: string; state_id: string }) => ({
          label: city.city_name,
          value: city._id,
          state_id: city.state_id,
        }),
      );
      if (append) {
        setCities((prev) => {
          const existingIds = new Set(prev.map((o: any) => o.value));
          const newOptions = options.filter(
            (o: any) => !existingIds.has(o.value),
          );
          return [...prev, ...newOptions];
        });
        setHasMoreCities(options.length >= PAGE_SIZE);
        setCityPage((p) => p + 1);
      } else {
        setCities(options);
        setHasMoreCities(options.length >= PAGE_SIZE);
        setCityPage(2);
      }
    } catch (error) {
      errorHandle(error);
    } finally {
      if (append) setLoadingMoreCities(false);
    }
  };

  const loadMoreCities = () => {
    if (!loadingMoreCities && hasMoreCities && selectedStateId) {
      fetchCities(cityPage, true, selectedStateId);
    }
  };

  const getApplicant = (applicantId: string | undefined | null) => {
    if (applicantId !== undefined && applicantId != null) {
      getApplicantDetails(applicantId)
        .then((res: any) => {
          if (res.success) {
            setFormData(res.data);
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Defer dropdown data fetches until after first paint so the form appears immediately (fixes slow "load form" on production).
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      fetchStates(1, false);
    });
    return () => cancelAnimationFrame(t);
  }, []);

  // When formData has initial state and states are loaded, fetch cities for that state
  useEffect(() => {
    const initialState = formData?.state;
    if (initialState && states.length > 0) {
      const stateOpt = states.find((s: any) => s.label === initialState);
      if (stateOpt && !selectedStateId) {
        setSelectedStateId(stateOpt.value);
        fetchCities(1, false, stateOpt.value);
      }
    }
  }, [formData?.state, states]);

  useEffect(() => {
    setJobID(jobId);
    setAddedBy("guest");
    if (id) {
      setLoading(true);
      getApplicant(id);
    }
  }, [id, jobId]);

  // Defer skills/designations/roles so form shell renders first, then options load (improves perceived load time).
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      fetchSkills();
      fetchDesignations();
      fetchRoles();
    });
    return () => cancelAnimationFrame(t);
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
      addedBy: addedBy || "",
      state: initialValues?.state || "",
      currentCity: initialValues?.currentCity || "",
    },
    validationSchema: QrApplicants,

    onSubmit: async (value: any) => {
      setResumeError("");
      // Resume is required for new applications (create flow)
      if (!id && !resumeFile) {
        setResumeError("Resume is required.");
        toastify("Please upload your resume to apply.", { type: "error" });
        return;
      }
      setButtonLoading(true);

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
          value.currentCompanyDesignation,
        );
        formData.append("linkedinUrl", value.linkedinUrl);
        formData.append("communicationSkill", value.communicationSkill);
        formData.append("totalExperience", value.totalExperience);
        formData.append(
          "relevantSkillExperience",
          value.relevantSkillExperience,
        );
        formData.append("state", value.state);
        formData.append("currentCity", value.currentCity);
        formData.append("appliedRole", value.appliedRole);
        formData.append("job_id", value.job_id);
        formData.append("addedBy", value.addedBy);

        // Resume file is sent as "attachments" to backend (applicants/applicant-add-qr-code or applicant-edit-qr-code); storage is on the server.
        if (resumeFile) {
          formData.append("attachments", resumeFile);
        }
        if (!id) {
          const createResponse = await createApplicantQR(formData, true);
          if (createResponse?.success || createResponse?.statusCode === 201) {
            toastify("Applicant created successfully", { type: "success" });
            navigate("/applicants/qr-code-success");
          } else {
            // Handle API error response (e.g., 409 conflict)
            const errorMsg =
              createResponse?.message || "Failed to create applicant";
            toastify(errorMsg, { type: "error" });
            setButtonLoading(false);
            return;
          }
        } else {
          const updateResponse = await updateApplicantQR(formData, id, true);
          if (
            updateResponse?.success ||
            updateResponse?.statusCode === 200 ||
            updateResponse?.statusCode === 201
          ) {
            toastify("Applicant updated successfully", { type: "success" });
            navigate("/applicants/qr-code-success");
          } else {
            // Handle API error response (e.g., 409 conflict)
            const errorMsg =
              updateResponse?.message || "Failed to update applicant";
            toastify(errorMsg, { type: "error" });
            setButtonLoading(false);
            return;
          }
        }
      } catch (error: any) {
        setButtonLoading(false);
        // Handle axios/network errors
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unexpected error.";
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage: string) => {
            toastify(errorMessage, { type: "error" });
          });
        } else {
          toastify(message, { type: "error" });
        }
      } finally {
        setButtonLoading(false);
      }
    },
  });

  //   const checkExistingField = async (field: string, value: string) => {
  //     // if (field === "email") {
  //     //   setEmailError("");
  //     // }
  //     // if (field === "phoneNumber") {
  //     //   setPhoneNumberError("");
  //     // }

  //     try {
  //       const params: {
  //         email?: string;
  //         phoneNumber?: number;
  //         whatsappNumber?: number;
  //       } = {};

  //       if (field === "email") {
  //         params.email = value;
  //       } else if (field === "phoneNumber") {
  //         params.phoneNumber = Number(value);
  //       } else if (field === "whatsappNumber") {
  //         params.whatsappNumber = Number(value);
  //       }

  //       const response = await CheckExistingApplicant(params);

  //       if (response?.data?.exists) {
  //     //     if (field === "email") {
  //     //       setEmailError(
  //     //         response?.message || "This email is already registered."
  //     //       );
  //     //     }
  //     //     if (field === "phoneNumber") {
  //     //       setPhoneNumberError("This phone number is already registered.");
  //     //     }
  //     //   } else {
  //     //     if (field === "email") {
  //     //       setEmailError("");
  //     //     }
  //     //     if (field === "phoneNumber") {
  //     //       setPhoneNumberError("");
  //     //     }
  //       }
  //     } catch (error) {
  //       errorHandle(error);

  //       return "Error while checking this field.";
  //     }
  //   };

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
    const stateId = selectedOption?.value;
    validation.setFieldValue("state", selectedValue);
    validation.setFieldValue("currentCity", "");
    setCities([]);
    setCityPage(1);
    setHasMoreCities(true);
    if (stateId) {
      setSelectedStateId(stateId);
      fetchCities(1, false, stateId);
    } else {
      setSelectedStateId(undefined);
    }
  };

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card title="Job Profile">
          <Row>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
                className="p-1"
              >
                {loading ? (
                  <div className="my-5 d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <Row className="mb-1 g-3">
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
                            "",
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
                            "",
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
                          e: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          const emailValue = e.target.value;
                          validation.setFieldValue("email", emailValue);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.email}
                        touched={validation.touched.email}
                        error={
                          validation.errors.email
                          // || emailError
                        }
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
                          e: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const sanitizedValue = rawValue.slice(0, 10);
                          validation.setFieldValue(
                            "phoneNumber",
                            sanitizedValue,
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.phoneNumber}
                        touched={validation.touched.phoneNumber}
                        error={validation.errors.phoneNumber}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    {/* Job Details */}

                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                      <PaginateMultiSelect
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
                        loadMore={loadMoreSkills}
                        hasMore={hasMoreSkills}
                        isLoadingMore={loadingMoreSkills}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                      <PaginateSelect
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
                            validation.values.appliedRole,
                          ) || ""
                        }
                        touched={validation.touched.appliedRole}
                        error={validation.errors.appliedRole}
                        isRequired={true}
                        loadMore={loadMoreRoles}
                        hasMore={hasMoreRoles}
                        isLoadingMore={loadingMoreRoles}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                      <PaginateSelect
                        label="Current Company Designation"
                        name="currentCompanyDesignation"
                        className="select-border"
                        options={designationOptions}
                        placeholder={InputPlaceHolder("Degination")}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "currentCompanyDesignation",
                            selectedOption?.label || "",
                          );
                        }}
                        handleBlur={validation.currentCompanyDesignation}
                        value={
                          dynamicFind(
                            designationOptions,
                            validation.values.currentCompanyDesignation,
                          ) || ""
                        }
                        touched={validation.touched.currentCompanyDesignation}
                        error={validation.errors.currentCompanyDesignation}
                        isRequired={true}
                        loadMore={loadMoreDesignations}
                        hasMore={hasMoreDesignations}
                        isLoadingMore={loadingMoreDesignations}
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
                                numValue.toFixed(1),
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
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                      <BaseInput
                        label="Relevant Experience(Year)"
                        name="relevantSkillExperience"
                        type="text"
                        placeholder={InputPlaceHolder(
                          "Relevant skill experience",
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
                              value,
                            );
                          } else if (value === "" || value === ".") {
                            validation.setFieldValue(
                              "relevantSkillExperience",
                              value,
                            );
                          } else if (!value) {
                            validation.setFieldValue(
                              "relevantSkillExperience",
                              "",
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
                                numValue.toFixed(1),
                              );
                            } else {
                              validation.setFieldValue(
                                "relevantSkillExperience",
                                "",
                              );
                            }
                          } else {
                            validation.setFieldValue(
                              "relevantSkillExperience",
                              "",
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
                            selectedOption?.value || "",
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            communicationOptions,
                            String(validation.values.communicationSkill),
                          ) || ""
                        }
                        touched={validation.touched.communicationSkill}
                        error={validation.errors.communicationSkill}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
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
                                numValue.toFixed(2),
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
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3 mb-sm-0">
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
                                numValue.toFixed(2),
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
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
                                numValue.toFixed(2),
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
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="mb-3">
                      <BaseInput
                        label="Linkedin URL (Optional)"
                        name="linkedinUrl"
                        type="url"
                        placeholder={InputPlaceHolder(
                          "Linkedin URL (Optional)",
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
                      <PaginateSelect
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
                            "location",
                          ) ||
                          (validation.values.state
                            ? {
                                label: validation.values.state,
                                value: validation.values.state,
                              }
                            : "")
                        }
                        touched={validation.touched.state}
                        error={validation.errors.state}
                        isRequired={true}
                        loadMore={loadMoreStates}
                        hasMore={hasMoreStates}
                        isLoadingMore={loadingMoreStates}
                      />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                      <PaginateSelect
                        label="City"
                        name="currentCity"
                        className="select-border"
                        options={cities}
                        placeholder={InputPlaceHolder("City")}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "currentCity",
                            selectedOption?.label || "",
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            cities,
                            validation.values.currentCity,
                            "location",
                          ) ||
                          (validation.values.currentCity
                            ? {
                                label: validation.values.currentCity,
                                value: validation.values.currentCity,
                              }
                            : "")
                        }
                        touched={validation.touched.currentCity}
                        error={validation.errors.currentCity}
                        isRequired={true}
                        loadMore={loadMoreCities}
                        hasMore={hasMoreCities}
                        isLoadingMore={loadingMoreCities}
                      />
                    </Col>
                    <Col
                      xs={12}
                      sm={8}
                      md={8}
                      lg={8}
                      className="d-flex align-items-end"
                    >
                      <div className="w-100">
                        <label
                          className="font-semibold text-gray-700 form-label"
                          htmlFor="resume-upload"
                        >
                          Resume Upload <span className="text-danger">*</span>
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
                                setResumeError("");
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
                                  setResumeError("");
                                  const input = document.getElementById(
                                    "resume-upload",
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
                        <small className="text-muted d-block">
                          PDF, DOC, DOCX only. Max 5MB.
                        </small>
                        {resumeError && (
                          <small className="text-danger">{resumeError}</small>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} sm={4} md={12} lg={12}>
                      <div className="gap-3 d-flex flex-column flex-md-row justify-content-end align-items-center">
                        <BaseButton
                          color="primary"
                          type="submit"
                          className="max-w-full d-flex align-items-center justify-content-center"
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
              </form>

              <div className="mt-2    pt-2">
                <Alert
                  message={
                    <span className="d-flex align-items-center gap-2">
                      <MailOutlined style={{ fontSize: "16px" }} />
                      <strong>Need Assistance?</strong>
                    </span>
                  }
                  description={
                    <p className="mb-0 mt-2">
                      Experiencing technical difficulties or unable to complete
                      the form? Please send your CV or describe your issue
                      directly to our careers team at{" "}
                      <a
                        href={`mailto:${appEnv.CAREER_EMAIL}`}
                        className="fw-semibold link-primary"
                      >
                        {appEnv.CAREER_EMAIL}
                      </a>
                      . We will respond at the earliest.
                    </p>
                  }
                  type="info"
                  showIcon={false}
                  className="border-0"
                  style={{
                    backgroundColor: "#f0f7ff",
                    borderLeft: "4px solid var(--bs-primary)",
                  }}
                />
              </div>
            </div>
          </Row>
        </Card>
      </Container>
    </Fragment>
  );
};

export default ApplyNow;
