import { useForm, Controller, Resolver } from "react-hook-form";
import { Button } from "@mui/material";
import { educationalDetailsSchema } from "../../validation/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Form } from "react-bootstrap";
import {
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
import { RootState } from "../../store/store";

interface EducationalDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialValues: any;
  showNext?: boolean;
  editingApplicant?: any;
}

const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
const passingYearOptions = ["2021", "2022", "2023", "2024"];
const appliedSkillsOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
];

interface FormFields {
  qualification: string;
  degree: string;
  passingYear: string;
  appliedSkills: string[];
  otherSkills: string;
  totalExperience: number;
  relevantSkillExperience: number;
  referral: string;
  url: string;
  rating: number;
}

const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
  onNext,
  onBack,
  initialValues,
  showNext,
  editingApplicant,
}) => {
  const dispatch = useDispatch();
  const educationalDetails = useSelector(
    (state: RootState) => state.educationalDetails
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: yupResolver(educationalDetailsSchema) as Resolver<FormFields>,
    defaultValues: {
      qualification:
        initialValues?.qualification || educationalDetails?.qualification || "",
      degree: initialValues?.degree || educationalDetails?.degree || "",
      passingYear:
        initialValues?.passingYear || educationalDetails?.passingYear || "",
      appliedSkills:
        initialValues?.appliedSkills || educationalDetails?.appliedSkills || [],
      otherSkills:
        initialValues?.otherSkills || educationalDetails?.otherSkills || "",
      totalExperience:
        initialValues?.totalExperience ||
        educationalDetails?.totalExperience ||
        0,
      relevantSkillExperience:
        initialValues?.relevantSkillExperience ||
        educationalDetails?.relevantSkillExperience ||
        0,
      referral: initialValues?.referral || educationalDetails?.referral || "",
      url: initialValues?.url || educationalDetails?.url || "",
      rating: initialValues?.rating || educationalDetails?.rating || 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
  }, [watch, educationalDetails]);

  useEffect(() => {
  }, [editingApplicant]);

  useEffect(() => {
    const subscription = watch((value) => {
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFieldChange = (
    field: keyof typeof educationalDetails,
    value: any
  ) => {
    setValue(field, value, { shouldValidate: true });
    dispatch(
      setEducationalDetails({
        ...educationalDetails,
        [field]: value,
      })
    );
  };
  const onSubmit = (data: FormFields) => {
    dispatch(setEducationalDetails(data));
    onNext(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="g-3 mb-4">
        {/* Qualification & Degree */}
        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Qualification</Form.Label>
            <Controller
              name="qualification"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="h-10"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleFieldChange("qualification", e.target.value)
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Qualification
                  </MenuItem>
                  {qualificationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group controlId="degree" className="mb-3">
            <Form.Label className="fw-medium">Degree Name</Form.Label>
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.degree}
                  placeholder="Enter degree name"
                  {...field}
                  onChange={(e) => handleFieldChange("degree", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.degree?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Passing Year & Skills */}
        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Passing Year</Form.Label>
            <Controller
              name="passingYear"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="h-10"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleFieldChange("passingYear", e.target.value)
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Passing Year
                  </MenuItem>
                  {passingYearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>

        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Applied Skills</Form.Label>
            <Controller
              name="appliedSkills"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  className="h-10"
                  value={field.value || []}
                  onChange={(e) =>
                    handleFieldChange("appliedSkills", e.target.value)
                  }
                  displayEmpty
                  renderValue={(selected) =>
                    (selected as string[]).length > 0
                      ? (selected as string[]).join(", ")
                      : "Select Relevant Skills"
                  }
                >
                  {appliedSkillsOptions.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      <Checkbox checked={(field.value || []).includes(skill)} />
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Experience Fields */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="totalExperience" className="mb-3">
            <Form.Label className="fw-medium">Total Experience</Form.Label>
            <Controller
              name="totalExperience"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  isInvalid={!!errors.totalExperience}
                  placeholder="Years of total experience"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("totalExperience", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="relevantSkillExperience" className="mb-3">
            <Form.Label className="fw-medium">Relevant Experience</Form.Label>
            <Controller
              name="relevantSkillExperience"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  isInvalid={!!errors.relevantSkillExperience}
                  placeholder="Years of relevant experience"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("relevantSkillExperience", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.relevantSkillExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={6}>
          <Form.Group controlId="otherSkills" className="mb-3">
            <Form.Label className="fw-medium">Other Skills</Form.Label>
            <Controller
              name="otherSkills"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.otherSkills}
                  placeholder="Enter other skills (comma separated)"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("otherSkills", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.otherSkills?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Referral & Resume */}
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="referral" className="mb-3">
            <Form.Label className="fw-medium">Referral</Form.Label>
            <Controller
              name="referral"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.referral}
                  placeholder="Enter referral name"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("referral", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.referral?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="url" className="mb-3">
            <Form.Label className="fw-medium">Resume URL</Form.Label>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="url"
                  isInvalid={!!errors.url}
                  placeholder="Enter resume URL"
                  {...field}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="rating" className="mb-3">
            <Form.Label className="fw-medium">Skill Rating</Form.Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  min="1"
                  max="10"
                  isInvalid={!!errors.rating}
                  placeholder="Rate your skills (1-10)"
                  {...field}
                  onChange={(e) => handleFieldChange("rating", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.rating?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* {!showNext && ( */}
      <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
        <Button
          variant="contained"
          color="error"
          onClick={onBack}
          className="order-1 order-md-0"
        >
          Previous
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="order-0 order-md-1"
        >
          {showNext ? "Next" : "Next"}
        </Button>
      </div>
      {/* )} */}
    </Form>
  );
};

export default EducationalDetailsForm;
