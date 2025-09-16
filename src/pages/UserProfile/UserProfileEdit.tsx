/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useMounted } from "hooks/useMounted";
import appConstants from "constants/constant";
import { updateProfile, userAdd, viewProfile } from "../../api/usersApi";
import moment from "moment";
import { ProfileFormData } from "interfaces/user.interface";
import { toast } from "react-toastify";
import appEnv from "config/appEnv";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  capitalizeWords,
  dynamicFind,
  getCurrentUserRole,
  InputPlaceHolder,
  RequiredField,
} from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router";
// import { statusCode } from '../../interfaces/global.interface';
import * as Yup from "yup";

import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
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
  Modules,
  CREATED,
  SUCCESS,
  emailRegex,
  passwordRegex,
  validationMessages,
  companyType,
  hireResourceOptions,
  activeStatusOptions,
} = appConstants;
const UserProfileEdit = () => {
  document.title = Modules.Profile + " | " + projectTitle;
  const hasMounted = useMounted();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    profilePicture: "/images/avatar/avatar.png",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    designation: "",
    isActive: "",
    password: "",
    confirmPassword: "",
    role: "",
    company_name: "",
    company_email: "",
    company_phone_number: "",
    company_location: "",
    company_type: "",
    hire_resources: "",
    company_strength: "",
    company_linkedin_profile: "",
    company_website: "",
    whatsapp_number: "",
    vendor_linkedin_profile: "",
  });

  const [rolesOptions, setrolesOptions] = useState<SelectedOptionRole1[]>([]);
  const fetchRoles = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const { _id } = useParams();
  const isEditMode = Boolean(_id);

  const location = useLocation();
  const currentUserRole = getCurrentUserRole();

  const [imagePreview, setImagePreview] = useState<string>(
    "/images/avatar/avatar.png"
  );
  const navigate = useNavigate();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "Admin@123",
      confirmPassword: "Admin@123",
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
    validationSchema: Yup.object({
      userName: Yup.string().required(RequiredField("Username")),
      email: Yup.string()
        .required(validationMessages.required("Email"))
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email")),
      firstName: Yup.string().required(
        validationMessages.required("First-name")
      ),

      lastName: Yup.string().required(validationMessages.required("Last-name")),

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
      role: Yup.string().required(RequiredField("Role")),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log("insubmit");
      setLoading(true);
      const payload = {
        userName: values.userName,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
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

      userAdd(payload)
        .then((res) => {
          if (res?.statusCode === CREATED && res?.success === SUCCESS) {
            toast.success(res?.message);
            resetForm();
            // resetData();
            navigate("/userManagement");
          } else {
            const msg = Array.isArray(res.message)
              ? res.message.join(", \n")
              : res.message;
            toast.error(msg);
          }
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error?.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
  // console.log("validation", validation.isSubmitting, validation.errors);

  useEffect(() => {
    if (isEditMode) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await viewProfile(_id);
          setProfileData(response?.data);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "An error occurred"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [_id, isEditMode, location.pathname]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        profilePicture:
          profileData.profilePicture || "/images/avatar/avatar.png",
        userName: profileData.userName || "",
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        dateOfBirth: profileData.dateOfBirth || "",
        designation: profileData.designation || "",
        isActive:
          typeof profileData.isActive === "boolean"
            ? String(profileData.isActive)
            : "",

        // password: profileData.password || "",
        password: "",
        confirmPassword: "",
        role: profileData.role || "",
        company_name: profileData.vendorProfileId?.company_name || "",
        company_email: profileData.vendorProfileId?.company_email || "",
        company_phone_number:
          profileData.vendorProfileId?.company_phone_number || "",
        company_location: profileData.vendorProfileId?.company_location || "",
        company_type: profileData.vendorProfileId?.company_type || "",
        hire_resources: profileData.vendorProfileId?.hire_resources || "",
        company_strength: profileData.vendorProfileId?.company_strength || "",
        company_linkedin_profile:
          profileData.vendorProfileId?.company_linkedin_profile || "",
        company_website: profileData.vendorProfileId?.company_website || "",
      });

      setImagePreview(
        profileData.profilePicture
          ? `${appEnv.API_ENDPOINT}/uploads/profile/${profileData.profilePicture}`
          : "/images/avatar/avatar.png"
      );
    }
  }, [profileData]);

  //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { id, value } = e.target;
  //     setFormData((prevState) => ({ ...prevState, [id]: value }));
  //   };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      // toast.error("Passwords do not match");
      // return;
    }
    if (error) {
      toast.error(error);
      setError("");
      return;
    }

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "profilePicture") {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] === "") {
          formDataToSend.append(key, "null");
        }
      } else {
        formDataToSend.append(key, String(formData[key]));
      }
    }

    try {
      setLoading(true);

      if (!_id) {
        toast.error("User ID is missing or invalid.");
        return;
      }
      const response = await updateProfile(_id, formDataToSend);

      if (response) {
        toast.success(response?.message || "Profile updated successfully!");

        setLoading(false);

        setImagePreview(
          response?.data?.profilePicture
            ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
            : imagePreview
        );
        navigate("/userManagement");
      }
    } catch (error) {
      // if (error && statusCode === 400) {

      toast.error(error instanceof Error ? error.message : "An error occurred");
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];

    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profilePicture: file,
      }));
      setLoadingImage(true);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string);
        setLoadingImage(false);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;

    const year = date.split("-")[0];

    if (year.length === 4) {
      if (Number(year) < 1960 || Number(year) > 2009) {
        setError("Please enter a year between 1960 to 2009.");
        return;
      }

      const userAge = moment().diff(moment(date, "YYYY-MM-DD"), "years");
      if (userAge < 15) {
        setError("You must be at least 15 years old.");
        return;
      }

      setError("");

      setFormData({
        ...formData,
        dateOfBirth: date,
      });
    } else {
      setError("Year must be a 4-digit number.");
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (location.state?.from === "Vendor") {
      validation.setFieldValue("role", "vendor");
    } else {
      validation.setFieldValue("role", "client");
    }
  }, [location.state]);

  return (
    <Fragment>
      <div className="pt-1 page-content"></div>
      <Container fluid className="p-6 overflow-visible">
        <Row className="my-1">
          <Col xl={12} lg={12} md={12} xs={12}>
            <Card className="overflow-visible">
              {loading ? (
                <div className="m-10 my-5 d-flex justify-content-center">
                  <Skeleton active />
                </div>
              ) : (
                <Card.Body>
                  <div className="w-full max-w-4xl px-4 py-4 mx-auto">
                    <h5 className="justify-start mb-4 text-2xl font-semibold text-start ">
                      {isEditMode ? "Profile" : "Add User"}
                    </h5>

                    {hasMounted && isEditMode && (
                      <form onSubmit={handleSubmitEdit}>
                        <div className="flex flex-col items-center mb-4">
                          <div>
                            {loadingImage ? (
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading image...
                                </span>
                              </Spinner>
                            ) : (
                              <img
                                src={imagePreview}
                                crossOrigin="anonymous"
                                alt="Profile Preview"
                                className="object-cover mb-4 border-4 border-blue-500 rounded-full w-28 h-28"
                              />
                            )}
                          </div>

                          <div className="space-x-2">
                            <input
                              type="file"
                              // accept="image/*"
                              accept=".png, .jpg, .jpeg"
                              className="hidden"
                              id="profilePicInput"
                              onChange={handleProfilePicChange}
                            />

                            <button
                              type="button"
                              className="text-sm px-4 py-1.5 bg-gray-200 rounded-md"
                              onClick={() =>
                                document
                                  .getElementById("profilePicInput")
                                  ?.click()
                              }
                            >
                              Change
                            </button>
                            {/* <button
                            type="button"
                            className="text-sm px-4 py-1.5 bg-red-100 text-red-600 rounded-md  "
                            onClick={handleProfilePicRemove}
                          >
                            Remove
                          </button>  */}
                          </div>
                        </div>
                        {/* Username */}{" "}
                        <Row>
                          <Col
                            md={6}
                            sm={12}
                            xl={3}
                            lg={3}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Username"
                              name="userName"
                              type="text"
                              placeholder={InputPlaceHolder("Username")}
                              handleChange={(e) => {
                                const value = e.target.value.trim();
                                setFormData({
                                  ...formData,
                                  userName: value,
                                });
                              }}
                              value={formData.userName}
                              touched={touched}
                              error={error}
                              passwordToggle={false}
                            />
                          </Col>
                          <Col
                            md={6}
                            sm={12}
                            xl={3}
                            lg={3}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Role"
                              name="role"
                              type="text"
                              className="cursor-not-allowed"
                              placeholder={InputPlaceHolder("Role")}
                              handleChange={(e) => {
                                setFormData({
                                  ...formData,
                                  role: e.target.value,
                                });
                              }}
                              value={formData.role}
                              disabled={currentUserRole !== "admin"}
                              passwordToggle={false}
                            />
                          </Col>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4 "
                          >
                            <BaseInput
                              className=""
                              label="Email"
                              name="email"
                              type="email"
                              placeholder={InputPlaceHolder("Email")}
                              handleChange={(e) => {
                                setFormData({
                                  ...formData,
                                  email: e.target.value, // Don't sanitize emails - let backend validation handle it
                                });
                              }}
                              touched={touched}
                              error={error}
                              value={formData?.email}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="First Name"
                              name="firstName"
                              className=""
                              type="text"
                              placeholder={InputPlaceHolder("First Name")}
                              handleChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^A-Za-z\s]/g,
                                  ""
                                );
                                setFormData({
                                  ...formData,
                                  firstName: value,
                                });
                              }}
                              value={formData.firstName}
                              passwordToggle={false}
                            />
                          </Col>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Last Name"
                              className=""
                              name="lastName"
                              type="text"
                              placeholder={InputPlaceHolder("Last Name")}
                              handleChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^A-Za-z\s]/g,
                                  ""
                                );
                                setFormData({ ...formData, lastName: value });
                              }}
                              value={formData?.lastName}
                            />
                          </Col>
                        </Row>
                        {/* Phone */}
                        <Row>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4"
                          >
                            <BaseInput
                              label="Phone Number"
                              name="phoneNumber"
                              type="text"
                              placeholder={InputPlaceHolder("Phone Number")}
                              handleChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                const sanitizedValue = rawValue.slice(0, 10);
                                setFormData({
                                  ...formData,
                                  phoneNumber: sanitizedValue,
                                });
                              }}
                              value={formData?.phoneNumber}
                              // disabled
                            />
                          </Col>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Designation"
                              name="designation"
                              type="text"
                              placeholder={InputPlaceHolder("Designation")}
                              handleChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^A-Za-z\s]/g,
                                  ""
                                );
                                setFormData({
                                  ...formData,
                                  designation: value,
                                });
                              }}
                              value={formData.designation}
                              passwordToggle={false}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-4 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Date Of Birth"
                              name="dateOfBirth"
                              type="date"
                              placeholder={InputPlaceHolder("Date Of Birth")}
                              handleChange={handleDateChange}
                              value={
                                formData.dateOfBirth
                                  ? moment(formData.dateOfBirth).format(
                                      "YYYY-MM-DD"
                                    )
                                  : ""
                              }
                              min="1960-01-01"
                              // max="2099-12-31"
                              touched={touched}
                              error={error}
                              handleBlur={handleBlur}
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
                              // handleChange={(
                              //   selectedOption: SelectedOption
                              // ) => {
                              //   formData.isActive = selectedOption?.value || "";
                              // }}
                              handleChange={(
                                selectedOption: SelectedOption
                              ) => {
                                setFormData({
                                  ...formData,
                                  isActive: selectedOption?.value || "",
                                });
                              }}
                              handleBlur={validation.handleBlur}
                              value={
                                dynamicFind(
                                  activeStatusOptions,
                                  formData?.isActive
                                ) || ""
                              }
                              isRequired={false}
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
                            className="mb-4 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Password"
                              name="password"
                              type="password"
                              placeholder={InputPlaceHolder("Password")}
                              handleChange={(e) => {
                                setFormData({
                                  ...formData,
                                  password: e.target.value, // Don't sanitize emails - let backend validation handle it
                                });
                              }}
                              handleBlur={validation.handleBlur}
                              value={formData?.password}
                              passwordToggle={true}
                              isRequired={false}
                            />
                          </Col>
                          <Col
                            md={6}
                            sm={12}
                            xl={6}
                            lg={6}
                            className="mb-4 md:mb-4 lg:mb-4 xl:mb-4 "
                          >
                            <BaseInput
                              label="Confirm Password"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={InputPlaceHolder("confirm password")}
                              handleChange={(e) => {
                                const confirmPassword = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  confirmPassword: confirmPassword,
                                }));
                                // Live check
                                if (
                                  formData.password &&
                                  formData.password !== confirmPassword
                                ) {
                                  setError("Passwords do not match");
                                } else {
                                  setError("");
                                }
                              }}
                              value={formData.confirmPassword}
                              passwordToggle={true}
                              onclick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            />
                            {error && (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "0.8rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                {error}
                              </div>
                            )}
                          </Col>
                        </Row>
                        {formData?.role === "vendor" ||
                        formData?.role === "client" ? (
                          <div>
                            {/* <Row className="mb-4 h3 fw-bold">Company Details</Row> */}
                            <Row>
                              <Col
                                md={6}
                                sm={12}
                                xl={6}
                                lg={6}
                                className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                              >
                                <BaseInput
                                  label="Comapny Name"
                                  name="company_name"
                                  type="text"
                                  placeholder={InputPlaceHolder("Company Name")}
                                  handleChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                      ...formData,
                                      company_name: value,
                                    });
                                  }}
                                  value={formData.company_name}
                                  passwordToggle={false}
                                />
                              </Col>
                              <Col
                                md={6}
                                sm={12}
                                xl={6}
                                lg={6}
                                className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4 "
                              >
                                <BaseInput
                                  className=""
                                  label="Comapny Email"
                                  name="company_email"
                                  type="email"
                                  placeholder={InputPlaceHolder(
                                    "Comapny Email"
                                  )}
                                  handleChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                      ...formData,
                                      company_email: value,
                                    });
                                  }}
                                  value={formData?.company_email}
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
                                  label="Comapny Phone Number"
                                  name="company_phone_number"
                                  type="text"
                                  placeholder={InputPlaceHolder("Phone Number")}
                                  handleChange={(e) => {
                                    const rawValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    const sanitizedValue = rawValue.slice(
                                      0,
                                      10
                                    );
                                    setFormData({
                                      ...formData,
                                      company_phone_number: sanitizedValue,
                                    });
                                  }}
                                  value={formData?.company_phone_number}
                                  // disabled
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
                                  label="Comapny Location"
                                  name="company_location"
                                  type="text"
                                  placeholder={InputPlaceHolder(
                                    "Comapny Location"
                                  )}
                                  handleChange={(e) => {
                                    const rawValue = e.target.value;
                                    // const sanitizedValue = rawValue.slice(0, 10);
                                    setFormData({
                                      ...formData,
                                      company_location: rawValue,
                                    });
                                  }}
                                  value={formData?.company_location}
                                  // disabled
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
                                    setFormData({
                                      ...formData,
                                      hire_resources:
                                        selectedOption?.value || "",
                                    });
                                  }}
                                  handleBlur={formData.handleBlur}
                                  value={
                                    dynamicFind(
                                      hireResourceOptions,
                                      formData?.hire_resources
                                    ) || ""
                                  }
                                  isRequired={false}
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
                                  label="Comapny Type"
                                  name="company_type"
                                  className="select-border"
                                  options={companyType}
                                  placeholder={InputPlaceHolder("Type")}
                                  handleChange={(
                                    selectedOption: SelectedOption
                                  ) => {
                                    setFormData({
                                      ...formData,
                                      company_type: selectedOption?.value || "",
                                    });
                                  }}
                                  handleBlur={formData.handleBlur}
                                  value={
                                    dynamicFind(
                                      companyType,
                                      formData?.company_type
                                    ) || ""
                                  }
                                  isRequired={false}
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
                                  label="Comapny Strangth"
                                  name="company_strength"
                                  type="text"
                                  placeholder={InputPlaceHolder(
                                    "Comapny Strangth"
                                  )}
                                  handleChange={(e) => {
                                    const rawValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    const sanitizedValue = rawValue.slice(
                                      0,
                                      10
                                    );
                                    setFormData({
                                      ...formData,
                                      company_strength: sanitizedValue,
                                    });
                                  }}
                                  value={formData?.company_strength}
                                  // disabled
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
                                  label="Company Linkedin URL"
                                  name="company_linkedin_profile"
                                  type="url"
                                  placeholder={InputPlaceHolder(
                                    "Company Linkedin URL"
                                  )}
                                  handleChange={(e) => {
                                    const rawValue = e.target.value;
                                    setFormData({
                                      ...formData,
                                      company_linkedin_profile: rawValue,
                                    });
                                  }}
                                  handleBlur={handleBlur}
                                  value={formData.company_linkedin_profile}
                                  // touched={"linkedinUrl"}
                                  // error={error.linkedinUrl}
                                  passwordToggle={false}
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
                                    setFormData({
                                      ...formData,
                                      company_website: rawValue,
                                    });
                                  }}
                                  handleBlur={handleBlur}
                                  value={formData.company_website}
                                  // touched={"linkedinUrl"}
                                  // error={error.linkedinUrl}
                                  passwordToggle={false}
                                />
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex justify-end gap-4 ">
                          <>
                            <BaseButton
                              variant="danger"
                              onClick={handleNavigate}
                            >
                              Back
                            </BaseButton>
                            <BaseButton
                              type="submit"
                              className="text-white bg-primary"
                              variant="primary"
                              disabled={loading}
                            >
                              {loading ? "Updating..." : "Save Changes"}
                            </BaseButton>
                          </>
                        </div>
                      </form>
                    )}
                    {!isEditMode && (
                      <form
                        onSubmit={validation.handleSubmit}
                        className="h-full"
                      >
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
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
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
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
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
                              handleChange={(
                                selectedOption: SelectedOption
                              ) => {
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

                                validation.setFieldValue(
                                  "password",
                                  newPassword
                                );
                              }}
                              handleBlur={validation.handleBlur}
                              value={validation.values.password}
                              touched={validation.touched.password}
                              error={validation.errors.password}
                              passwordToggle={true}
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
                              label="Confirm Password"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={InputPlaceHolder("confirm password")}
                              handleChange={validation.handleChange}
                              handleBlur={validation.handleBlur}
                              value={validation.values.confirmPassword}
                              touched={validation.touched.confirmPassword}
                              error={validation.errors.confirmPassword}
                              passwordToggle={true}
                              onclick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              isRequired={true}
                            />
                          </Col>
                        </Row>
                        {validation.values.role === "vendor" ||
                        validation.values.role === "client" ? (
                          <div>
                            {/* <Row className="mb-4 h3 fw-bold">Company Details</Row> */}
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
                                  isRequired={true}
                                />
                              </Col>

                              <Col
                                md={6}
                                sm={12}
                                xl={6}
                                lg={6}
                                className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4 "
                              >
                                <BaseInput
                                  className=""
                                  label="Comapny Email"
                                  name="company_email"
                                  type="email"
                                  placeholder={InputPlaceHolder(
                                    "Comapny Email"
                                  )}
                                  handleChange={validation.handleChange}
                                  handleBlur={validation.handleBlur}
                                  value={validation.values.company_email}
                                  touched={validation.touched.company_email}
                                  error={validation.errors.company_email}
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
                                  label="Company Phone Number"
                                  name="company_phone_number"
                                  type="text"
                                  placeholder={InputPlaceHolder("Phone Number")}
                                  handleChange={(e) => {
                                    const rawValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    ); // digits only
                                    const sanitizedValue = rawValue.slice(
                                      0,
                                      10
                                    ); // limit to 10 digits
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
                                    ); // digits only
                                    const sanitizedValue = rawValue.slice(
                                      0,
                                      10
                                    ); // limit to 10 digits if you want
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
                                    ); // digits only
                                    const sanitizedValue = rawValue.slice(
                                      0,
                                      10
                                    ); // limit to 10 digits
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
                                  isRequired={true}
                                />
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex justify-end gap-4">
                          <BaseButton
                            color="secondary"
                            onClick={handleNavigate}
                          >
                            Back
                          </BaseButton>
                          <BaseButton
                            type="submit"
                            loader={loading}
                            color="primary"
                            // disabled={validation.isSubmitting}
                          >
                            add
                            {/* {validation.isSubmitting ? "Adding..." : "Add"} */}
                          </BaseButton>
                        </div>
                      </form>
                    )}
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

export default UserProfileEdit;
