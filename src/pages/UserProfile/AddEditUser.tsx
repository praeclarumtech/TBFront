/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Card } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import appConstants from "constants/constant";
import { userAdd, updateProfile, viewProfile } from "../../api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  capitalizeWords,
  dynamicFind,
  InputPlaceHolder,
  RequiredField,
} from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  SelectedOption,
  SelectedOptionRole1,
} from "interfaces/applicant.interface";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Skeleton } from "antd";
import { getRole } from "api/roleApi";

const {
  projectTitle,
  CREATED,
  SUCCESS,
  emailRegex,
  passwordRegex,
  validationMessages,
  companyType,
  hireResourceOptions,
  activeStatusOptions,
} = appConstants;

const AddEditUser = () => {
  const { _id } = useParams();
  const isEditMode = Boolean(_id);
  const location = useLocation();
  const navigate = useNavigate();

  document.title =
    (isEditMode ? "Edit User" : "Add User") + " | " + projectTitle;

  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [rolesOptions, setrolesOptions] = useState<SelectedOptionRole1[]>([]);

  const fetchRoles = async () => {
    try {
      const res = await getRole();
      const options = res?.data.map((item: any) => ({
        label: capitalizeWords(item.name),
        value: item.name,
        id: item._id,
      }));
      setrolesOptions(options);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Create validation schema based on edit mode
  const getValidationSchema = () => {
    const baseSchema = {
      userName: Yup.string().required(RequiredField("Username")),
      email: Yup.string()
        .required(validationMessages.required("Email"))
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email")),
      firstName: Yup.string().required(
        validationMessages.required("First-name")
      ),
      lastName: Yup.string().required(validationMessages.required("Last-name")),
      role: Yup.string().required(RequiredField("Role")),
      company_name: Yup.string(),
      company_email: Yup.string().email(
        validationMessages.format("Company Email")
      ),
      company_phone_number: Yup.string().matches(
        /^[1-9][0-9]{9}$/,
        "Please enter a valid 10-digit phone number (should not start with 0)."
      ),
      company_location: Yup.string(),
      company_strength: Yup.string(),
      company_linkedin_profile: Yup.string().url("Please enter a valid URL"),
      company_website: Yup.string().url("Please enter a valid URL"),
      vendor_linkedin_profile: Yup.string().url("Please enter a valid URL"),
    };

    if (isEditMode) {
      // For edit mode, password is optional
      return Yup.object({
        ...baseSchema,
        password: Yup.string()
          .min(8, validationMessages.passwordLength("Password", 8))
          .matches(
            passwordRegex,
            validationMessages.passwordComplexity("Password")
          ),
        confirmPassword: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and confirm password should be same."
        ),
        whatsapp_number: Yup.string().matches(
          /^[1-9][0-9]{9}$/,
          "Please enter a valid 10-digit phone number (should not start with 0)."
        ),
      });
    } else {
      // For add mode, password is required
      return Yup.object({
        ...baseSchema,
        password: Yup.string()
          .required(validationMessages.required("Password"))
          .min(8, validationMessages.passwordLength("Password", 8))
          .matches(
            passwordRegex,
            validationMessages.passwordComplexity("Password")
          ),
        confirmPassword: Yup.string()
          .required(validationMessages.required("Confirm Password"))
          .oneOf(
            [Yup.ref("password")],
            "Password and confirm password should be same."
          ),
        whatsapp_number: Yup.string()
          .matches(
            /^[1-9][0-9]{9}$/,
            "Please enter a valid 10-digit phone number (should not start with 0)."
          )
          .required("Whatsapp number is required"),
      });
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
      password: isEditMode ? "" : "Admin@123",
      confirmPassword: isEditMode ? "" : "Admin@123",
      role: "",
      isActive: "true",
      company_name: "",
      company_email: "",
      company_phone_number: "",
      company_location: "",
      hire_resources: "",
      company_type: "",
      company_strength: "",
      company_linkedin_profile: "",
      company_website: "",
      whatsapp_number: "",
      vendor_linkedin_profile: "",
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const basePayload = {
        userName: values.userName,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        isActive: values.isActive === "true",
        ...((values.role === "vendor" || values.role === "client") && {
          company_name: values.company_name,
          company_email: values.company_email,
          company_phone_number: values.company_phone_number,
          company_location: values.company_location,
          hire_resources: values.hire_resources,
          company_type: values.company_type,
          company_strength: values.company_strength,
          company_linkedin_profile: values.company_linkedin_profile,
          company_website: values.company_website,
          whatsapp_number: values.whatsapp_number,
          vendor_linkedin_profile: values.vendor_linkedin_profile,
        }),
      };

      try {
        if (isEditMode) {
          // Edit mode - update user
          const payload: any = { ...basePayload };
          // Only include password if it's provided
          if (values.password) {
            payload.password = values.password;
            payload.confirmPassword = values.confirmPassword;
          }

          const formDataToSend = new FormData();
          for (const key in payload) {
            formDataToSend.append(key, String(payload[key]));
          }

          const response = await updateProfile(_id, formDataToSend);
          if (response) {
            toast.success(response?.message || "User updated successfully!");
            navigateBack();
          }
        } else {
          // Add mode - create new user
          const payload = {
            ...basePayload,
            password: values.password,
            confirmPassword: values.confirmPassword,
          };

          const res = await userAdd(payload);
          if (res?.statusCode === CREATED && res?.success === SUCCESS) {
            toast.success(res?.message);
            resetForm();
            navigateBack();
          } else {
            const msg = Array.isArray(res.message)
              ? res.message.join(", \n")
              : res.message;
            toast.error(msg);
          }
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error?.message || "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch user data for edit mode
  useEffect(() => {
    if (isEditMode && _id) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await viewProfile(_id);
          const userData = response?.data;

          if (userData) {
            // Extract role from roleId object or direct role field
            const userRole =
              typeof userData.roleId === "object"
                ? userData.roleId?.name
                : userData.role || "";

            validation.setValues({
              userName: userData.userName || "",
              email: userData.email || "",
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              password: "",
              confirmPassword: "",
              role: userRole,
              isActive:
                typeof userData.isActive === "boolean"
                  ? String(userData.isActive)
                  : "true",
              company_name: userData.vendorProfileId?.company_name || "",
              company_email: userData.vendorProfileId?.company_email || "",
              company_phone_number:
                userData.vendorProfileId?.company_phone_number || "",
              company_location:
                userData.vendorProfileId?.company_location || "",
              hire_resources: userData.vendorProfileId?.hire_resources || "",
              company_type: userData.vendorProfileId?.company_type || "",
              company_strength:
                userData.vendorProfileId?.company_strength || "",
              company_linkedin_profile:
                userData.vendorProfileId?.company_linkedin_profile || "",
              company_website: userData.vendorProfileId?.company_website || "",
              whatsapp_number:
                userData.vendorProfileId?.whatsapp_number || "",
              vendor_linkedin_profile:
                userData.vendorProfileId?.vendor_linkedin_profile || "",
            });
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load user data"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [_id, isEditMode]);

  // Set role from navigation state (for Vendor/Client pages)
  useEffect(() => {
    if (!isEditMode && location.state?.from) {
      if (location.state.from === "Vendor") {
        validation.setFieldValue("role", "vendor");
      } else if (location.state.from === "Client") {
        validation.setFieldValue("role", "client");
      }
    }
  }, [location.state, isEditMode]);

  const navigateBack = () => {
    if (location.state?.from === "Vendor" || location.state?.from === "VendorList") {
      navigate("/vendorList");
    } else if (location.state?.from === "Client") {
      navigate("/client");
    } else {
      navigate("/userManagement");
    }
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <Fragment>
      <div className="pt-1 page-content"></div>
      <Container fluid className="p-6 overflow-visible">
        <Row className="my-1">
          <Col xl={12} lg={12} md={12} xs={12}>
            <Card className="overflow-visible">
              {loading && isEditMode ? (
                <div className="m-10 my-5 d-flex justify-content-center">
                  <Skeleton active />
                </div>
              ) : (
                <Card.Body>
                  <div className="w-full max-w-4xl px-4 py-4 mx-auto">
                    <h5 className="justify-start mb-4 text-2xl font-semibold text-start">
                      {isEditMode ? "Edit User" : "Add User"}
                    </h5>

                    <form onSubmit={validation.handleSubmit} className="h-full">
                      <Row>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                        >
                          <BaseInput
                            label="Username"
                            name="userName"
                            type="text"
                            placeholder={InputPlaceHolder("Username")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.userName}
                            touched={validation.touched.userName}
                            error={validation.errors.userName}
                            passwordToggle={false}
                            isRequired={true}
                          />
                        </Col>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                        >
                          <BaseInput
                            label="Email"
                            name="email"
                            type="text"
                            placeholder={InputPlaceHolder("Email")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.email}
                            touched={validation.touched.email}
                            error={validation.errors.email}
                            passwordToggle={false}
                            isRequired={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                        >
                          <BaseInput
                            label="First Name"
                            name="firstName"
                            className=""
                            type="text"
                            placeholder={InputPlaceHolder("First Name")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.firstName}
                            touched={validation.touched.firstName}
                            error={validation.errors.firstName}
                            passwordToggle={false}
                            isRequired={true}
                          />
                        </Col>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                        >
                          <BaseInput
                            label="Last Name"
                            className=""
                            name="lastName"
                            type="text"
                            placeholder={InputPlaceHolder("Last Name")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.lastName}
                            touched={validation.touched.lastName}
                            error={validation.errors.lastName}
                            passwordToggle={false}
                            isRequired={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                        >
                          <BaseSelect
                            label="Role"
                            name="role"
                            className="select-border"
                            options={rolesOptions}
                            placeholder={InputPlaceHolder("Role")}
                            handleChange={(
                              selectedOption: SelectedOptionRole1
                            ) => {
                              validation.setFieldValue(
                                "role",
                                selectedOption?.value || ""
                              );
                            }}
                            handleBlur={validation.handleBlur}
                            value={
                              dynamicFind(
                                rolesOptions,
                                validation.values.role
                              ) || ""
                            }
                            touched={validation.touched.role}
                            error={validation.errors.role}
                            isRequired={true}
                            menuPortalTarget={
                              typeof window !== "undefined"
                                ? document.body
                                : null
                            }
                            menuPosition="fixed"
                            styles={{
                              menuPortal: (base: any) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              menuList: (provided: any) => ({
                                ...provided,
                                maxHeight: 200,
                                overflowY: "auto",
                              }),
                            }}
                          />
                        </Col>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                        >
                          <BaseSelect
                            label="Status"
                            name="isActive"
                            className="select-border"
                            options={activeStatusOptions}
                            placeholder={InputPlaceHolder("Status")}
                            handleChange={(selectedOption: SelectedOption) => {
                              validation.setFieldValue(
                                "isActive",
                                selectedOption?.value || ""
                              );
                            }}
                            handleBlur={validation.handleBlur}
                            value={
                              dynamicFind(
                                activeStatusOptions,
                                validation.values.isActive
                              ) || ""
                            }
                            touched={validation.touched.isActive}
                            error={validation.errors.isActive}
                            isRequired={true}
                            menuPortalTarget={
                              typeof window !== "undefined"
                                ? document.body
                                : null
                            }
                            menuPosition="fixed"
                            styles={{
                              menuPortal: (base: any) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              menuList: (provided: any) => ({
                                ...provided,
                                maxHeight: 200,
                                overflowY: "auto",
                              }),
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                        >
                          <BaseInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder={InputPlaceHolder("Password")}
                            handleChange={(e) => {
                              const newPassword = e.target.value;
                              validation.setFieldValue("password", newPassword);
                            }}
                            handleBlur={validation.handleBlur}
                            value={validation.values.password}
                            touched={validation.touched.password}
                            error={validation.errors.password}
                            passwordToggle={true}
                            isRequired={!isEditMode}
                          />
                        </Col>
                        <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                        >
                          <BaseInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={InputPlaceHolder("Confirm Password")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.confirmPassword}
                            touched={validation.touched.confirmPassword}
                            error={validation.errors.confirmPassword}
                            passwordToggle={true}
                            onclick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            isRequired={!isEditMode}
                          />
                        </Col>
                      </Row>

                      {/* Vendor/Client specific fields */}
                      {(validation.values.role === "vendor" ||
                        validation.values.role === "client") && (
                        <div>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company Name"
                                name="company_name"
                                type="text"
                                placeholder={InputPlaceHolder("Company Name")}
                                handleChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z0-9\s]/g,
                                    ""
                                  );
                                  validation.setFieldValue(
                                    "company_name",
                                    value
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_name}
                                touched={validation.touched.company_name}
                                error={validation.errors.company_name}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                            >
                              <BaseInput
                                className=""
                                label="Company Email"
                                name="company_email"
                                type="email"
                                placeholder={InputPlaceHolder("Company Email")}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_email}
                                touched={validation.touched.company_email}
                                error={validation.errors.company_email}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company Phone Number"
                                name="company_phone_number"
                                type="text"
                                placeholder={InputPlaceHolder("Phone Number")}
                                handleChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  const sanitizedValue = rawValue.slice(0, 10);
                                  validation.setFieldValue(
                                    "company_phone_number",
                                    sanitizedValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_phone_number}
                                touched={
                                  validation.touched.company_phone_number
                                }
                                error={validation.errors.company_phone_number}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company Location"
                                name="company_location"
                                type="text"
                                placeholder={InputPlaceHolder(
                                  "Company Location"
                                )}
                                handleChange={(e) => {
                                  const rawValue = e.target.value;
                                  validation.setFieldValue(
                                    "company_location",
                                    rawValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_location}
                                touched={validation.touched.company_location}
                                error={validation.errors.company_location}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                            >
                              <BaseSelect
                                label="Hire Resources"
                                name="hire_resources"
                                className="select-border"
                                options={hireResourceOptions}
                                placeholder={InputPlaceHolder("Type")}
                                handleChange={(
                                  selectedOption: SelectedOption
                                ) => {
                                  validation.setFieldValue(
                                    "hire_resources",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  dynamicFind(
                                    hireResourceOptions,
                                    validation.values.hire_resources
                                  ) || ""
                                }
                                isRequired={true}
                                menuPortalTarget={
                                  typeof window !== "undefined"
                                    ? document.body
                                    : null
                                }
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: (base: any) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menuList: (provided: any) => ({
                                    ...provided,
                                    maxHeight: 200,
                                    overflowY: "auto",
                                  }),
                                }}
                              />
                            </Col>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                            >
                              <BaseSelect
                                label="Company Type"
                                name="company_type"
                                className="select-border"
                                options={companyType}
                                placeholder={InputPlaceHolder("Type")}
                                handleChange={(
                                  selectedOption: SelectedOption
                                ) => {
                                  validation.setFieldValue(
                                    "company_type",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  dynamicFind(
                                    companyType,
                                    validation.values.company_type
                                  ) || ""
                                }
                                isRequired={true}
                                menuPortalTarget={
                                  typeof window !== "undefined"
                                    ? document.body
                                    : null
                                }
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: (base: any) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menuList: (provided: any) => ({
                                    ...provided,
                                    maxHeight: 200,
                                    overflowY: "auto",
                                  }),
                                }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company Strength"
                                name="company_strength"
                                type="text"
                                placeholder={InputPlaceHolder(
                                  "Company Strength"
                                )}
                                handleChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  const sanitizedValue = rawValue.slice(0, 10);
                                  validation.setFieldValue(
                                    "company_strength",
                                    sanitizedValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_strength}
                                touched={validation.touched.company_strength}
                                error={validation.errors.company_strength}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Whatsapp Number"
                                name="whatsapp_number"
                                type="text"
                                placeholder={InputPlaceHolder(
                                  "Whatsapp Number"
                                )}
                                handleChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  const sanitizedValue = rawValue.slice(0, 10);
                                  validation.setFieldValue(
                                    "whatsapp_number",
                                    sanitizedValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.whatsapp_number}
                                touched={validation.touched.whatsapp_number}
                                error={validation.errors.whatsapp_number}
                                passwordToggle={false}
                                isRequired={!isEditMode}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company LinkedIn URL"
                                name="company_linkedin_profile"
                                type="url"
                                placeholder={InputPlaceHolder(
                                  "Company LinkedIn URL"
                                )}
                                handleChange={(e) => {
                                  const rawValue = e.target.value;
                                  validation.setFieldValue(
                                    "company_linkedin_profile",
                                    rawValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  validation.values.company_linkedin_profile
                                }
                                touched={
                                  validation.touched.company_linkedin_profile
                                }
                                error={
                                  validation.errors.company_linkedin_profile
                                }
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="Company Website"
                                name="company_website"
                                type="url"
                                placeholder={InputPlaceHolder(
                                  "Company Website"
                                )}
                                handleChange={(e) => {
                                  const rawValue = e.target.value;
                                  validation.setFieldValue(
                                    "company_website",
                                    rawValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={validation.values.company_website}
                                touched={validation.touched.company_website}
                                error={validation.errors.company_website}
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={6}
                              sm={12}
                              xl={6}
                              lg={6}
                              className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                            >
                              <BaseInput
                                label="LinkedIn URL"
                                name="vendor_linkedin_profile"
                                type="url"
                                placeholder={InputPlaceHolder("LinkedIn URL")}
                                handleChange={(e) => {
                                  const rawValue = e.target.value;
                                  validation.setFieldValue(
                                    "vendor_linkedin_profile",
                                    rawValue
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  validation.values.vendor_linkedin_profile
                                }
                                touched={
                                  validation.touched.vendor_linkedin_profile
                                }
                                error={
                                  validation.errors.vendor_linkedin_profile
                                }
                                passwordToggle={false}
                                isRequired={false}
                              />
                            </Col>
                          </Row>
                        </div>
                      )}

                      <div className="flex justify-end gap-4">
                        <BaseButton color="secondary" onClick={handleNavigate}>
                          Back
                        </BaseButton>
                        <BaseButton
                          type="submit"
                          loader={loading}
                          color="primary"
                        >
                          {isEditMode ? "Update" : "Add"}
                        </BaseButton>
                      </div>
                    </form>
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddEditUser;

