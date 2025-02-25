/* eslint-disable @typescript-eslint/no-explicit-any */

import { Row, Col, Container } from "react-bootstrap";
import * as Yup from "yup";
//import custom hook
import { InputPlaceHolder, projectTitle } from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment } from "react";
import { dynamicFind } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
// import TableContainer from "components/BaseComponents/TableContainer";
// import { Loader } from "react-feather";
import { Form, Link } from "react-router-dom";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import { listOfApplicants } from "api/applicantApi";
import BaseInput from "components/BaseComponents/BaseInput";

type SelectedOption = { label: string; value: string };

const PersonalDetailsForm = ({ onNext }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

  // const navigate = useNavigate();
  //   const [loader, setLoader] = useState(false);

  //   const listOfApplicant = () => {
  //     setLoader(true);
  //     listOfApplicants()
  //       .then((res) => {
  //         setApplicant(res?.data?.item);
  //       })
  //       .catch(() => {})
  //       .finally(() => {
  //         setLoader(false);
  //       });
  //   };

  //   useEffect(() => {
  //     listOfApplicant();
  //   }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      appliedSkills: "",
      totalExperience: "",
    },
    validationSchema: Yup.object({
      appliedSkills: Yup.string(),
      // .required(validationMessages.required("Email"))
      // .email(validationMessages.format("Email"))
      // .matches(emailRegex, validationMessages.format("Email")),
      totalExperience: Yup.string(),
    }),
    onSubmit: (value: any) => {
      onNext(value);
      // const payload = {
      //   email: String(value.email),
      //   password: value.password,
      // };
      // setLoader(true);
      // login(payload)
      //   .then((res) => {
      //     if (res?.statusCode === OK && res?.success === SUCCESS) {
      //       setItem("authUser", res?.data?.token);
      //       const decode = jwtDecode<any>(res?.data);
      //       const role = decode.role;
      //       const id = decode.id;
      //       setItem("role", role);
      //       setItem("id", id);
      //       navigate("/");
      //       toast.success(res?.message);
      //     } else {
      //       toast.error(res?.message);
      //     }
      //   })
      //   .catch((error) => {
      //     errorHandle(error);
      //     setLoader(false);
      //   })
      //   .finally(() => setLoader(false));
    },
  });

  const gendersType = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const stateType = [
    { label: "Delhi", value: "delhi" },
    { label: "Mumbai", value: "mumbai" },
    { label: "Kolkata", value: "kolkata" },
    { label: "Chennai", value: "chennai" },
    { label: "Bangalore", value: "bangalore" },
    { label: "Hyderabad", value: "hyderabad" },
    { label: "Ahmedabad", value: "ahmedabad" },
    { label: "Pune", value: "pune" },
    { label: "Jaipur", value: "jaipur" },
    { label: "Lucknow", value: "lucknow" },
    { label: "Kochi", value: "kochi" },
    { label: "Chandigarh", value: "chandigarh" },
    { label: "Surat", value: "surat" },
    { label: "Indore", value: "indore" },
    { label: "Vadodara", value: "vadodara" },
    { label: "Nagpur", value: "nagpur" },
    { label: "Bhopal", value: "bhopal" },
    { label: "Patna", value: "patna" },
    { label: "Visakhapatnam", value: "visakhapatnam" },
    { label: "Bhubaneswar", value: "bhubaneswar" },
    { label: "Goa", value: "goa" },
    { label: "Madurai", value: "madurai" },
    { label: "Varanasi", value: "varanasi" },
    { label: "Coimbatore", value: "coimbatore" },
    { label: "Ranchi", value: "ranchi" },
    { label: "Agra", value: "agra" },
    { label: "Amritsar", value: "amritsar" },
    { label: "Guwahati", value: "guwahati" },
    { label: "Nashik", value: "nashik" },
    { label: "Shillong", value: "shillong" },
    { label: "Mysuru", value: "mysuru" },
  ];

  const countriesType = [
    { label: "USA", value: "usa" },
    { label: "India", value: "india" },
    { label: "Canada", value: "canada" },
  ];

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            {/* <Card className="mb-3 my-3">
              <CardBody>
                <Row className="flex">
                  <Col xl={5} sm={12} md={4} lg={2} className="!mb-2 ">
                    <BaseSelect
                      name="appliedSkills"
                      className="select-border"
                      options={technologyType}
                      placeholder={InputPlaceHolder("Technology")}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "appliedSkills",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          technologyType,
                          validation.values.appliedSkills
                        ) || ""
                      }
                      touched={validation.touched.appliedSkills}
                      error={validation.errors.appliedSkills}
                    />
                  </Col>

                  <Col xl={5} sm={6} md={4} lg={2} className="px-2 mb-2">
                    <BaseSelect
                      name="appliedSkills"
                      className="select-border"
                      options={experinceType}
                      placeholder={InputPlaceHolder("Experience")}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "appliedSkills",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          experinceType,
                          validation.values.appliedSkills
                        ) || ""
                      }
                      touched={validation.touched.appliedSkills}
                      error={validation.errors.appliedSkills}
                    />
                  </Col>
                  <Col
                    xl={2}
                    sm={6}
                    md={6}
                    lg={2}
                    className="!d-flex !justify-content-end !align-items-center !px-1 mb-2"
                  >
                    <BaseButton
                      color="primary"
                      disabled={loader}
                      className="w-100"
                      type="submit"
                      loader={loader}
                    >
                      Reset Filters
                    </BaseButton>
                  </Col>
                </Row>
              </CardBody>
            </Card> */}

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              className="p-3"
            >
              <Row className="mb-3 g-3">
                {/* First Name */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="First Name"
                    name="firstName"
                    type="text"
                    placeholder={InputPlaceHolder("First Name")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.firstName}
                    touched={validation.touched.firstName}
                    error={validation.errors.firstName}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="firstName">
            <Form.Label className="fw-medium">First Name</Form.Label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("firstName")}
                  isInvalid={!!errors.firstName}
                  placeholder="First Name"
                  value={personalDetails.firstName || ""}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Middle Name */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Middle Name"
                    name="middleName"
                    type="text"
                    placeholder={InputPlaceHolder("First Name")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.middleName}
                    touched={validation.touched.middleName}
                    error={validation.errors.middleName}
                    passwordToggle={false}
                  />

                  {/* <Form.Group controlId="middleName">
            <Form.Label className="fw-medium">Middle Name</Form.Label>
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("middleName")}
                  placeholder="MiddleName"
                  value={personalDetails.middleName || ""}
                  onChange={(e) =>
                    handleFieldChange("middleName", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.middleName?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Last Name */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Last Name"
                    name="lastName"
                    type="text"
                    placeholder={InputPlaceHolder("First Name")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.lastName}
                    touched={validation.touched.lastName}
                    error={validation.errors.lastName}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="lastName">
            <Form.Label className="fw-medium">Last Name</Form.Label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("lastName")}
                  isInvalid={!!errors.lastName}
                  placeholder="Last Name"
                  value={personalDetails.lastName || ""}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Date of Birth */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Date Of Birth"
                    name="dateOfBirth"
                    type="text"
                    placeholder={InputPlaceHolder("Date Of Birth")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.dateOfBirth}
                    touched={validation.touched.dateOfBirth}
                    error={validation.errors.dateOfBirth}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="dateOfBirth">
            <Form.Label className="fw-medium">Date of Birth</Form.Label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="date"
                  {...field}
                  {...register("dateOfBirth")}
                  isInvalid={!!errors.dateOfBirth}
                  placeholder=""
                  value={personalDetails.dateOfBirth || ""}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  onChange={(e) =>
                    handleFieldChange("dateOfBirth", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateOfBirth?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>
                {/* Email */}
                <Col xs={12} md={6} lg={3}>
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
                  />
                  {/* <Form.Group controlId="email">
            <Form.Label className="fw-medium">Email</Form.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="email"
                  {...field}
                  {...register("email")}
                  isInvalid={!!errors.email}
                  placeholder="Email"
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Phone Number */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Phone Number"
                    name="phoneNumber"
                    type="text"
                    placeholder={InputPlaceHolder("Date Of Birth")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.phoneNumber}
                    touched={validation.touched.phoneNumber}
                    error={validation.errors.phoneNumber}
                    passwordToggle={false}
                  />

                  {/* <Form.Group controlId="phoneNumber">
            <Form.Label className="fw-medium">Phone Number</Form.Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("phoneNumber")}
                  isInvalid={!!errors.phoneNumber}
                  placeholder="Phone Number"
                  onChange={(e) =>
                    handleFieldChange("phoneNumber", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* WhatsApp Number */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Whatsapp Number"
                    name="whatsappNumber"
                    type="text"
                    placeholder={InputPlaceHolder("Date Of Birth")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.whatsappNumber}
                    touched={validation.touched.whatsappNumber}
                    error={validation.errors.whatsappNumber}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="whatsappNumber">
            <Form.Label className="fw-medium">WhatsApp Number</Form.Label>
            <Controller
              name="whatsappNumber"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("whatsappNumber")}
                  isInvalid={!!errors.whatsappNumber}
                  onChange={(e) =>
                    handleFieldChange("whatsappNumber", e.target.value)
                  }
                  placeholder="WhatsApp Number"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.whatsappNumber?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseSelect
                    label="Gender"
                    name="gender"
                    className="select-border"
                    options={gendersType}
                    placeholder={InputPlaceHolder("Gender")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "gender",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(gendersType, validation.values.gender) || ""
                    }
                    touched={validation.touched.gender}
                    error={validation.errors.gender}
                  />
                  {/* <Form.Group controlId="gender">
            <Form.Label className="fw-medium">Gender</Form.Label>
            <FormControl fullWidth>
              <Select
                value={genderValue || personalDetails.gender || ""}
                onChange={handleGenderChange}
                className="h-10"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Gender
                </MenuItem>
                {mockData.genders.map((gender) => (
                  <MenuItem key={gender.value} value={gender.value}>
                    {gender.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Group> */}
                </Col>
                {/* Country */}
                <Col xs={12} md={6} lg={3}>
                  <BaseSelect
                    label="Country"
                    name="country"
                    className="select-border"
                    options={countriesType}
                    placeholder={InputPlaceHolder("Country")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "country",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(countriesType, validation.values.country) ||
                      ""
                    }
                    touched={validation.touched.country}
                    error={validation.errors.country}
                  />
                  {/* <Form.Group controlId="country">
            <Form.Label className="fw-medium">Country</Form.Label>
            <FormControl fullWidth>
              <Select
                value={countryValue || personalDetails.country || ""}
                onChange={handleCountryChange}
                className="h-10"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Country
                </MenuItem>
                {mockData.countries.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Group> */}
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseSelect
                    label="State"
                    name="state"
                    className="select-border"
                    options={stateType}
                    placeholder={InputPlaceHolder("State")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "state",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(stateType, validation.values.state) || ""
                    }
                    touched={validation.touched.state}
                    error={validation.errors.state}
                  />
                  {/* <Form.Group controlId="state">
            <Form.Label className="fw-medium">State</Form.Label>
            <FormControl fullWidth>
              <Select
                value={stateValue || personalDetails.state || ""}
                onChange={handleStateChange}
                className="h-10"
                disabled={!countryValue}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {countryValue ? "Select State" : "Select Country First"}
                </MenuItem>
                {countryValue &&
                  mockData.states[countryValue]?.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Form.Group> */}
                </Col>

                {/* City */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="City"
                    name="city"
                    type="text"
                    placeholder={InputPlaceHolder("City")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.city}
                    touched={validation.touched.city}
                    error={validation.errors.city}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="city">
            <Form.Label className="fw-medium">City</Form.Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.city}
                  placeholder="City"
                  {...register("city")}
                  value={personalDetails.city || ""}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.city?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Pincode */}
                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Pincode"
                    name="pincode"
                    type="text"
                    placeholder={InputPlaceHolder("Pincode")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.pincode}
                    touched={validation.touched.pincode}
                    error={validation.errors.pincode}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="pincode">
            <Form.Label className="fw-medium">Pincode</Form.Label>
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("pincode")}
                  isInvalid={!!errors.pincode}
                  placeholder="Enter Pincode"
                  value={personalDetails.pincode || ""}
                  onChange={(e) => handleFieldChange("pincode", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pincode?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>

                {/* Gender */}

                {/* Full Address */}
                <Col xs={12}>
                  <BaseInput
                    label="Full Address"
                    name="fullAddress"
                    type="text"
                    placeholder={InputPlaceHolder("Full address")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.fullAddress}
                    touched={validation.touched.fullAddress}
                    error={validation.errors.fullAddress}
                    passwordToggle={false}
                  />
                  {/* <Form.Group controlId="fullAddress">
            <Form.Label className="fw-medium">Full Address</Form.Label>
            <Controller
              name="fullAddress"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  {...register("fullAddress")}
                  isInvalid={!!errors.fullAddress}
                  placeholder="Enter Full Address"
                  value={personalDetails.fullAddress || ""}
                  onChange={(e) =>
                    handleFieldChange("fullAddress", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullAddress?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
                </Col>
              </Row>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                {/* <Button
          variant="contained"
          color="error"
          onClick={() => navigate("./")}
          className="mb-2 mb-md-0"
        >
          Cancel
        </Button> */}
                <Link
                  to="/applicants"
                  className="p-2 bg-red-600 outline-none rounded text-white justify-center content-center text-center"
                >
                  Cancel
                </Link>

                <BaseButton
                  color="primary"
                  //   disabled={loader}
                  className="w-100"
                  type="submit"
                  //   loader={loader}
                >
                  Next
                </BaseButton>

                {/* <Button variant="contained" color="primary" type="submit">
          Next
        </Button> */}
              </div>
            </Form>
          </div>
        </Row>
        {/* <BreadCrumb title='applicant' pageTitle={projectTitle} /> */}
      </Container>
    </Fragment>
  );
};

export default PersonalDetailsForm;
