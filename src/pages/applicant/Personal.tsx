/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Fragment } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form, useNavigate } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import moment from "moment";
import BaseTextarea from "components/BaseComponents/BaseTextArea";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import { CheckExistingApplicant } from "../../api/applicantApi";
import {
  personalApplicantSchema,
  SelectedOption,
  City,
} from "interfaces/applicant.interface";
import { viewAllCity } from "api/cityApis";
import { viewAllState } from "api/stateApi";
import { viewAllCountry } from "api/CountryStateCity";

const { projectTitle, Modules, gendersType, maritalStatusType } = appConstants;

const PersonalDetailsForm = ({ onNext, initialValues, module }: any) => {
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<City[]>([]);
  const [country, setCountry] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const navigate = useNavigate();

  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    const getCountry = async () => {
      try {
        setLoading(true);
        const countryData = await viewAllCountry();
        if (countryData?.data) {
          setCountry(
            countryData.data.item.map(
              (country: { country_name: string; _id: string }) => ({
                label: country.country_name,
                value: country._id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    getCountry();
  }, [selectedCountryId]);

  useEffect(() => {
    const getState = async (selectedCountryId?: string) => {
      try {
        setLoading(true);
        console.log("object", selectedCountryId);
        const params = { country_id: selectedCountryId };
        const stateData = await viewAllState(params);
        if (stateData?.data) {
          setStates(
            stateData.data.item.map(
              (state: {
                state_name: string;
                _id: string;
                country_id: string;
              }) => ({
                label: state.state_name,
                value: state._id,
                country_id: state.country_id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    getState(selectedCountryId);
  }, [selectedCountryId]);

  useEffect(() => {
    const getCities = async (selectedStateId?: string) => {
      try {
        setLoading(true);
        const params = { state_id: selectedStateId };
        const cityData = await viewAllCity(params);
        if (cityData?.data) {
          setCities(
            cityData.data.item.map(
              (city: { city_name: string; _id: string; state_id: string }) => ({
                label: city.city_name,
                value: city._id,
                state_id: city.state_id,
              })
            )
          );
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    getCities(selectedStateId);
  }, [selectedStateId]);

  useEffect(() => {
    if (cities.length && states.length && country.length) {
      setFormReady(true);
    }
  }, [cities, states, country]);

  const minDateOfBirth = moment().subtract(60, "years").format("YYYY-MM-DD");
  const formattedDateOfBirth = initialValues.dateOfBirth
    ? moment(initialValues.dateOfBirth).format("YYYY-MM-DD")
    : "";

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: formReady
      ? {
          firstName: initialValues.name.firstName || "",
          middleName: initialValues.name.middleName || "",
          lastName: initialValues.name.lastName || "",
          whatsappNumber: initialValues.phone.whatsappNumber || "",
          phoneNumber: initialValues.phone.phoneNumber || "",
          email: initialValues.email || "",
          gender: initialValues.gender || "",
          dateOfBirth: formattedDateOfBirth,
          state: initialValues.state || "",
          country: initialValues.country || "India",
          currentCity: initialValues.currentCity || "",
          currentAddress: initialValues.currentAddress || "",
          maritalStatus: initialValues?.maritalStatus || "",
          permanentAddress: initialValues?.permanentAddress || "",
        }
      : {},
    validationSchema: personalApplicantSchema,

    onSubmit: (data: any) => {
      setLoading(true);

      // Prevent submission if email or phone number is already registered
      if (emailError || phoneNumberError || whatsappError) {
        setLoading(false);
        return;
      }

      const selectedCity = cities.find(
        (city) => city.value === data.currentCity
      );

      if (selectedCity) {
        data.currentCity = selectedCity.value;
      }

      const selectedState = states.find((state) => state.value === data.state);

      if (selectedState) {
        data.state = selectedState.value;
      }

      const selectedCountry = country.find(
        (country) => country.value === data.country
      );

      if (selectedCountry) {
        data.country = selectedCountry.value;
      }

      onNext({
        ...data,
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
        currentCity: data.currentCity,
        currentAddress: data.currentAddress,
        maritalStatus: data.maritalStatus,
        permanentAddress: data.permanentAddress,
      });
      onNext(data);

      setLoading(false);
    },
  });

  const checkExistingField = async (field: string, value: string) => {
    if (field === "email") {
      setEmailError("");
    } else if (field === "phoneNumber") {
      setPhoneNumberError("");
    } else if (field === "whatsappNumber") {
      setWhatsappError("");
    }

    try {
      const params: {
        email?: string;
        phoneNumber?: number;
        whatsappNumber?: number;
      } = {};

      if (field === "email") {
        params.email = value;
      } else if (field === "phoneNumber") {
        params.phoneNumber = Number(value);
      } else if (field === "whatsappNumber") {
        params.whatsappNumber = Number(value);
      }

      const response = await CheckExistingApplicant(params);

      if (response?.data?.exists) {
        if (field === "email") {
          setEmailError(
            response?.message || "This email is already registered."
          );
        } else if (field === "phoneNumber") {
          setPhoneNumberError("This phone number is already registered.");
        } else if (field === "whatsappNumber") {
          setWhatsappError("This whatsApp number is already registered.");
        }
      } else {
        if (field === "email") {
          setEmailError("");
        } else if (field === "phoneNumber") {
          setPhoneNumberError("");
        } else if (field === "whatsappNumber") {
          setWhatsappError("");
        }
      }
    } catch (error) {
      errorHandle(error);

      return "Error while checking this field.";
    }
  };

  const handleCancel = () => {
    if (module === "import-applicant") {
      navigate("/import-applicants");
    } else {
      navigate("/applicants");
    }
  };

  const handleCountryChange = (selectedOption: SelectedOption) => {
    const selectedValue = selectedOption?.label || "";
    // Set formik field value
    validation.setFieldValue("country", selectedValue);

    // Find the selected country's full object
    const selectedCountry = country.find((c) => c.label === selectedValue);

    // Extract and store the country_id
    if (selectedCountry) {
      setSelectedCountryId(selectedCountry.value || initialValues.country); // or whatever state variable you're using
    }
  };

  const handleStateChange = (selectedOption: SelectedOption) => {
    const selectedValue = selectedOption?.label || "";

    // Set formik field value
    validation.setFieldValue("state", selectedValue);

    // Find the selected country's full object
    const selectedState = states.find((c) => c.label === selectedValue);

    // Extract and store the country_id
    if (selectedState) {
      setSelectedStateId(selectedState.value); // or whatever state variable you're using
    }
  };

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
              {loading ? (
                <div className="my-5 d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Row className="mb-3 g-3">
                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="First Name"
                      name="firstName"
                      type="text"
                      className="select-border"
                      placeholder={InputPlaceHolder("First Name")}
                      handleChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        validation.setFieldValue("firstName", value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.firstName}
                      touched={validation.touched.firstName}
                      error={validation.errors.firstName}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Middle Name (Optional)"
                      name="middleName"
                      type="text"
                      className="select-border"
                      placeholder={InputPlaceHolder("Middle Name (Optional)")}
                      handleChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        validation.setFieldValue("middleName", value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.middleName}
                      touched={validation.touched.middleName}
                      error={validation.errors.middleName}
                      passwordToggle={false}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Last Name"
                      name="lastName"
                      type="text"
                      placeholder={InputPlaceHolder("Last Name")}
                      handleChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        validation.setFieldValue("lastName", value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.lastName}
                      touched={validation.touched.lastName}
                      error={validation.errors.lastName}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Email"
                      name="email"
                      type="text"
                      className="select-border"
                      placeholder={InputPlaceHolder("Email")}
                      handleChange={async (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const emailValue = e.target.value;
                        validation.setFieldValue("email", emailValue);

                        setEmailError("");
                        const emailError = await checkExistingField(
                          "email",
                          emailValue
                        );
                        validation.setFieldError("email", emailError);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.email}
                      touched={validation.touched.email}
                      error={validation.errors.email || emailError}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Phone Number"
                      name="phoneNumber"
                      type="text"
                      className="select-border"
                      placeholder={InputPlaceHolder("Phone Number")}
                      handleChange={async (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        const sanitizedValue = rawValue.slice(0, 10);
                        validation.setFieldValue("phoneNumber", sanitizedValue);
                        const phoneError = await checkExistingField(
                          "phoneNumber",
                          sanitizedValue
                        );
                        validation.setFieldError("phoneNumber", phoneError);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.phoneNumber}
                      touched={validation.touched.phoneNumber}
                      error={validation.errors.phoneNumber || phoneNumberError}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Whatsapp Number"
                      name="whatsappNumber"
                      type="text"
                      className="select-border"
                      placeholder={InputPlaceHolder("Whatsapp Number")}
                      handleChange={async (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        const sanitizedValue = rawValue.slice(0, 10);
                        validation.setFieldValue(
                          "whatsappNumber",
                          sanitizedValue
                        );
                        const phoneError = await checkExistingField(
                          "whatsappNumber",
                          sanitizedValue
                        );
                        validation.setFieldError("whatsappNumber", phoneError);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.whatsappNumber}
                      touched={validation.touched.whatsappNumber}
                      error={validation.errors.whatsappNumber || whatsappError}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="Date Of Birth"
                      name="dateOfBirth"
                      type="date"
                      className="select-border"
                      placeholder={InputPlaceHolder("Date Of Birth")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.dateOfBirth || ""}
                      touched={validation.touched.dateOfBirth}
                      error={validation.errors.dateOfBirth}
                      passwordToggle={false}
                      min={minDateOfBirth}
                      isRequired={false}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
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
                      isRequired={false}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <BaseSelect
                      label="Marital Status (Optional)"
                      name="maritalStatus"
                      className="select-border"
                      options={maritalStatusType}
                      placeholder="Marital Status (Optional)"
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "maritalStatus",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          maritalStatusType,
                          validation.values.maritalStatus
                        ) || ""
                      }
                      touched={validation.touched.maritalStatus}
                      error={validation.errors.maritalStatus}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <BaseSelect
                      label="Country"
                      name="country"
                      className="select-border"
                      options={country}
                      placeholder={InputPlaceHolder("Country")}
                      handleChange={handleCountryChange}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          country,
                          validation.values.country,
                          "location"
                        ) || ""
                      }
                      touched={validation.touched.country}
                      error={validation.errors.country}
                      isRequired={false}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseSelect
                      label="State"
                      name="state"
                      className="select-border"
                      options={states}
                      placeholder={InputPlaceHolder("State")}
                      handleChange={handleStateChange}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          states,
                          validation.values.state,
                          "location"
                        ) || ""
                      }
                      touched={validation.touched.state}
                      error={validation.errors.state}
                      isRequired={false}
                    />
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                    <BaseSelect
                      label="City"
                      name="currentCity"
                      className="select-border"
                      options={cities}
                      placeholder={InputPlaceHolder("City")}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "currentCity",
                          selectedOption?.label || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          cities,
                          validation.values.currentCity,
                          "location"
                        ) || ""
                      }
                      touched={validation.touched.currentCity}
                      error={validation.errors.currentCity}
                      isRequired={false}
                    />
                  </Col>

                  <Col xs={12} md={12} lg={12}>
                    <BaseTextarea
                      label="Current Address"
                      name="currentAddress"
                      className="select-border"
                      placeholder={InputPlaceHolder("Current Address")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.currentAddress}
                      touched={validation.touched.currentAddress}
                      error={validation.errors.currentAddress}
                      passwordToggle={false}
                      multiline
                      rows={2}
                      cols={50}
                      isRequired={false}
                    />
                  </Col>

                  <Col xs={12} md={12} lg={12}>
                    <div className="d-flex align-items-center">
                      <input
                        name="checkbox"
                        type="checkbox"
                        id="checkbox"
                        checked={validation.values.checkbox}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const isChecked = e.target.checked;
                          validation.setFieldValue("checkbox", isChecked);

                          if (isChecked) {
                            validation.setFieldValue(
                              "permanentAddress",
                              validation.values.currentAddress
                            );
                          } else {
                            validation.setFieldValue("permanentAddress", "");
                          }
                        }}
                        onBlur={validation.handleBlur}
                      />

                      <label htmlFor="checkbox" className="ms-2">
                        Permanent address same as current address
                      </label>
                    </div>
                  </Col>

                  <Col xs={12} md={12} lg={12}>
                    <BaseTextarea
                      label="Permanent Address (Optional)"
                      name="permanentAddress"
                      className="select-border"
                      placeholder={InputPlaceHolder(
                        "Permanent Address (Optional)"
                      )}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.permanentAddress}
                      touched={validation.touched.permanentAddress}
                      error={validation.errors.permanentAddress}
                      passwordToggle={false}
                      multiline
                      rows={2}
                      cols={50}
                    />
                  </Col>
                </Row>
              )}
              <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-end">
                <BaseButton
                  className="max-w-full btn btn-outline-danger"
                  color="white"
                  onClick={handleCancel}
                >
                  Cancel
                </BaseButton>

                <BaseButton
                  color="primary"
                  type="submit"
                  className="max-w-full d-flex align-items-center justify-content-center"
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

export default PersonalDetailsForm;
