/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  EducationApplicantSchema,
  SelectedOption,
} from "interfaces/applicant.interface";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";

const { projectTitle, Modules, passingYearType, qualification } = appConstants;

const EducationalDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      qualification: initialValues?.qualification || "",
      specialization: initialValues?.specialization || "",
      passingYear: initialValues?.passingYear || "",
      cgpa: initialValues?.cgpa || "",
      collegeName: initialValues?.collegeName || "",
    },
    validationSchema: EducationApplicantSchema,
    onSubmit: (data) => {
      setLoading(true);
      onNext(data);
      setLoading(true);
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
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Row className="g-3 mb-4">
                  <Col xs={12} md={6}>
                    <BaseSelect
                      label="Qualification"
                      name="qualification"
                      className="select-border"
                      options={qualification}
                      placeholder={InputPlaceHolder("Qualification")}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "qualification",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          qualification,
                          validation.values.qualification
                        ) || ""
                      }
                      touched={validation.touched.qualification}
                      error={validation.errors.qualification}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={6}>
                    <BaseInput
                      label="Specialization"
                      name="specialization"
                      type="text"
                      placeholder={InputPlaceHolder("Specialization")}
                      handleChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        validation.setFieldValue("specialization", value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.specialization}
                      touched={validation.touched.specialization}
                      error={validation.errors.specialization}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Col>
                  <Col xs={12} md={4} lg={4}>
                    <BaseInput
                      label="College Name"
                      name="collegeName"
                      type="text"
                      placeholder={InputPlaceHolder("College Name")}
                      handleChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        validation.setFieldValue("collegeName", value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={validation.values.collegeName}
                      touched={validation.touched.collegeName}
                      error={validation.errors.collegeName}
                      passwordToggle={false}
                    />
                  </Col>

                  <Col xs={12} md={4} lg={4}>
                    <BaseSelect
                      label="Passing Year"
                      name="passingYear"
                      className="select-border"
                      options={passingYearType}
                      placeholder={
                        InputPlaceHolder("Passing Year") || "Passing Year"
                      }
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "passingYear",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(
                          passingYearType,
                          validation.values.passingYear
                        ) || ""
                      }
                      touched={validation.touched.passingYear}
                      error={validation.errors.passingYear}
                      isRequired={true}
                    />
                  </Col>

                  <Col xs={12} md={4} lg={4}>
                    <BaseInput
                      label="CGPA"
                      name="cgpa"
                      type="text"
                      placeholder={InputPlaceHolder("CGPA")}
                      handleChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9.]/g, "");

                        const parts = value.split(".");
                        if (parts.length > 2) {
                          value = parts[0] + "." + parts.slice(1).join("");
                        }

                        if (parts[1]?.length > 2) {
                          value = parts[0] + "." + parts[1].slice(0, 2);
                        }

                        const numValue = parseFloat(value);

                        if (
                          !isNaN(numValue) &&
                          numValue >= 1 &&
                          numValue <= 10
                        ) {
                          validation.setFieldValue("cgpa", value);
                        } else if (value === "" || value === ".") {
                          validation.setFieldValue("cgpa", value);
                        } else if (!value) {
                          validation.setFieldValue("cgpa", "");
                        }
                      }}
                      handleBlur={(e) => {
                        const value = e.target.value;

                        if (value && !isNaN(parseFloat(value))) {
                          const numValue = parseFloat(value);
                          if (numValue >= 1 && numValue <= 10) {
                            validation.setFieldValue(
                              "cgpa",
                              numValue.toFixed(2)
                            );
                          } else {
                            validation.setFieldValue("cgpa", "");
                          }
                        } else {
                          validation.setFieldValue("cgpa", "");
                        }
                        validation.handleBlur(e);
                      }}
                      value={validation.values.cgpa}
                      touched={validation.touched.cgpa}
                      error={validation.errors.cgpa}
                      passwordToggle={false}
                    />
                  </Col>
                </Row>
              )}
              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <BaseButton
                  className="order-1 order-md-0"
                  type="submit"
                  onClick={() => {
                    onBack(validation.values);
                  }}
                >
                  Previous
                </BaseButton>
                <BaseButton
                  color="primary"
                  className="order-0 order-md-1"
                  type="submit"
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

export default EducationalDetailsForm;
