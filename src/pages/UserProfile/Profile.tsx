/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useMounted } from "hooks/useMounted";
import appConstants from "constants/constant";
import { updateProfile, getProfile } from "../../api/usersApi";
import moment from "moment";
import { ProfileFormData } from "interfaces/user.interface";
import { toast } from "react-toastify";
import appEnv from "config/appEnv";
import BaseInput from "components/BaseComponents/BaseInput";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
// import { BaseSelect } from "components/BaseComponents/BaseSelect";
// import { SelectedOption } from "interfaces/applicant.interface";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router";
import { SelectedOption } from "interfaces/applicant.interface";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
// import { statusCode } from '../../interfaces/global.interface';

const { projectTitle, Modules, companyType, hireResourceOptions } =
  appConstants;
const Profile = () => {
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
  });

  const [imagePreview, setImagePreview] = useState<string>(
    "/images/avatar/avatar.png"
  );
  const navigate = useNavigate();

  const id = localStorage.getItem("id");
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authUser");
      setLoading(true);
      try {
        const response = await getProfile({ token });
        setProfileData(response?.data);
      } catch (error) {
        // console.log(error);
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        role: profileData.role || "",
        whatsapp_number: profileData.whatsapp_number || "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (error) {
  //     toast.error("Kindly correct the errors before submitting the changes.");
  //     return;
  //   }
  //   // const profilePicture = event.target.files?.[0];
  //   // if (!profilePicture) return;

  //   const formDataToSend = new FormData();

  //   for (const key in formData) {
  //     if (key === "profilePicture") {
  //       if (formData[key] instanceof File) {
  //         formDataToSend.append(key, formData[key]);
  //       } else if (formData[key] === "") {
  //         formDataToSend.append(key, "null");
  //       }
  //     } else {
  //       formDataToSend.append(key, String(formData[key]));
  //     }
  //   }

  //   try {
  //     setLoading(true);

  //     if (!id) {
  //       toast.error("User ID is missing or invalid.");
  //       return;
  //     }
  //     const response = await updateProfile(id, formDataToSend);

  //     if (response) {
  //       toast.success(response?.message || "Profile updated successfully!");

  //       setLoading(false);

  //       setImagePreview(
  //         response?.data?.profilePicture
  //           ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
  //           : imagePreview
  //       );
  //       navigate("/dashboard");
  //     }
  //   } catch (error) {
  //     // if (error && statusCode === 400) {

  //     toast.error(error instanceof Error ? error.message : "An error occurred");
  //     // }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      toast.error("Kindly correct the errors before submitting the changes.");
      return;
    }

    const formDataToSend = new FormData();
    const isVendor = formData?.role === "vendor" || formData?.role === "client";
    for (const key in formData) {
      // Skip empty vendor fields if user is NOT vendor
      if (!isVendor && key.startsWith("company_")) continue; // 👈 Add this condition
      if (
        !isVendor &&
        [
          "company_type",
          "hire_resources",
          "company_strength",
          "company_linkedin_profile",
          "company_website",
          "whatsapp_number",
        ].includes(key)
      )
        continue;

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

      if (!id) {
        toast.error("User ID is missing or invalid.");
        return;
      }

      const response = await updateProfile(id, formDataToSend);

      if (response) {
        toast.success(response?.message || "Profile updated successfully!");

        setImagePreview(
          response?.data?.profilePicture
            ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
            : imagePreview
        );

        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    // const fileExtension = file?.name?.split(".").pop()?.toLowerCase();

    // if (![".png", ".jpg", ".jpeg"].includes(fileExtension || "")) {
    //   toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
    //   return;
    // }
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
  return (
    <Container fluid className="p-6">
      <Row className="my-1">
        <Col xl={12} lg={12} md={12} xs={12}>
          <Card>
            {loading ? (
              <div className="my-5 d-flex justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Card.Body>
                <div className="w-full max-w-4xl px-4 py-4 mx-auto">
                  <h5 className="justify-start mb-4 text-2xl font-semibold text-start ">
                    Profile
                  </h5>
                  {hasMounted && (
                    <form onSubmit={handleSubmit}>
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

                      {/* Username */}
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
                            handleChange={handleInputChange}
                            value={formData.userName}
                            disabled
                            passwordToggle={false}
                            isRequired={true}
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
                            handleChange={handleInputChange}
                            value={formData.role}
                            disabled
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
                            label="Email"
                            name="email"
                            type="email"
                            placeholder={InputPlaceHolder("Email")}
                            handleChange={handleInputChange}
                            value={formData?.email}
                            isRequired={true}
                            disabled
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
                              setFormData({ ...formData, firstName: value });
                            }}
                            value={formData.firstName}
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
                            handleChange={(e) => {
                              const value = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              );
                              setFormData({ ...formData, lastName: value });
                            }}
                            value={formData?.lastName}
                            isRequired={true}
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
                            isRequired={true}

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
                              setFormData({ ...formData, designation: value });
                            }}
                            value={formData.designation}
                            passwordToggle={false}
                            isRequired={true}
                          />
                        </Col>
                      </Row>

                      <Row>
                        {/* gender field removed */}

                        {/* <Col
                          md={6}
                          sm={12}
                          xl={6}
                          lg={6}
                          className="mb-3 md:mb-4 lg:mb-4 xl:mb-4 "
                        >
                          <BaseSelect
                            label="Gender"
                            name="gender"
                            className=" select-border"
                            options={gendersType}
                            placeholder={InputPlaceHolder("Gender")}
                            handleChange={(selectedOption: SelectedOption) => {
                              setFormData({
                                ...formData,
                                gender: selectedOption?.value || "",
                              });
                            }}
                            value={
                              dynamicFind(gendersType, formData.gender) || ""
                            }
                          />
                        </Col> */}
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
                            isRequired={true}
                          />
                        </Col>
                        {formData.role === "vendor" ||
                        formData.role === "client" ? (
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
                              placeholder={InputPlaceHolder("Whatsapp Number")}
                              handleChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                const sanitizedValue = rawValue.slice(0, 10);
                                setFormData({
                                  ...formData,
                                  whatsapp_number: sanitizedValue,
                                });
                              }}
                              value={formData?.whatsapp_number}
                              isRequired={true}

                              // disabled
                            />
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                      {formData.role === "vendor" ||
                      formData.role === "client" ? (
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
                                placeholder={InputPlaceHolder("Comapny Email")}
                                handleChange={(e) => {
                                  const value = e.target.value;
                                  setFormData({
                                    ...formData,
                                    company_email: value,
                                  });
                                }}
                                value={formData?.company_email}
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
                                label="Comapny Phone Number"
                                name="company_phone_number"
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
                                    company_phone_number: sanitizedValue,
                                  });
                                }}
                                value={formData?.company_phone_number}
                                isRequired={true}

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
                                isRequired={true}

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
                                    hire_resources: selectedOption?.value || "",
                                  });
                                }}
                                handleBlur={formData.handleBlur}
                                value={
                                  dynamicFind(
                                    hireResourceOptions,
                                    formData?.hire_resources
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
                                  const sanitizedValue = rawValue.slice(0, 10);
                                  setFormData({
                                    ...formData,
                                    company_strength: sanitizedValue,
                                  });
                                }}
                                value={formData?.company_strength}
                                isRequired={true}

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
                                isRequired={true}
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
                            onClick={() => navigate("/dashboard")}
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
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
