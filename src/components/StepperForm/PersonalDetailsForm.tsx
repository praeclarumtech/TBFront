import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { personalDetailsSchema } from "../../validation/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Form } from "react-bootstrap";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useDispatch } from "react-redux";
import { setPersonalDetails } from "store/slices/personalDetailsSlice";
import { SelectChangeEvent } from "@mui/material";

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
  showNext?: boolean;
}

interface FormFields {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  city?: string;
  pincode?: string;
  fullAddress?: string;
  gender?: string;
  country?: string;
  state?: string;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  onNext,
  onCancel,
  initialValues,
  showNext,
}) => {
  const dispatch = useDispatch();

  const methods = useForm<FormFields>({
    resolver: yupResolver(personalDetailsSchema),
    defaultValues: {
      firstName: initialValues?.name?.firstName || "",
      middleName: initialValues?.name?.middleName || "",
      lastName: initialValues?.name?.lastName || "",
      dateOfBirth: initialValues?.dateOfBirth
        ? new Date(initialValues.dateOfBirth)
        : undefined,
      phoneNumber: initialValues?.phone?.phoneNumber || "",
      whatsappNumber: initialValues?.phone?.whatsappNumber || "",
      gender: initialValues?.gender || "",
      email: initialValues?.email || "",
      country: initialValues?.country || "",
      state: initialValues?.state || "",
      city: initialValues?.city || "",
      pincode: initialValues?.pincode || "",
      fullAddress: initialValues?.fullAddress || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  useEffect(() => {
    if (initialValues) {
      
      setValue("firstName", initialValues?.firstName || "");
      setValue("middleName", initialValues?.middleName || "");
      setValue("lastName", initialValues?.lastName || "");
      setValue(
        "dateOfBirth",
        initialValues?.dateOfBirth
          ? new Date(initialValues.dateOfBirth)
          : undefined
      );
      setValue("phoneNumber", initialValues?.phoneNumber || "");
      setValue("whatsappNumber", initialValues?.whatsappNumber || "");
      setValue("gender", initialValues?.gender || "");
      setValue("email", initialValues?.email || "");
      setValue("country", initialValues?.country || "");
      setValue("state", initialValues?.state || "");
      setValue("city", initialValues?.city || "");
      setValue("pincode", initialValues?.pincode || "");
      setValue("fullAddress", initialValues?.fullAddress || "");
    }
  }, [initialValues, setValue]);

  const handleFieldChange = (
    field: keyof FormFields,
    value: string | Date | undefined
  ) => {
    setValue(field, value);
    const currentFormValues = watch();
    const formattedValues = {
      ...currentFormValues,
      [field]:
        field === "dateOfBirth" && value instanceof Date
          ? value.toISOString().split("T")[0]
          : value,
    };
    dispatch(setPersonalDetails(formattedValues));
  };
  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    handleFieldChange(
      "gender",
      event.target.value
    );
  };

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    handleFieldChange(
      "country",
      event.target.value
    );
    setValue("state", "");
    const currentFormValues = watch();
    dispatch(
      setPersonalDetails({
        ...currentFormValues,
        country: event.target.value,
        state: "",
      })
    );
  };
  const handleStateChange = (event: SelectChangeEvent<string>) => {
    handleFieldChange(
      "state",
      event.target.value
    );
  };

  const onSubmit = async (data: FormFields) => {
    try {
      const formattedData = {
        name: {
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
        },
        dateOfBirth: data.dateOfBirth,
        phone: {
          phoneNumber: data.phoneNumber || "",
          whatsappNumber: data.whatsappNumber || "",
        },
        gender: data.gender || "",
        email: data.email || "",
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        pincode: data.pincode || "",
        fullAddress: data.fullAddress || "",
      };

      dispatch(setPersonalDetails(formattedData));

      if (typeof onNext === "function") {
        await onNext(formattedData);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
        <Row className="mb-3 g-3">
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
                    isInvalid={!!errors.firstName}
                    placeholder="First Name"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    placeholder="Middle Name"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.middleName?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.lastName}
                    placeholder="Last Name"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.dateOfBirth}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : field.value || ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateOfBirth?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.email}
                    placeholder="Email"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.phoneNumber}
                    placeholder="Phone Number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.whatsappNumber}
                    placeholder="WhatsApp Number"
                    value={watch("whatsappNumber") || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.whatsappNumber?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Form.Group controlId="gender">
              <Form.Label className="fw-medium">Gender</Form.Label>
              <FormControl fullWidth>
                <Select
                  value={watch("gender") || ""}
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

          <Col xs={12} md={6} lg={3}>
            <Form.Group controlId="country">
              <Form.Label className="fw-medium">Country</Form.Label>
              <FormControl fullWidth>
                <Select
                  value={watch("country") || ""}
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
                  value={watch("state") || ""}
                  onChange={handleStateChange}
                  className="h-10"
                  disabled={!watch("country")}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {watch("country") ? "Select State" : "Select Country First"}
                  </MenuItem>
                  {mockData.states[
                    watch("country") as keyof typeof mockData.states
                  ]?.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Form.Group>
          </Col>

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
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.pincode}
                    placeholder="Enter Pincode"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.pincode?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

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
                    isInvalid={!!errors.fullAddress}
                    placeholder="Enter Full Address"
                    value={watch("fullAddress") || ""}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullAddress?.message?.toString()}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
            className="mb-2 mb-md-0"
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {showNext ? "Next" : "Save Changes"}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default PersonalDetailsForm;
