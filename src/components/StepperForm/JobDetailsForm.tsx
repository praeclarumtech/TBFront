import React, { useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { jobDetailsSchema } from "../../validation/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Form } from "react-bootstrap";
import { Select, MenuItem, FormControl, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setJobDetails } from "../../store/slices/jobDetailsSlice";
import { RootState } from "../../store/store";

interface JobDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialValues: {
    expectedPkg: string;
    currentPkg: string;
    negotiation: string;
    noticePeriod: string;
    readyForWork: string;
    workPreference: string;
    aboutUs: string;
  };
  showNext?: boolean;
}

interface FormFields {
  expectedPkg: string;
  currentPkg: string;
  negotiation: string;
  noticePeriod: string;
  readyForWork: string;
  workPreference: string;
  aboutUs: string;
}

const workStatusOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const workPreferenceOptions = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  onNext,
  onBack,
  initialValues,
  showNext,
}) => {
  const dispatch = useDispatch();
  const jobDetails = useSelector((state: RootState) => state.jobDetails);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormFields>({
    resolver: yupResolver(jobDetailsSchema) as unknown as Resolver<FormFields>,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues || jobDetails) {
      const mergedValues = {
        expectedPkg: jobDetails?.expectedPkg || initialValues.expectedPkg || "",
        currentPkg: jobDetails?.currentPkg || initialValues.currentPkg || "",
        negotiation: jobDetails?.negotiation || initialValues.negotiation || "",
        noticePeriod:
          jobDetails?.noticePeriod || initialValues.noticePeriod || "",
        readyForWork:
          jobDetails?.readyForWork || initialValues.readyForWork || "",
        workPreference:
          jobDetails?.workPreference || initialValues.workPreference || "",
        aboutUs: jobDetails?.aboutUs || initialValues.aboutUs || "",
      };
      reset(mergedValues);
    }
  }, [jobDetails, initialValues, reset]);

  const handleFieldChange = (field: keyof typeof jobDetails, value: any) => {
    setValue(field, value);
    dispatch(setJobDetails({ ...jobDetails, [field]: value }));
  };

  const onSubmit = (data: typeof jobDetails) => {
    dispatch(setJobDetails(data));
    onNext(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="mb-4">
        <Col xs={12} sm={6} className="mb-3 mb-sm-0">
          <Form.Group controlId="expectedPkg" className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Expected Package (LPA)
            </Form.Label>
            <Controller
              name="expectedPkg"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Form.Control
                  type="text"
                  {...rest}
                  value={value || ""}
                  isInvalid={!!errors.expectedPkg}
                  placeholder="Enter expected package"
                  className="rounded-lg py-2"
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange("expectedPkg", e.target.value);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="d-block mt-1">
              {errors.expectedPkg?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6}>
          <Form.Group controlId="currentPkg" className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Current Package (LPA)
            </Form.Label>
            <Controller
              name="currentPkg"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Form.Control
                  type="text"
                  {...rest}
                  value={value || ""}
                  isInvalid={!!errors.currentPkg}
                  placeholder="Enter current package"
                  className="rounded-lg py-2"
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange("currentPkg", e.target.value);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="d-block mt-1">
              {errors.currentPkg?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} sm={6} className="mb-3 mb-sm-0">
          <Form.Group controlId="negotiation" className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Negotiation (₹)
            </Form.Label>
            <Controller
              name="negotiation"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Form.Control
                  type="number"
                  {...rest}
                  value={value || ""}
                  isInvalid={!!errors.negotiation}
                  placeholder="Enter negotiation amount"
                  className="rounded-lg py-2"
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange("negotiation", e.target.value);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="d-block mt-1">
              {errors.negotiation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6}>
          <Form.Group controlId="noticePeriod" className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Notice Period (Days)
            </Form.Label>
            <Controller
              name="noticePeriod"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Form.Control
                  type="number"
                  {...rest}
                  value={value || ""}
                  isInvalid={!!errors.noticePeriod}
                  placeholder="Enter notice period"
                  className="rounded-lg py-2"
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange("noticePeriod", e.target.value);
                  }}
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="d-block mt-1">
              {errors.noticePeriod?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} sm={6} className="mb-3 mb-sm-0">
          <Form.Group className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Work Availability
            </Form.Label>
            <FormControl fullWidth>
              <Controller
                name="readyForWork"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    {...rest}
                    value={value || ""}
                    displayEmpty
                    className="rounded-lg bg-white"
                    sx={{
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        borderRadius: "8px",
                      },
                    }}
                    onChange={(e) => {
                      onChange(e.target.value);
                      handleFieldChange("readyForWork", e.target.value);
                    }}
                  >
                    <MenuItem disabled value="">
                      <span className="text-muted">Select availability</span>
                    </MenuItem>
                    {workStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.readyForWork && (
              <div className="text-danger mt-1 text-sm">
                {errors.readyForWork.message}
              </div>
            )}
          </Form.Group>
        </Col>

        <Col xs={12} sm={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              Work Preference
            </Form.Label>
            <FormControl fullWidth>
              <Controller
                name="workPreference"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    {...rest}
                    value={value || ""}
                    displayEmpty
                    className="rounded-lg bg-white"
                    sx={{
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        borderRadius: "8px",
                      },
                    }}
                    onChange={(e) => {
                      onChange(e.target.value);
                      handleFieldChange("workPreference", e.target.value);
                    }}
                  >
                    <MenuItem disabled value="">
                      <span className="text-muted">Select preference</span>
                    </MenuItem>
                    {workPreferenceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.workPreference && (
              <div className="text-danger mt-1 text-sm">
                {errors.workPreference.message}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
          <Form.Group controlId="aboutUs" className="mb-3">
            <Form.Label className="font-bold text-sm mb-2 d-block">
              About Us
            </Form.Label>
            <Controller
              name="aboutUs"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextField
                  {...rest}
                  value={value || ""}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  placeholder="Describe your experience and expectations"
                  error={!!errors.aboutUs}
                  helperText={errors.aboutUs?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#ced4da",
                      },
                    },
                  }}
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleFieldChange("aboutUs", e.target.value);
                  }}
                />
              )}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button
          variant="contained"
          color="error"
          onClick={onBack}
          sx={{ px: 4, py: 1, textTransform: "none" }}
        >
          Previous
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1, textTransform: "none" }}
        >
          {showNext ? "Next" : "Next"}
        </Button>
      </div>
    </Form>
  );
};

export default JobDetailsForm;
