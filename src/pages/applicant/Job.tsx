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
import { Form } from "react-router-dom";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import { listOfApplicants } from "api/applicantApi";
import BaseInput from "components/BaseComponents/BaseInput";

type SelectedOption = { label: string; value: string };

const JobDetailsForm = ({ onNext, onBack }: any) => {
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

  const workStatusType = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const workPreferenceType = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" },
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
              <Row className="mb-4">
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Expected Package (LPA)"
                    name="expectedPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Enter expected package")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.expectedPkg}
                    touched={validation.touched.expectedPkg}
                    error={validation.errors.expectedPkg}
                    passwordToggle={false}
                  />
                </Col>

                <Col xs={12} sm={4}>
                  <BaseInput
                    label="Current Package (LPA)"
                    name="currentPkg"
                    type="text"
                    placeholder={InputPlaceHolder("Enter current package")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.currentPkg}
                    touched={validation.touched.currentPkg}
                    error={validation.errors.currentPkg}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label=" Negotiation (₹)"
                    name="negotiation"
                    type="text"
                    placeholder={InputPlaceHolder("Enter negotiation amount")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.negotiation}
                    touched={validation.touched.negotiation}
                    error={validation.errors.negotiation}
                    passwordToggle={false}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12} sm={4}>
                  <BaseInput
                    label=" Notice Period (Days)"
                    name="noticePeriod"
                    type="text"
                    placeholder={InputPlaceHolder("Enter notice period")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.noticePeriod}
                    touched={validation.touched.noticePeriod}
                    error={validation.errors.noticePeriod}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseSelect
                    label="Ready For WFO..."
                    name="readyForWork"
                    className="select-border"
                    options={workStatusType}
                    placeholder={InputPlaceHolder("readyForWork")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "readyForWork",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        workStatusType,
                        validation.values.readyForWork
                      ) || ""
                    }
                    touched={validation.touched.readyForWork}
                    error={validation.errors.readyForWork}
                  />
                </Col>
                <Col xs={12} sm={4}>
                  <BaseSelect
                    label="Work Preference"
                    name="workPreference"
                    className="select-border"
                    options={workPreferenceType}
                    placeholder={InputPlaceHolder("workPreference")}
                    handleChange={(selectedOption: SelectedOption) => {
                      validation.setFieldValue(
                        "workPreference",
                        selectedOption?.value || ""
                      );
                    }}
                    handleBlur={validation.handleBlur}
                    value={
                      dynamicFind(
                        workPreferenceType,
                        validation.values.workPreference
                      ) || ""
                    }
                    touched={validation.touched.workPreference}
                    error={validation.errors.workPreference}
                  />

                  {/* <BaseSelect
              label="Work Preference"
              name="workPreference"
              className=""
              placeholder={InputPlaceHolder(" Work Preference")}
              value={validation.values.workPreference}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validation.errors.workPreference}
              options={workPreferenceOptions}
              isClearable
            /> */}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12} sm={6} className="mb-3 mb-sm-0"></Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="   Practical Url"
                    name="practicalUrl"
                    type="text"
                    placeholder={InputPlaceHolder("Enter Practical Url")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalUrl}
                    touched={validation.touched.practicalUrl}
                    error={validation.errors.practicalUrl}
                    passwordToggle={false}
                  />
                </Col>
                <Col xs={12} sm={8} className="mb-3 mb-sm-0">
                  <BaseInput
                    label="Practical Feedback"
                    name="practicalFeedback"
                    placeholder={InputPlaceHolder(
                      "Describe about Us Practical Task..."
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.practicalFeedback}
                    touched={validation.touched.practicalFeedback}
                    error={validation.errors.practicalFeedback}
                    passwordToggle={false}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12}>
                  <BaseInput
                    label="About Us"
                    name="aboutUs"
                    placeholder={InputPlaceHolder(
                      "Describe your experience and expectations"
                    )}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.aboutUs}
                    touched={validation.touched.aboutUs}
                    error={validation.errors.aboutUs}
                    passwordToggle={false}
                  />
                </Col>
              </Row>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <BaseButton
                  className="order-1 order-md-0"
                  type="submit"
                  onClick={onBack}
                >
                  Previous
                </BaseButton>
                <BaseButton
                  color="primary"
                  className="order-0 order-md-1"
                  type="submit"
                  onClick={onBack}
                >
                  Next
                </BaseButton>
              </div>
            </Form>
          </div>
        </Row>
        {/* <BreadCrumb title='applicant' pageTitle={projectTitle} /> */}
      </Container>
    </Fragment>
  );
};

export default JobDetailsForm;
