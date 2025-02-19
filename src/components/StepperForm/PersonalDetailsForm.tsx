import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { personalDetailsSchema } from "../../validation/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Form } from "react-bootstrap";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalDetails } from "store/slices/personalDetailsSlice";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
interface Gender {
  label: string;
  value: string;
}
 
interface Country {
  label: string;
  value: string;
}
 
interface State {
  label: string;
  value: string;
}
 
interface DropdownData {
  countries: Country[];
  states: Record<string, State[]>;
  genders: Gender[];
}
 
interface PersonalDetailsFormProps {
  onNext: (data: any) => void;
  onCancel: () => void;
    initialValues: any;
  showNext: boolean;
}
 
const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  onNext,
  onCancel,
  initialValues,
  showNext,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const personalDetails = useSelector(
    (state: RootState) => state.personalDetails
  );
 
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(personalDetailsSchema),
    defaultValues: initialValues || personalDetails,
  });
 
  const countryValue = watch("country");
  const stateValue = watch("state");
  const genderValue = watch("gender");
 
  const mockData: DropdownData = {
    countries: [
      { label: "USA", value: "usa" },
      { label: "India", value: "india" },
      { label: "Canada", value: "canada" },
    ],
    states: {
      usa: [
        { label: "California", value: "california" },
        { label: "New York", value: "new-york" },
      ],
      india: [
        { label: "Delhi", value: "delhi" },
        { label: "Mumbai", value: "mumbai" },
      ],
      canada: [
        { label: "Ontario", value: "ontario" },
        { label: "Quebec", value: "quebec" },
      ],
    },
    genders: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  };
 
  useEffect(() => {
    reset(personalDetails || initialValues);
  }, [personalDetails, initialValues, reset]);
 
  const handleFieldChange = (
    field: keyof typeof personalDetails,
    value: string
  ) => {
    setValue(field, value);
    dispatch(setPersonalDetails({ [field]: value }));
  };
 
  const handleGenderChange = (event: any) => {
    const gender = event.target.value;
    setValue("gender", gender);
    dispatch(setPersonalDetails({ gender }));
  };
 
  const handleCountryChange = (event: any) => {
    const country = event.target.value;
    setValue("country", country);
    setValue("state", "");
    dispatch(setPersonalDetails({ country }));
  };
 
  const handleStateChange = (event: any) => {
    const state = event.target.value;
    setValue("state", state);
    dispatch(setPersonalDetails({ state }));
  };
 
  const onSubmit = (data: any) => {
    dispatch(setPersonalDetails(data));
    onNext(data);
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="mb-3 g-3">
        {/* First Name */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="firstName">
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
          </Form.Group>
        </Col>
 
        {/* Middle Name */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="middleName">
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
          </Form.Group>
        </Col>
 
        {/* Last Name */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="lastName">
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
          </Form.Group>
        </Col>
 
        {/* Date of Birth */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="dateOfBirth">
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
          </Form.Group>
        </Col>
  {/* Email */}
  <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="email">
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
          </Form.Group>
        </Col>
 
        {/* Phone Number */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="phoneNumber">
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
          </Form.Group>
        </Col>
 
        {/* WhatsApp Number */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="whatsappNumber">
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
          </Form.Group>
        </Col>
 
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="gender">
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
          </Form.Group>
        </Col>
        {/* Country */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="country">
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
          </Form.Group>
        </Col>
 
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="state">
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
          </Form.Group>
        </Col>
 
        {/* City */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="city">
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
          </Form.Group>
        </Col>
 
        {/* Pincode */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="pincode">
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
          </Form.Group>
        </Col>
 
        {/* Gender */}
 
        {/* Full Address */}
        <Col xs={12}>
          <Form.Group controlId="fullAddress">
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
          </Form.Group>
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
        <Link to ="/applicants" className="p-2 bg-red-600 outline-none rounded text-white">Cancel</Link>
 
        <Button variant="contained" color="primary" type="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};
 
export default PersonalDetailsForm;