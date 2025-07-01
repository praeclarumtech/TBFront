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
  dynamicFind,
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
import { SelectedOption } from "interfaces/applicant.interface";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Skeleton } from "antd";

const {
  projectTitle,
  Modules,
  CREATED,
  SUCCESS,
  emailRegex,
  passwordRegex,
  validationMessages,
} = appConstants;
const UserProfileEdit = () => {
  document.title = Modules.Profile + " | " + projectTitle;
  const hasMounted = useMounted();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

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
  });
  interface RoleOption {
    label: string;
    value: string;
  }

  const roleType: RoleOption[] = [
    { label: "HR", value: "hr" },
    { label: "Admin", value: "admin" },
    // { label: "User", value: "user" },
    { label: "Vendor", value: "vendor" },
    { label: "Guest", value: "guest" },
    // Remove the empty option if not needed
  ];

  const { _id } = useParams();
  const isEditMode = Boolean(_id);

  const location = useLocation();
  const [imagePreview, setImagePreview] = useState<string>(
    "/images/avatar/avatar.png"
  );
  const navigate = useNavigate();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      email: "",
      password: "Admin@123",
      confirmPassword: "Admin@123",
      role: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(RequiredField("Username")),
      email: Yup.string()
        .required(validationMessages.required("Email"))
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email")),
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
        role: values.role,
        password: values.password,
        confirmPassword: values.password,
      };

      userAdd(payload)
        .then((res) => {
          if (res?.statusCode === CREATED && res?.success === SUCCESS) {
            toast.success(res?.message);
            resetForm();
            // resetData();
            navigate("/userManagement");
          } else {
            toast.error(res?.message);
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
    if (error) {
      toast.error("Kindly correct the errors before submitting the changes.");
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
    navigate("/userManagement");
  };
  return (
    <Fragment>
      <div className="pt-1 page-content"></div>
      <Container fluid className="p-6 overflow-visible">
        <Row className="my-1">
          <Col xl={12} lg={12} md={12} xs={12}>
            <Card className="overflow-visible">
              {loading ? (
                <div className="m-10 my-5 d-flex justify-content-center">
                  {/* <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner> */}
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
                            xl={6}
                            lg={6}
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
                        </Row>
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
                            className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 sm:mb-4"
                          >
                            <BaseSelect
                              label="Role"
                              name="role"
                              className="select-border"
                              options={roleType}
                              placeholder={InputPlaceHolder("Role")}
                              handleChange={(
                                selectedOption: SelectedOption
                              ) => {
                                validation.setFieldValue(
                                  "role",
                                  selectedOption?.value || ""
                                );
                              }}
                              handleBlur={validation.handleBlur}
                              value={
                                dynamicFind(roleType, validation.values.role) ||
                                ""
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
                            <BaseInput
                              label="Password"
                              name="password"
                              type="password"
                              placeholder={InputPlaceHolder("Password")}
                              handleChange={(e) => {
                                const newPassword = e.target.value;
                                // Update both password and confirmPassword fields
                                validation.setFieldValue(
                                  "password",
                                  newPassword
                                );
                                validation.setFieldValue(
                                  "confirmPassword",
                                  newPassword
                                );
                              }}
                              handleBlur={validation.handleBlur}
                              value={validation.values.password}
                              touched={
                                validation.touched.password ||
                                validation.touched.confirmPassword
                              }
                              error={
                                validation.errors.password ||
                                validation.errors.confirmPassword
                              }
                              passwordToggle={true}
                              isRequired={true}
                            />
                          </Col>
                        </Row>
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
                            disabled={validation.isSubmitting}
                          >
                            {validation.isSubmitting ? "Adding..." : "Add"}
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
