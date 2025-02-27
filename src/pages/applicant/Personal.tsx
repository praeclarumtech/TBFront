/* eslint-disable @typescript-eslint/no-explicit-any */

import { Row, Col, Container } from "react-bootstrap";
import * as Yup from "yup";
import { InputPlaceHolder, projectTitle } from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment } from "react";
import { dynamicFind } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form, Link } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import moment from "moment";

import { SelectedOption } from "interfaces/applicant.interface";

const PersonalDetailsForm = ({ onNext, initialValues }: any) => {
  document.title = Modules.Applicant + " | " + projectTitle;

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
      dateOfBirth: moment().format("YYYY-MM-DD") || "",
      fullAddress: initialValues.fullAddress || "",
      state: initialValues.state || "",
      country: initialValues.country || "",
      pincode: initialValues.pincode || "",
      city: initialValues.city || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      middleName: Yup.string(),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      whatsappNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "WhatsApp number must be 10 digits")
        .required("WhatsApp Number is required"),
      dateOfBirth: Yup.date().required("Date of birth is required"),
      city: Yup.string().required("City is required"),
      pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Pincode is required"),
      fullAddress: Yup.string().required("Full Address is required"),
      gender: Yup.string().required("Gender is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
    }),

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
        dateOfBirth: data.dateOfBirth,
        fullAddress: data.fullAddress,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        city: data.city,
      };

      onNext(structuredData);
      onNext(data);
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
                    value={validation.values.dateOfBirth}
                    touched={validation.touched.dateOfBirth}
                    error={validation.errors.dateOfBirth}
                    passwordToggle={false}
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
                </Col>

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
                </Col>

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
                </Col>
              </Row>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <Link
                  to="/applicants"
                  style={styleButton}
                  className="!Text-center !justify-content-center "
                >
                  Cancel
                </Link>

                <BaseButton color="primary" type="submit">
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
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
};
export default PersonalDetailsForm;
