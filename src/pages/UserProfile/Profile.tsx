/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
// import { FormSelect } from "../../widgets/form-select/FormSelect";
import { Container } from "react-bootstrap";
import { useMounted } from "hooks/useMounted";
import appConstants from "constants/constant";
const { gendersType } = appConstants;
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

const Profile = () => {
  const hasMounted = useMounted();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    profilePicture: "",
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
  const [isEditMode, setIsEditMode] = useState(false);
  const id = Number(sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("authUser");
      const response = await getProfile({ token });
      setProfileData(response.data);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      setFormData({
        profilePicture: profileData.profilePicture || "",
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
  // console.log("profle picture", profileData?.profilePicture);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        if (key === "profilePicture" && formData[key] instanceof File) {
          formDataToSend.append("profilePicture", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      setLoading(true);
      if (id === null) {
        toast.error("User ID not found");
        return;
      }
      const response = await updateProfile(id, formDataToSend);
      if (response) {
        toast.success(response?.message || "Profile updated successfully!");
        setIsEditMode(false);
        setLoading(false);

        setImagePreview(
          response?.data?.profilePicture
            ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
            : imagePreview
        );
      }
    } catch (error) {
      // console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };
  useEffect(() => {
    // console.log("Image preview:", imagePreview);
  }, [imagePreview]);

  const handleCancel = () => {
    setFormData({
      profilePicture: profileData?.profilePicture || "",
      userName: profileData?.userName || "",
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      email: profileData?.email || "",
      phoneNumber: profileData?.phoneNumber || "",
      gender: profileData?.gender || "",
      dateOfBirth: moment(formData.dateOfBirth).isValid()
        ? formData.dateOfBirth
        : "",
      designation: profileData?.designation || "",
    });

    setImagePreview(
      profileData?.profilePicture
        ? `${profileData.profilePicture}`
        : "/images/avatar/avatar.png"
    );
    setIsEditMode(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profilePicture: file,
      }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleProfilePicRemove = () => {
    setFormData((prevState) => ({
      ...prevState,
      profilePicture: "",
    }));
    setImagePreview("/images/avatar/avatar.png");
  };

  return (
    <Container fluid className="p-6">
      <Row className="mb-8">
        <Col xl={12} lg={12} md={12} xs={12}>
          <Card>
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Card.Body>
                <div className="w-full max-w-4xl mx-auto px-4 py-8">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Profile
                  </h2>
                  {hasMounted && (
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col items-center mb-6">
                        <img
                          src={imagePreview}
                          crossOrigin="anonymous"
                          alt="Profile Preview"
                          className="rounded-full w-28 h-28 object-cover mb-4"
                        />
                        <div className="space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="profilePicInput"
                            onChange={handleProfilePicChange}
                          />
                          <button
                            type="button"
                            className="text-sm px-4 py-1.5 bg-gray-200 rounded-md"
                            disabled={!isEditMode}
                            onClick={() =>
                              document
                                .getElementById("profilePicInput")
                                ?.click()
                            }
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            className="text-sm px-4 py-1.5 bg-red-100 text-red-600 rounded-md"
                            onClick={handleProfilePicRemove}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Username */}
                      <div className="mb-4">
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
                      </div>

                      <Row className="mb-4 ">
                        <Col md={6} sm={12} xl={6} lg={6}>
                          <BaseInput
                            label="First Name"
                            name="firstName"
                            className="sm:mb-4"
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
                            disabled={!isEditMode}
                            passwordToggle={false}
                          />
                        </Col>
                        <Col md={6} sm={12} xl={6} lg={6}>
                          <BaseInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder={InputPlaceHolder("Last Name")}
                            handleChange={handleInputChange}
                            value={formData.lastName}
                            disabled={!isEditMode}
                          />
                          {/* </div> */}
                        </Col>
                      </Row>

                      {/* Email */}
                      <div className="mb-4">
                        <BaseInput
                          label="Email"
                          name="email"
                          type="email"
                          placeholder={InputPlaceHolder("Email")}
                          handleChange={handleInputChange}
                          value={formData?.email}
                          disabled
                        />
                      </div>

                      {/* Phone */}
                      <div className="mb-4">
                        <BaseInput
                          label="Phone Number"
                          name="phoneNumber"
                          type="text"
                          placeholder={InputPlaceHolder("Phone Number")}
                          handleChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const sanitizedValue = rawValue.slice(0, 10);
                            setFormData({
                              ...formData,
                              phoneNumber: sanitizedValue,
                            });
                          }}
                          value={formData?.phoneNumber}
                          disabled
                        />
                      </div>

                      <Row className="mb-4">
                        <Col md={6} sm={12} xl={6} lg={6}>
                          <BaseSelect
                            label="Gender"
                            name="gender"
                            className="sm:mb-4 select-border"
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
                            isDisabled={!isEditMode}
                          />
                        </Col>
                        <Col md={6} sm={12} xl={6} lg={6}>
                          <BaseInput
                            label="Date Of Birth"
                            name="dateOfBirth"
                            type="date"
                            placeholder={InputPlaceHolder("Date Of Birth")}
                            handleChange={handleInputChange}
                            value={
                              moment(formData?.dateOfBirth).format(
                                "YYYY-MM-DD"
                              ) || ""
                            }
                            disabled={!isEditMode}
                          />
                        </Col>
                      </Row>

                      {/* Designation */}
                      <div className="mb-4">
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
                          disabled={!isEditMode}
                          passwordToggle={false}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 mt-6">
                        {!isEditMode ? (
                          <BaseButton
                            variant="primary"
                            className="bg-primary text-white"
                            onClick={() => setIsEditMode(true)}
                          >
                            Update Profile
                          </BaseButton>
                        ) : (
                          <>
                            <BaseButton variant="danger" onClick={handleCancel}>
                              Cancel
                            </BaseButton>
                            <BaseButton
                              type="submit"
                              className="bg-primary text-white"
                              variant="primary"
                              disabled={loading}
                            >
                              {loading ? "Saving..." : "Save Changes"}
                            </BaseButton>
                          </>
                        )}
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
