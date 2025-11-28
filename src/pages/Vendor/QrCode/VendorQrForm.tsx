/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Fragment } from "react";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { useParams, useNavigate } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import * as Yup from "yup";
import { viewAllState } from "api/stateApi";
import { viewAllCity } from "api/cityApis";
import BaseButton from "components/BaseComponents/BaseButton";
import { Card } from "antd";
import { SelectedOption, City } from "interfaces/applicant.interface";
import toastify from "utils/toastify";
import {
  createVendorQR,
  updateVendorQR,
  getVendorDetails,
} from "api/vendorApi";

const { projectTitle, Modules, companyType, hireResourceOptions, SUCCESS } =
  appConstants;

const vendorQrSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required.")
    .max(15, "First name cannot exceed 15 characters.")
    .min(2, "First name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters.")
    .trim(),
  lastName: Yup.string()
    .required("Last name is required.")
    .max(15, "Last name cannot exceed 15 characters.")
    .min(2, "Last name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters.")
    .trim(),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  phoneNumber: Yup.string()
    .matches(
      /^[1-9][0-9]{9}$/,
      "Please enter a valid 10-digit phone number (should not start with 0)."
    )
    .required("Phone number is required."),
  isIndependentConsultant: Yup.string()
    .oneOf(["yes", "no"], "Please select an option.")
    .required("Please select if you are an independent consultant."),
  company_name: Yup.string().when("isIndependentConsultant", {
    is: "no",
    then: (schema) => schema.required("Company name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  company_email: Yup.string().when("isIndependentConsultant", {
    is: "no",
    then: (schema) =>
      schema
        .email("Please enter a valid company email address.")
        .required("Company email is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  company_phone_number: Yup.string().when("isIndependentConsultant", {
    is: "no",
    then: (schema) =>
      schema
        .matches(
          /^[1-9][0-9]{9}$/,
          "Please enter a valid 10-digit phone number (should not start with 0)."
        )
        .required("Company phone number is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  company_location: Yup.string().when("isIndependentConsultant", {
    is: "no",
    then: (schema) => schema.required("Company location is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  whatsapp_number: Yup.string()
    .matches(
      /^[1-9][0-9]{9}$/,
      "Please enter a valid 10-digit phone number (should not start with 0)."
    )
    .required("Whatsapp number is required."),
  company_website: Yup.string().url("Please enter a valid URL."),
  company_linkedin_profile: Yup.string().url("Please enter a valid URL."),
  vendor_linkedin_profile: Yup.string().url("Please enter a valid URL."),
});

const VendorQrForm = () => {
  document.title = (Modules as any).CreateVendorForm + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonloading, setButtonLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>();
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getVendor = (id: string | undefined | null) => {
    if (id !== undefined) {
      getVendorDetails(id)
        .then((res: any) => {
          if (res.success) {
            setFormData(res.data);
          }
        })
        .catch((error) => {
          console.log("error getVendor", error);
          errorHandle(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const getState = async () => {
      try {
        const stateData = await viewAllState();
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
      }
    };

    getState();
  }, []);

  useEffect(() => {
    const getCities = async (stateId?: string) => {
      try {
        setCities([]);
        if (validation) {
          validation.setFieldValue("city", "");
        }

        if (!stateId) {
          return;
        }

        const params = { state_id: stateId };
        const cityData = await viewAllCity(params);

        if (cityData?.data?.item && Array.isArray(cityData.data.item)) {
          const cityOptions = cityData.data.item.map(
            (city: { city_name: string; _id: string; state_id: string }) => ({
              label: city.city_name,
              value: city._id,
              state_id: city.state_id,
            })
          );
          setCities(cityOptions);
        } else {
          setCities([]);
        }
      } catch (error) {
        errorHandle(error);
        setCities([]);
      }
    };

    getCities(selectedStateId);
  }, [selectedStateId]);

  useEffect(() => {
    getVendor(id);
  }, [id]);

  useEffect(() => {
    if (formData?.state) {
      const stateOption = states.find(
        (state) => state.label === formData.state
      );
      if (stateOption) {
        setSelectedStateId(stateOption.value);
      }
    }
  }, [formData, states]);

  const initialValues: any = formData;

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      phoneNumber: initialValues?.phone?.phoneNumber || "",
      email: initialValues?.email || "",
      company_name: initialValues?.company_name || "",
      company_email: initialValues?.company_email || "",
      company_phone_number: initialValues?.company_phone_number || "",
      company_location: initialValues?.company_location || "",
      hire_resources: initialValues?.hire_resources || "",
      company_type: initialValues?.company_type || "",
      company_strength: initialValues?.company_strength || "",
      company_linkedin_profile: initialValues?.company_linkedin_profile || "",
      company_website: initialValues?.company_website || "",
      whatsapp_number: initialValues?.whatsapp_number || "",
      vendor_linkedin_profile: initialValues?.vendor_linkedin_profile || "",
      state: initialValues?.state || "",
      city: initialValues?.city || "",
    },
    validationSchema: vendorQrSchema,

    onSubmit: async (value: any) => {
      setButtonLoading(true);
      try {
        const formData: any = {
          firstName: value.firstName,
          lastName: value.lastName,
          phone: value.phoneNumber,
          whatsapp_number: value.whatsapp_number,
          email: value.email,
        };

        // Only include company fields if not an independent consultant
        if (value.isIndependentConsultant === "no") {
          formData.company_name = value.company_name;
          formData.company_email = value.company_email;
          formData.company_phone_number = value.company_phone_number;
          formData.company_location = value.company_location;

          if (value.hire_resources) {
            formData.hire_resources = value.hire_resources;
          }
          if (value.company_type) {
            formData.company_type = value.company_type;
          }
          if (value.company_strength) {
            formData.company_strength = value.company_strength;
          }
          if (value.company_linkedin_profile) {
            formData.company_linkedin_profile = value.company_linkedin_profile;
          }
          if (value.company_website) {
            formData.company_website = value.company_website;
          }
          if (value.state) {
            formData.state = value.state;
          }
          if (value.city) {
            formData.city = value.city;
          }
        }

        if (value.vendor_linkedin_profile) {
          formData.vendor_linkedin_profile = value.vendor_linkedin_profile;
        }

        let response;
        if (!id) {
          response = await createVendorQR(formData);
        } else {
          response = await updateVendorQR(formData, id);
        }

        if (response?.success === SUCCESS && response?.statusCode === 201) {
          toastify(response?.message, { type: "success" });
          navigate("/vendor/qr-code-success");
        } else {
          toastify(response?.message, { type: "error" });
          setButtonLoading(false);
        }
      } catch (error: any) {
        setButtonLoading(false);
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Unexpected error.";
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage: string) => {
            toastify(errorMessage, { type: "error" });
          });
        } else {
          toastify(message || "An error occurred while updating the vendor.", {
            type: "error",
          });
        }
      } finally {
        setButtonLoading(false);
      }
    },
  });

  const handleStateChange = (selectedOption: SelectedOption | null) => {
    if (!selectedOption) {
      validation.setFieldValue("state", "");
      validation.setFieldValue("city", "");
      setSelectedStateId("");
      return;
    }

    const selectedLabel = selectedOption?.label || "";
    const selectedValue = selectedOption?.value || "";

    // Reset city first
    validation.setFieldValue("city", "");

    // Set state value
    validation.setFieldValue("state", selectedLabel);

    setSelectedStateId(selectedValue);
  };

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card title="Vendor Profile">
          <Row>
            <div>
              <form
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
                  <Row className="mb-2 g-3">
                    <Col xs={12} sm={6} md={6} lg={3}>
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

                    <Col xs={12} sm={6} md={6} lg={3}>
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

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Email"
                        name="email"
                        type="email"
                        className="select-border"
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

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Phone Number"
                        name="phoneNumber"
                        type="text"
                        className="select-border"
                        placeholder={InputPlaceHolder("Phone Number")}
                        handleChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const sanitizedValue = rawValue.slice(0, 10);
                          validation.setFieldValue(
                            "phoneNumber",
                            sanitizedValue
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.phoneNumber}
                        touched={validation.touched.phoneNumber}
                        error={validation.errors.phoneNumber}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="WhatsApp Number"
                        name="whatsapp_number"
                        type="text"
                        className="select-border"
                        placeholder={InputPlaceHolder("WhatsApp Number")}
                        handleChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const sanitizedValue = rawValue.slice(0, 10);
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

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <BaseInput
                        label="Vendor LinkedIn Profile (Optional)"
                        name="vendor_linkedin_profile"
                        type="url"
                        placeholder={InputPlaceHolder("Vendor LinkedIn")}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.vendor_linkedin_profile}
                        touched={validation.touched.vendor_linkedin_profile}
                        error={validation.errors.vendor_linkedin_profile}
                        passwordToggle={false}
                      />
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="mb-3">
                        <label className="form-label">
                          Is Independent Consultant?{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-4 mt-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isIndependentConsultant"
                              id="independentConsultantYes"
                              value="yes"
                              checked={
                                validation.values.isIndependentConsultant ===
                                "yes"
                              }
                              onChange={(e) => {
                                validation.setFieldValue(
                                  "isIndependentConsultant",
                                  e.target.value
                                );
                                // Clear company fields when selecting yes
                                if (e.target.value === "yes") {
                                  validation.setFieldValue("company_name", "");
                                  validation.setFieldValue("company_email", "");
                                  validation.setFieldValue(
                                    "company_phone_number",
                                    ""
                                  );
                                  validation.setFieldValue(
                                    "company_location",
                                    ""
                                  );
                                  validation.setFieldValue(
                                    "hire_resources",
                                    ""
                                  );
                                  validation.setFieldValue("company_type", "");
                                  validation.setFieldValue(
                                    "company_strength",
                                    ""
                                  );
                                  validation.setFieldValue(
                                    "company_website",
                                    ""
                                  );
                                  validation.setFieldValue(
                                    "company_linkedin_profile",
                                    ""
                                  );
                                  validation.setFieldValue("state", "");
                                  validation.setFieldValue("city", "");
                                  setSelectedStateId("");
                                }
                              }}
                              onBlur={validation.handleBlur}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="independentConsultantYes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isIndependentConsultant"
                              id="independentConsultantNo"
                              value="no"
                              checked={
                                validation.values.isIndependentConsultant ===
                                "no"
                              }
                              onChange={(e) => {
                                validation.setFieldValue(
                                  "isIndependentConsultant",
                                  e.target.value
                                );
                              }}
                              onBlur={validation.handleBlur}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="independentConsultantNo"
                            >
                              No
                            </label>
                          </div>
                        </div>
                        {validation.touched.isIndependentConsultant &&
                          validation.errors.isIndependentConsultant && (
                            <div className="text-danger small mt-1">
                              {validation.errors.isIndependentConsultant}
                            </div>
                          )}
                      </div>
                    </Col>

                    {validation.values.isIndependentConsultant === "no" && (
                      <>
                        <Col xs={12}>
                          <div className="mb-3 mt-4">
                            <h5 className="mb-3 fw-bold border-bottom pb-2">
                              Company Details
                            </h5>
                          </div>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Name"
                            name="company_name"
                            type="text"
                            className="select-border"
                            placeholder={InputPlaceHolder("Company Name")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_name}
                            touched={validation.touched.company_name}
                            error={validation.errors.company_name}
                            passwordToggle={false}
                            isRequired={false}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Email"
                            name="company_email"
                            type="email"
                            className="select-border"
                            placeholder={InputPlaceHolder("Company Email")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_email}
                            touched={validation.touched.company_email}
                            error={validation.errors.company_email}
                            passwordToggle={false}
                            isRequired={false}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Phone Number"
                            name="company_phone_number"
                            type="text"
                            className="select-border"
                            placeholder={InputPlaceHolder(
                              "Company Phone Number"
                            )}
                            handleChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              const sanitizedValue = rawValue.slice(0, 10);
                              validation.setFieldValue(
                                "company_phone_number",
                                sanitizedValue
                              );
                            }}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_phone_number}
                            touched={validation.touched.company_phone_number}
                            error={validation.errors.company_phone_number}
                            passwordToggle={false}
                            isRequired={false}
                          />
                        </Col>
                      </>
                    )}

                    {validation.values.isIndependentConsultant === "no" && (
                      <>
                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Location"
                            name="company_location"
                            type="text"
                            className="select-border"
                            placeholder={InputPlaceHolder("Company Location")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_location}
                            touched={validation.touched.company_location}
                            error={validation.errors.company_location}
                            passwordToggle={false}
                            isRequired={false}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseSelect
                            label="Company Type"
                            name="company_type"
                            className="select-border"
                            options={companyType}
                            placeholder={InputPlaceHolder("Company Type")}
                            handleChange={(selectedOption: SelectedOption) => {
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
                            touched={validation.touched.company_type}
                            error={validation.errors.company_type}
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

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Strength"
                            name="company_strength"
                            type="text"
                            placeholder={InputPlaceHolder("Company Strength")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_strength}
                            touched={validation.touched.company_strength}
                            error={validation.errors.company_strength}
                            passwordToggle={false}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseSelect
                            label="Hire Resources"
                            name="hire_resources"
                            className="select-border"
                            options={hireResourceOptions}
                            placeholder={InputPlaceHolder("Hire Resources")}
                            handleChange={(selectedOption: SelectedOption) => {
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
                            touched={validation.touched.hire_resources}
                            error={validation.errors.hire_resources}
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

                        <Col xs={12} md={6} lg={3}>
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

                        <Col xs={12} md={6} lg={3}>
                          <BaseSelect
                            key={`city-${selectedStateId}-${cities.length}`}
                            label="City"
                            name="city"
                            className="select-border"
                            options={cities}
                            placeholder={
                              selectedStateId
                                ? InputPlaceHolder("City")
                                : "Please select a state first"
                            }
                            handleChange={(selectedOption: SelectedOption) => {
                              validation.setFieldValue(
                                "city",
                                selectedOption?.label || ""
                              );
                            }}
                            handleBlur={validation.handleBlur}
                            value={
                              dynamicFind(
                                cities,
                                validation.values.city,
                                "location"
                              ) || ""
                            }
                            touched={validation.touched.city}
                            error={validation.errors.city}
                            isRequired={false}
                            isDisabled={!selectedStateId}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company Website (Optional)"
                            name="company_website"
                            type="url"
                            placeholder={InputPlaceHolder("Company Website")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_website}
                            touched={validation.touched.company_website}
                            error={validation.errors.company_website}
                            passwordToggle={false}
                          />
                        </Col>

                        <Col xs={12} sm={6} md={6} lg={3}>
                          <BaseInput
                            label="Company LinkedIn Profile (Optional)"
                            name="company_linkedin_profile"
                            type="url"
                            placeholder={InputPlaceHolder("Company LinkedIn")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.company_linkedin_profile}
                            touched={
                              validation.touched.company_linkedin_profile
                            }
                            error={validation.errors.company_linkedin_profile}
                            passwordToggle={false}
                          />
                        </Col>
                      </>
                    )}

                    <Col xs={12}>
                      <div className="d-flex justify-content-end mt-4">
                        <BaseButton
                          color="primary"
                          type="submit"
                          className="d-flex align-items-center justify-content-center"
                        >
                          {buttonloading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              {!id ? "Submitting..." : "Updating..."}
                            </>
                          ) : (
                            <>{!id ? "Submit" : "Update"}</>
                          )}
                        </BaseButton>
                      </div>
                    </Col>
                  </Row>
                )}
              </form>
            </div>
          </Row>
        </Card>
      </Container>
    </Fragment>
  );
};

export default VendorQrForm;
