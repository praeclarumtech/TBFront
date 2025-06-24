/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Card, CardBody } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import BaseInput from "components/BaseComponents/BaseInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import { TimePicker } from "antd";
import dayjs from "dayjs";
// import BaseTextarea from "components/BaseComponents/BaseTextArea";
import { Skeleton } from "antd";
import { City, SelectedOption } from "interfaces/applicant.interface";
import { createJob, updateJob, viewJobById } from "api/apiJob";
import { toast } from "react-toastify";
import { FormFeedback, Label } from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { ViewAppliedSkills } from "api/skillsApi";
import { viewAllCity } from "api/cityApis";

const { projectTitle, Modules, jobTypeOpyions, timeZoneOptions } = appConstants;
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const JobForm = () => {
  document.title = Modules.Jobs + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const { id: _id } = useParams();

  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";
  const navigate = useNavigate();

  const formTitle = isEditMode ? "Update" : "Create";
  const submitButtonText = isEditMode ? "Update" : "Add";
  const [selectedMulti, setSelectedMulti] = useState<any[]>([]);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchSkills = async () => {
      try {
        const page = 1;
        const pageSize = 50;
        const limit = 1000;
        const response = await ViewAppliedSkills({ page, pageSize, limit });
        const skillData = response?.data.data || [];

        setSkillOptions(
          skillData.map((item: any) => ({
            label: item.skills,
            value: item._id,
          }))
        );
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (_id) {
      setLoading(true);
      viewJobById({ _id })
        .then((res: any) => {
          if (res.success && res.data) {
            const job = res.data;
            validation.setValues({
              job_subject: job.job_subject || "",
              job_details: job.job_details || "",
              job_type: job.job_type || "",
              time_zone: job.time_zone || "",
              start_time: job.start_time
                ? dayjs(job.start_time, ["hh:mm A", "HH:mm"]).format("hh:mm A")
                : "",
              end_time: job.end_time
                ? dayjs(job.end_time, ["hh:mm A", "HH:mm"]).format("hh:mm A")
                : "",
              min_salary: job.min_salary || "",
              max_salary: job.max_salary || "",
              contract_duration: job.contract_duration || "",
              required_skills: job.required_skills || [],
              job_location: job.job_location || "",
            });
            console.log(validation.value);
          }
        })
        .catch((err) => {
          console.error("Error fetching job:", err);
          toast.error("Failed to load job details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [_id]);
  useEffect(() => {
    const getCities = async () => {
      try {
        setLoading(true);

        const cityData = await viewAllCity();
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

    getCities();
  }, []);

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCancle = () => {
    validation.resetForm();
    navigate("/job-listing");
  };

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      job_subject: "",
      job_details: "",
      job_type: "",
      time_zone: "",
      start_time: "",
      end_time: "",
      min_salary: "",
      max_salary: "",
      contract_duration: "",
      required_skills: "",
      job_location: "",
    },
    validationSchema: Yup.object({
      job_subject: Yup.string()

        .min(1, "Subject must be at least 1.")
        .required("Subject is required"),
      contract_duration: Yup.string().when(
        "job_type",
        (jobType: unknown, schema) => {
          if (typeof jobType === "string" && jobType !== "contract") {
            return schema.required("Contract duration is required");
          }
          return schema.notRequired();
        }
      ),

      job_details: Yup.string()
        .min(1, "Job Details Name must be at least 1.")
        .required("Job Details is required"),
      job_type: Yup.string().required("Job Type is required"),
      time_zone: Yup.string().required("Select Time Zone"),
      required_skills: Yup.array()
        .of(Yup.string())
        .min(1, "Please select at least one skill"),
      // min_salary: Yup.string().required("Please Enter minimum Salary"),
      // max_salary: Yup.string().required("Please Enter maximum Salary"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        job_subject: values.job_subject,
        job_details: values.job_details,
        job_type: values.job_type,
        time_zone: values.time_zone,
        start_time: values.start_time,
        end_time: values.end_time,
        min_salary: values.min_salary,
        max_salary: values.max_salary,
        contract_duration: values.contract_duration,
        required_skills: values.required_skills,
        job_location: values.job_location,
      };
      const apiCall = _id ? updateJob(_id, payload) : createJob(payload);

      apiCall
        .then((res: any) => {
          if (res?.success) {
            toast.success(res?.message || `Data Added successfully`);
            // Reset editing state
            validation.resetForm();
            navigate("/job-listing"); // Clear form data after submission
          }
          if (res?.success === "false") {
            const errorMsg =
              res.details?.length > 0
                ? res.details.join(", ")
                : res.message || "Failed to add job";

            toast.error(errorMsg);
          }
        })
        .catch((error) => {
          console.error("Error adding job:", error);
          const errorMessages = error?.response?.data?.details;
          if (errorMessages && Array.isArray(errorMessages)) {
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage);
            });
          } else {
            toast.error("An error occurred while updating the applicant.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    if (
      Array.isArray(validation.values.required_skills) &&
      validation.values.required_skills.length > 0 &&
      skillOptions.length > 0
    ) {
      const matched = skillOptions.filter((option: any) =>
        validation.values.required_skills.includes(option.label)
      );
      setSelectedMulti(matched);
    }
  }, [validation.values.required_skills, skillOptions, _id]);

  const handleMultiSkill = (selectedMulti: any) => {
    const ids = selectedMulti?.map((item: any) => item.label) || [];
    validation.setFieldValue("required_skills", ids);
    setSelectedMulti(selectedMulti);
  };
  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card className="my-3 mb-3">
          <CardBody>
            <Row>
              <Row>
                <h4 className="pt-2 pl-2 fw-bold">
                  {" "}
                  {formTitle} Job Requirement
                </h4>
              </Row>
              <div>
                {loading ? (
                  <div className="my-5 d-flex justify-content-center">
                    <Skeleton active />
                  </div>
                ) : (
                  <Row className="mt-4 mb-4 g-3">
                    <Col xs={12} md={12}>
                      <BaseInput
                        label="Job Title"
                        name="job_subject"
                        type="text"
                        placeholder={"e.g. React Developer"}
                        handleChange={(e) => {
                          validation.setFieldValue(
                            "job_subject",
                            e.target.value
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.job_subject}
                        touched={validation.touched.job_subject}
                        error={validation.errors.job_subject}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} md={4}>
                      <BaseSelect
                        label="Job Type"
                        name="job_type"
                        className="select-border"
                        options={jobTypeOpyions}
                        placeholder={"Select Type"}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "job_type",
                            selectedOption?.value || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            jobTypeOpyions,
                            validation.values.job_type
                          ) || ""
                        }
                        isRequired={true}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
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
                    <Col xs={12} md={6} lg={4}>
                      <BaseInput
                        label="Contract Duration"
                        name="contract_duration"
                        disabled={validation.values.job_type === "contract"}
                        type="text"
                        placeholder={"e.g. 6 Months"}
                        handleChange={(e) => {
                          const value = e.target.value;
                          validation.setFieldValue("contract_duration", value);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.contract_duration}
                        touched={validation.touched.contract_duration}
                        error={validation.errors.contract_duration}
                        passwordToggle={false}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4} className="mb-3">
                      <MultiSelect
                        label="Required Skills"
                        name="required_skills"
                        className="select-border"
                        value={selectedMulti || []}
                        isMulti={true}
                        onChange={handleMultiSkill}
                        options={skillOptions}
                        touched={validation.touched.required_skills}
                        error={validation.errors.required_skills}
                        handleBlur={validation.handleBlur}
                        isRequired={true}
                      />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                      <BaseInput
                        label="Min Salary"
                        name="min_salary"
                        type="text"
                        placeholder={InputPlaceHolder("Minimum Salary")}
                        handleChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          validation.setFieldValue("min_salary", value);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.min_salary}
                        touched={validation.touched.min_salary}
                        error={validation.errors.min_salary}
                        passwordToggle={false}
                        isRequired={false}
                      />
                    </Col>

                    <Col xs={12} md={8} lg={4}>
                      <BaseInput
                        label="Max Salary"
                        name="max_salary"
                        type="text"
                        placeholder={InputPlaceHolder("Maximum Salary")}
                        handleChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          validation.setFieldValue("max_salary", value);
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.max_salary}
                        touched={validation.touched.max_salary}
                        error={validation.errors.max_salary}
                        passwordToggle={false}
                        isRequired={false}
                      />
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <BaseSelect
                        label="Time Zone"
                        name="time_zone"
                        className="select-border"
                        options={timeZoneOptions}
                        placeholder={"IST, UTC, ETC..."}
                        isRequired={true}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "time_zone",
                            selectedOption?.value || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            timeZoneOptions,
                            validation.values.time_zone
                          ) || ""
                        }
                        touched={validation.touched.time_zone}
                        error={validation.errors.time_zone}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
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
                    <Col xs={12} md={6} lg={4}>
                      <BaseSelect
                        label="Job Location"
                        name="job_location"
                        className="select-border"
                        options={cities}
                        placeholder={InputPlaceHolder("Job Location")}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "job_location",
                            selectedOption?.label || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            cities,
                            validation.values.job_location,
                            "location"
                          ) || ""
                        }
                        touched={validation.touched.job_location}
                        error={validation.errors.job_location}
                        isRequired={false}
                      />
                    </Col>
                    <Col xs={12} md={8} lg={4}>
                      <Label className="font-semibold text-gray-700 form-label">
                        Start Time
                        {<span className="text-red-500">*</span>}
                      </Label>
                      <TimePicker
                        name="start_time"
                        format="hh:mm A"
                        placeholder="e.g. 10:00 AM"
                        changeOnScroll
                        needConfirm={false}
                        use12Hours
                        className="w-100 h-[40px] form-control custom-placeholder"
                        value={
                          validation.values.start_time
                            ? dayjs(validation.values.start_time, "hh:mm A")
                            : null
                        }
                        onChange={(time) => {
                          const formattedTime = time
                            ? time.format("hh:mm A")
                            : "";
                          validation.setFieldValue("start_time", formattedTime);
                        }}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.start_time &&
                        validation.errors.start_time && (
                          <FormFeedback className="d-block">
                            {validation.errors.start_time}
                          </FormFeedback>
                        )}
                    </Col>
                    <Col xs={12} md={8} lg={4}>
                      <Label
                        // htmlFor={name}
                        className="font-semibold text-gray-700 form-label"
                      >
                        End Time
                        {<span className="text-red-500">*</span>}
                      </Label>
                      <TimePicker
                        name="end_time"
                        format="hh:mm A"
                        use12Hours
                        changeOnScroll
                        needConfirm={false}
                        className="w-100 h-[40px] form-control"
                        value={
                          validation.values.end_time
                            ? dayjs(validation.values.end_time, "hh:mm A")
                            : null
                        }
                        onChange={(time) => {
                          const formattedTime = time
                            ? time.format("hh:mm A")
                            : "";
                          validation.setFieldValue("end_time", formattedTime);
                        }}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.end_time &&
                        validation.errors.end_time && (
                          <FormFeedback className="d-block">
                            {validation.errors.end_time}
                          </FormFeedback>
                        )}
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                      <Label className="font-semibold text-gray-700 form-label">
                        Job Details
                        {<span className="text-red-500">*</span>}
                      </Label>
                      <ReactQuill
                        placeholder="Brief job details here"
                        theme="snow"
                        value={validation.values.job_details}
                        onChange={(content) =>
                          validation.setFieldValue("job_details", content)
                        }
                        onBlur={() =>
                          validation.setFieldTouched("job_details", true, true)
                        }
                        modules={quillModules}
                        className="bg-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[300px]"
                        style={{ minHeight: "250px" }}
                      />
                      {validation.touched.job_details &&
                        validation.errors.job_details && (
                          <FormFeedback className="d-block">
                            {validation.errors.job_details}
                          </FormFeedback>
                        )}
                    </Col>
                  </Row>
                )}
                <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-end">
                  <BaseButton
                    color="secondary"
                    className="order-0 order-md-1"
                    type="button"
                    onClick={handleCancle}
                  >
                    Cancle
                  </BaseButton>
                  <BaseButton
                    color="primary"
                    className="order-0 order-md-1"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {submitButtonText}
                  </BaseButton>
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </Fragment>
  );
};

export default JobForm;
