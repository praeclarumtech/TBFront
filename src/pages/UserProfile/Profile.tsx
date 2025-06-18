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
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router";
// import { statusCode } from '../../interfaces/global.interface';

const { projectTitle, Modules, gendersType } = appConstants;
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
    gender: "",
    dateOfBirth: "",
    designation: "",
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
        gender: profileData.gender || "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      toast.error("Kindly correct the errors before submitting the changes.");
      return;
    }
    // const profilePicture = event.target.files?.[0];
    // if (!profilePicture) return;

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

      if (!id) {
        toast.error("User ID is missing or invalid.");
        return;
      }
      const response = await updateProfile(id, formDataToSend);

      if (response) {
        toast.success(response?.message || "Profile updated successfully!");

        setLoading(false);

        setImagePreview(
          response?.data?.profilePicture
            ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
            : imagePreview
        );
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

  // const handleProfilePicRemove = () => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     profilePicture: "",
  //   }));
  //   setImagePreview("/images/avatar/avatar.png");
  // };
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
                          xl={6}
                          lg={6}
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
                              setFormData({ ...formData, designation: value });
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
                        </Col>
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
