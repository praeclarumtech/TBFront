/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form, Link } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import moment from "moment";
import BaseTextarea from "components/BaseComponents/BaseTextArea";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";
import {
  personalApplicantSchema,
  SelectedOption,
} from "interfaces/applicant.interface";

const { projectTitle, Modules, gendersType, countriesType, stateType } =
  appConstants;

const PersonalDetailsForm = ({ onNext, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;
  const minDateOfBirth = moment().subtract(15, "years").format("YYYY-MM-DD");
  const formattedDateOfBirth = initialValues.dateOfBirth
    ? moment(initialValues.dateOfBirth).format("YYYY-MM-DD")
    : "";
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: initialValues.name.firstName || "",
      middleName: initialValues.name.middleName || "",
      lastName: initialValues.name.lastName || "",
      whatsappNumber: initialValues.phone.whatsappNumber || "",
      phoneNumber: initialValues.phone.phoneNumber || "",
      email: initialValues.email || "",
      gender: initialValues.gender || "",
      dateOfBirth: formattedDateOfBirth,
      state: initialValues.state || "",
      country: initialValues.country || "",
      currentPincode: initialValues.currentPincode || "",
      currentCity: initialValues.currentCity || "",
      homeTownCity: initialValues.homeTownCity || "",
      homePincode: initialValues.homePincode || "",
      preferredLocations: initialValues.preferredLocations || "",
      currentLocation: initialValues.currentLocation || "",
    },
    validationSchema: personalApplicantSchema,
    onSubmit: (data: any) => {
      const structuredData = {
        name: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
        },
        phone: {
          whatsappNumber: data.whatsappNumber,
          phoneNumber: data.phoneNumber,
        },

        email: data.email,
        gender: data.gender,
        dateOfBirth: moment(data.dateOfBirth).toISOString(),
        state: data.state,
        country: data.country,
        currentPincode: data.currentPincode,
        currentCity: data.currentCity,
        homeTownCity: data.homeTownCity,
        homePincode: data.homePincode,
        preferredLocations: data.preferredLocations,
        currentLocation: data.currentLocation,
      };

      onNext(structuredData);
      onNext(data);
    },
  });

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
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
              <Row className="mb-3 g-3">
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
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Middle Name"
                    name="middleName"
                    type="text"
                    placeholder={InputPlaceHolder("Middle Name")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.middleName}
                    touched={validation.touched.middleName}
                    error={validation.errors.middleName}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Last Name"
                    name="lastName"
                    type="text"
                    placeholder={InputPlaceHolder("Last Name")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.lastName}
                    touched={validation.touched.lastName}
                    error={validation.errors.lastName}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Date Of Birth"
                    name="dateOfBirth"
                    type="date"
                    placeholder={InputPlaceHolder("Date Of Birth")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.dateOfBirth || ""}
                    touched={validation.touched.dateOfBirth}
                    error={validation.errors.dateOfBirth}
                    passwordToggle={false}
                    min={minDateOfBirth}
                  />
                </Col>

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
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Phone Number"
                    name="phoneNumber"
                    type="text"
                    placeholder={InputPlaceHolder("Phone Number")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.phoneNumber}
                    touched={validation.touched.phoneNumber}
                    error={validation.errors.phoneNumber}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Whatsapp Number"
                    name="whatsappNumber"
                    type="text"
                    placeholder={InputPlaceHolder("Whatsapp Number")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.whatsappNumber}
                    touched={validation.touched.whatsappNumber}
                    error={validation.errors.whatsappNumber}
                    passwordToggle={false}
                  />
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
                </Col>

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
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Current City"
                    name="currentCity"
                    type="text"
                    placeholder={InputPlaceHolder("Current City")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentCity}
                    touched={validation.touched.currentCity}
                    error={validation.errors.currentCity}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <BaseInput
                    label="Current Pincode"
                    name="currentPincode"
                    type="number"
                    placeholder={InputPlaceHolder("Current Pincode")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentPincode}
                    touched={validation.touched.currentPincode}
                    error={validation.errors.currentPincode}
                    passwordToggle={false}
                    className="!appearance-none"
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Home Town"
                    name="homeTownCity"
                    type="text"
                    placeholder={InputPlaceHolder("Home Town/City")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.homeTownCity}
                    touched={validation.touched.homeTownCity}
                    error={validation.errors.homeTownCity}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <BaseInput
                    label="Home Town Pincode"
                    name="homePincode"
                    type="text"
                    placeholder={InputPlaceHolder("Current Pincode")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.homePincode}
                    touched={validation.touched.homePincode}
                    error={validation.errors.homePincode}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} md={12} lg={4}>
                  <BaseInput
                    label="Preferred Locations"
                    name="preferredLocations"
                    type="text"
                    placeholder={InputPlaceHolder("Preferred Locations")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.preferredLocations}
                    touched={validation.touched.preferredLocations}
                    error={validation.errors.preferredLocations}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12}>
                  <BaseTextarea
                    label="Current Location"
                    name="currentLocation"
                    placeholder={InputPlaceHolder("Current Location")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentLocation}
                    touched={validation.touched.currentLocation}
                    error={validation.errors.currentLocation}
                    passwordToggle={false}
                    multiline
                    rows={2}
                    cols={50}
                  />
                </Col>
              </Row>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <Link
                  to="/applicants"
                  style={styleButton}
                  className="d-flex align-items-center justify-content-center"
                >
                  Cancel
                </Link>

                <BaseButton
                  color="primary"
                  type="submit"
                  className="d-flex align-items-center justify-content-center"
                >
                  Next
                </BaseButton>
              </div>
            </Form>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

const styleButton = {
  backgroundColor: "red",
  color: "white",
  borderRadius: "5px",
  padding: "8px 20px",
  fontSize: "16px",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
};
export default PersonalDetailsForm;
