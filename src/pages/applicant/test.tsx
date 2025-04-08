/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Form, Card, Button, Spinner } from "react-bootstrap";
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
import { InputPlaceHolder } from "utils/commonFunctions";

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
    "/images/avatar/avatar-5.jpg"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const id = sessionStorage.getItem("id");

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

      // setImagePreview(
      //   profileData.profilePicture
      //     ? `${appEnv.API_ENDPOINT}/uploads/profile/${profileData.profilePicture}`
      //     : "/images/avatar/avatar-5.jpg"
      // );
      setImagePreview(
        profileData.profilePicture
          ? `${appEnv.API_ENDPOINT}/uploads/profile/${profileData.profilePicture}`
          : "/images/avatar/avatar-5.jpg"
      );
    }
  }, [profileData]);
  console.log("profle picture", profileData?.profilePicture);

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

        // setImagePreview(response?.data?.profilePicture || imagePreview); // update preview after backend response
        setImagePreview(
          response?.data?.profilePicture
            ? `${appEnv.API_ENDPOINT}/uploads/profile/${response.data.profilePicture}`
            : imagePreview
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };
  useEffect(() => {
    console.log("Image preview:", imagePreview);
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
        : "/images/avatar/avatar-5.jpg"
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
    setImagePreview("/images/avatar/avatar-5.jpg");
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
                <div className="mb-6">
                  <h4 className="mb-1">Profile</h4>
                </div>

                {hasMounted && (
                  <Form onSubmit={handleSubmit}>
                    <Row className="align-items-center mb-5  ">
                      <Col md={3} className="mb-3 mb-md-0">
                        <h5 className="mb-0">Profile Pic</h5>
                      </Col>
                      <Col md={9}>
                        <div className="d-flex align-items-center ms-[60px]">
                          <div className="me-3">
                            <img
                              src={imagePreview}
                              crossOrigin="anonymous"
                              className="rounded-circle avatar avatar-lg"
                              alt="Profile Preview"
                            />
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              id="profilePicInput"
                              onChange={handleProfilePicChange}
                            />
                            <Button
                              variant="outline-white"
                              className="me-2"
                              onClick={() =>
                                document
                                  .getElementById("profilePicInput")
                                  ?.click()
                              }
                            >
                              Change
                            </Button>
                            <Button
                              variant="outline-white"
                              onClick={handleProfilePicRemove}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="userName"
                      >
                        UserName
                      </Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          id="userName"
                          value={formData?.userName}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                          required
                        />
                        <BaseInput
                          label="Username"
                          name="UserName"
                          type="text"
                          placeholder={InputPlaceHolder("Username")}
                          handleChange={handleInputChange}
                          // handleBlur={handleBlur}
                          value={formData?.userName}
                          
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>

                    {/* Full Name */}
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="fullName"
                      >
                        Full Name
                      </Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control
                          type="text"
                          placeholder="First Name"
                          id="firstName"
                          value={formData?.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        />
                      </Col>
                      <Col sm={4}>
                        <Form.Control
                          type="text"
                          placeholder="Last Name"
                          id="lastName"
                          value={formData?.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        />
                      </Col>
                    </Row>

                    {/* Email */}
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="email"
                      >
                        Email
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          id="email"
                          value={formData?.email}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                          required
                        />
                      </Col>
                    </Row>

                    {/* Phone */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="phoneNumber">
                        Phone (Optional)
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Phone"
                          id="phoneNumber"
                          value={formData?.phoneNumber}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                        />
                      </Col>
                    </Row>

                    {/* Gender & Date of Birth */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="GenderDOB">
                        Gender & DOB
                      </Form.Label>
                      <Col sm={4}>
                        {/* <Form.Control
                          as={FormSelect}
                          placeholder="Gender"
                          id="gender"
                          options={gendersType}
                          value={formData?.gender || ""}
                          onChange={(e) => handleSelectChange(e)}
                          disabled={!isEditMode}
                        /> */}
                        <Form.Control
                          id="gender"
                          name="gender"
                          as="select"
                          value={formData.gender || ""}
                          onChange={handleInputChange}
                        >
                          {gendersType.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col sm={4}>
                        <Form.Control
                          type="date"
                          id="dateOfBirth"
                          value={
                            moment(formData?.dateOfBirth).format(
                              "YYYY-MM-DD"
                            ) || ""
                          }
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        />
                      </Col>
                    </Row>

                    {/* Designation */}
                    <Row className="align-items-center">
                      <Form.Label className="col-sm-4" htmlFor="designation">
                        Designation
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Designation"
                          id="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        />
                      </Col>
                    </Row>

                    {/* Action Buttons */}
                    <Row className="mt-4">
                      <Col
                        md={{ offset: 4, span: 8 }}
                        xs={12}
                        className="d-flex justify-content-between"
                      >
                        {!isEditMode ? (
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditMode(true)}
                          >
                            Update Profile
                          </Button>
                        ) : (
                          <>
                            <Button variant="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                              Save Changes
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Form, Card, Button, Spinner } from "react-bootstrap";
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
  const id = sessionStorage.getItem("id");

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
  console.log("profle picture", profileData?.profilePicture);

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
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };
  useEffect(() => {
    console.log("Image preview:", imagePreview);
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
                <div className="mb-6">
                  <h4 className="mb-1">Profile</h4>
                </div>

                {hasMounted && (
                  <Form onSubmit={handleSubmit}>
                   
                      <div className="d-flex align-items-center ">
                         <Row className="align-items-center mb-5  ">
                        <Col md={12}>
                          <div className=" d-flex align-items-center">
                            <img
                              src={imagePreview}
                              crossOrigin="anonymous"
                              className="rounded-circle avatar avatar-lg"
                              alt="Profile Preview"
                            />
                            </div>
                            
                          </Col>
                          </Row>
                          <Row className="align-items-center mb-5  ">
                        <Col md={12} className="mb-3 mb-lg-0">
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              id="profilePicInput"
                              onChange={handleProfilePicChange}
                            />
                            <Button
                              variant="outline-white"
                              className="me-2"
                              onClick={() =>
                                document
                                  .getElementById("profilePicInput")
                                  ?.click()
                              }
                            >
                              Change
                            </Button>
                            <Button
                              variant="outline-white"
                              onClick={handleProfilePicRemove}
                            >
                              Remove
                            </Button>
                          </div>
                        </Col>
                          </Row>
                      </div>
                
                    <Row className="mb-3 d-flex align-items-center ">
                      {/* <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="userName"
                      >
                        UserName
                      </Form.Label> */}
                      <Col sm={4} className="mb-3 mb-lg-0">
                        {/* <Form.Control
                          type="text"
                          placeholder="Username"
                          id="userName"
                          value={formData?.userName}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                          required
                        /> */}
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
                    </Row>

                    {/* Full Name */}
                    <Row className="mb-3">
                      {/* <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="fullName"
                      >
                        Full Name
                      </Form.Label> */}
                      <Col sm={4} className="mb-3 mb-lg-0">
                        {/* <Form.Control
                          type="text"
                          placeholder="First Name"
                          id="firstName"
                          value={formData?.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        /> */}
                        <BaseInput
                          label="First Name"
                          name="firstName"
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
                      <Col sm={4}>
                        {/* <Form.Control
                          type="text"
                          placeholder="Last Name"
                          id="lastName"
                          value={formData?.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        /> */}
                        <BaseInput
                          label="Last Name"
                          name="lastName"
                          type="text"
                          placeholder={InputPlaceHolder("Last Name")}
                          handleChange={handleInputChange}
                          value={formData.lastName}
                          disabled={!isEditMode}
                        />
                      </Col>
                    </Row>

                    {/* Email */}
                    <Row className="mb-3">
                      {/* <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="email"
                      >
                        Email
                      </Form.Label> */}
                      <Col md={8} xs={12}>
                        {/* <Form.Control
                          type="email"
                          placeholder="Email"
                          id="email"
                          value={formData?.email}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                          required
                        /> */}
                        <BaseInput
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

                    {/* Phone */}
                    <Row className="mb-3">
                      {/* <Form.Label className="col-sm-4" htmlFor="phoneNumber">
                        Phone (Optional)
                      </Form.Label> */}
                      <Col md={8} xs={12}>
                        {/* <Form.Control
                          type="text"
                          placeholder="Enter Phone"
                          id="phoneNumber"
                          value={formData?.phoneNumber}
                          onChange={handleInputChange}
                          // disabled={!isEditMode}
                          disabled
                        /> */}
                        <BaseInput
                          label="Phone Number"
                          name="phoneNumber"
                          type="text"
                          placeholder={InputPlaceHolder("Phone Number")}
                          handleChange={async (
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const sanitizedValue = rawValue.slice(0, 10);
                            setFormData({
                              ...formData,
                              phoneNumber: sanitizedValue,
                            });
                          }}
                          disabled
                          value={formData?.phoneNumber}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>

                    {/* Gender & Date of Birth */}
                    <Row className="mb-3">
                      {/* <Form.Label className="col-sm-4" htmlFor="GenderDOB">
                        Gender & DOB
                      </Form.Label> */}
                      <Col sm={4}>
                        {/* <Form.Control
                          as={FormSelect}
                          placeholder="Gender"
                          id="gender"
                          options={gendersType}
                          value={formData?.gender || ""}
                          onChange={(e) => handleSelectChange(e)}
                          disabled={!isEditMode}
                        /> */}
                        {/* <Form.Control
                          id="gender"
                          name="gender"
                          as="select"
                          value={formData.gender || ""}
                          onChange={handleInputChange}
                        >
                          {gendersType.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </Form.Control> */}
                        <BaseSelect
                          label="Gender"
                          name="gender"
                          className="select-border"
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
                          // error={validation.errors.gender}
                        />
                      </Col>
                      <Col sm={4}>
                        {/* <Form.Control
                          type="date"
                          id="dateOfBirth"
                          value={
                            moment(formData?.dateOfBirth).format(
                              "YYYY-MM-DD"
                            ) || ""
                          }
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        /> */}
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
                          // error={dateOfBirth}
                          passwordToggle={false}
                          // min={minDateOfBirth}
                          disabled={!isEditMode}
                        />
                      </Col>
                    </Row>

                    {/* Designation */}
                    <Row className="align-items-center">
                      <Col md={8} xs={12}>
                        {/* <Form.Control
                          type="text"
                          placeholder="Enter Designation"
                          id="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          required
                        /> */}
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
                      </Col>
                    </Row>

                    {/* Action Buttons */}
                    <Row className="mt-4">
                      <Col
                        md={{ offset: 4, span: 8 }}
                        xs={12}
                        className="d-flex justify-content-between"
                      >
                        {!isEditMode ? (
                          <BaseButton
                            variant="secondary"
                            onClick={() => setIsEditMode(true)}
                          >
                            Update Profile
                          </BaseButton>
                        ) : (
                          <>
                            <BaseButton
                              variant="secondary"
                              onClick={handleCancel}
                            >
                              Cancel
                            </BaseButton>
                            <Button variant="primary" type="submit">
                              Save Changes
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
