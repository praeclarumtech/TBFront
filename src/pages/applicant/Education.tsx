/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { Form } from "react-router-dom";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  EducationApplicantSchema,
  Qualification,
  SelectedOption,
} from "interfaces/applicant.interface";
import { dynamicFind, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";
import { viewAllDegree } from "api/apiDegree";
import { toast } from "react-toastify";

const { projectTitle, Modules, passingYearType } = appConstants;

const EducationalDetailsForm = ({ onNext, onBack, initialValues }: any) => {
  document.title = Modules.CreateApplicantForm + " | " + projectTitle;
  const [loading, setLoading] = useState<boolean>(false);
  const [qualification, setQualification] = useState<Qualification[]>([]);

  useEffect(() => {
    const getQualification = async () => {
      try {
        setLoading(true);
        const page = 1;
        const pageSize = 50;
        const limit = 1000;
        const qualificationData = await viewAllDegree({
          page,
          pageSize,
          limit,
        });
        const degreeList = qualificationData?.data?.data;
        if (Array.isArray(degreeList)) {
          setQualification(
            degreeList.map((item: { degree: string; _id: string }) => ({
              label: item.degree,
              value: item._id,
            }))
          );
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch qualifications.. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    getQualification();
  }, []);

  const initialQualificationValue = (() => {
    const match = qualification.find(
      (q) =>
        q.label === initialValues?.qualification ||
        q.value === initialValues?.qualification
    );
    return match?.value || "";
  })();

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      qualification: initialQualificationValue,
      specialization: initialValues?.specialization || "",
      passingYear: initialValues?.passingYear || "",
      cgpa: initialValues?.cgpa || "",
      collegeName: initialValues?.collegeName || "",
    },
    validationSchema: EducationApplicantSchema,

    onSubmit: (data) => {
      setLoading(true);

      const selectedDegree = qualification.find(
        (q) => q.value === data.qualification
      )?.label;
      // const submissionData = {
      //   ...data,
      //   qualification: selectedDegree || data.qualification,
      // };

      onNext({
        ...data,
        qualification: selectedDegree || data.qualification,
      });

      // onNext(data);
      // data = submissionData;
      // onNext(submissionData);
      // onNext(data);



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
                <div className="my-5 d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Row className="mb-4 g-3">
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
                      isRequired={false}
                      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                        menuList: (provided: any) => ({
                          ...provided,
                          maxHeight: 200,
                          overflowY: 'auto',
                        }),
                      }}
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
                      isRequired={false}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <BaseInput
                      label="College Name (Optional)"
                      name="collegeName"
                      type="text"
                      placeholder={InputPlaceHolder("College Name (Optional)")}
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

                  <Col xs={12} md={6} lg={4}>
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
                      isRequired={false}
                      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                        menuList: (provided: any) => ({
                          ...provided,
                          maxHeight: 200,
                          overflowY: 'auto',
                        }),
                      }}
                    />
                  </Col>

                  <Col xs={12} md={8} lg={4}>
                    <BaseInput
                      label="CGPA (Optional)"
                      name="cgpa"
                      type="text"
                      placeholder={InputPlaceHolder("CGPA (Optional)")}
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
              <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-end">
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
