/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";

import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import "react-loading-skeleton/dist/skeleton.css";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import { FindReplace } from "@mui/icons-material";
import { find, findAndReplaceAll } from "api/findAndReplace";
import { ViewAppliedSkills } from "api/skillsApi";
import { viewRoleSkill } from "api/roleApi";
import { viewAllDegree } from "api/apiDegree";

const { projectTitle, Modules, findAndReplaceOptions } = appConstants;

const FindAndReplace = () => {
  document.title = Modules.FindAndReplace + " | " + projectTitle;
  const [findAndReplaceOption, setFindAndReplaceOption] =
    useState<SelectedOption | null>(null);
  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [roleOptions, setRoleOptions] = useState<SelectedOption1[]>([]);
  const [qualificationOptions, setQualificationOptions] = useState<
    SelectedOption1[]
  >([]);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      field: findAndReplaceOption?.value || "",
      findValue: "",
      ReplaceValue: "",
    },
    validationSchema: Yup.object({
      field: Yup.string().required("Please Select Field"),
      findValue: Yup.string().required("Please enter value to find"),
      ReplaceValue: Yup.string().required("Please enter value to find"),
    }),
    onSubmit: (values) => {
      const payload = {
        field: findAndReplaceOption?.value || "",
        find: values.findValue,
        replaceWith: values.ReplaceValue,
      };

      const apiCall = findAndReplaceAll(payload);
      apiCall
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message);
            setEditingSkill(null);
            validation.resetForm();
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        })
        .catch(() => toast.error("API Error"));
      // .finally(() => setLoader(false));
    },
  });

  const replaceAll = async () => {
    const errors = await validation.validateForm();

    if (Object.keys(errors).length === 0) {
      // No validation errors, safe to call API
      const payload = {
        field: findAndReplaceOption?.value || "",
        find: validation.values.findValue,
        replaceWith: validation.values.ReplaceValue,
      };

      findAndReplaceAll(payload)
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message);
            setEditingSkill(null);
            validation.resetForm();
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        })
        .catch((error) => toast.error(error || "Somthing went wrong"));
    } else {
      // Validation errors exist
      validation.setTouched({
        findValue: true,
        ReplaceValue: true,
      });
    }
  };

  const formTitle = editingSkill ? "Update Data" : "Find and Replace";

  const handleField = (selectedOption: SelectedOption) => {
    setFindAndReplaceOption(selectedOption);
    validation.setFieldValue("field", selectedOption?.value || "");
  };

  const handleAppliedField = (selectedOption: SelectedOption) => {
    validation.setFieldValue("ReplaceValue", selectedOption?.value || "");
  };

  const handleFind = async () => {
    await validation.setFieldTouched("findValue", true);
    const error = await validation.validateField("findValue");

    if (!error) {
      const payload = {
        field: findAndReplaceOption?.value || "",
        find: validation.values.findValue,
        replaceWith: validation.values.ReplaceValue, // Optional if API accepts it
      };

      find(payload)
        .then((res) => {
          if (res?.message === "No matching records found.") {
            toast.error("No matches found for the given input.");
          } else {
            if (res?.success) {
              toast.success(res?.message);
              setEditingSkill(null);
            } else {
              toast.error(res?.message || "Something went wrong");
            }
          }
        })

        .catch(() => toast.error("API Error"));
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await ViewAppliedSkills({
          page: 1,
          pageSize: 50,
          limit: 1000,
        });

        const skillData = response?.data?.data || [];
        setSkillOptions(
          skillData.map((item: any) => ({
            label: item.skills,
            value: item.skills,
          }))
        );
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
          toast.error("Failed to fetch skills.. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await viewRoleSkill({
          page: 1,
          pageSize: 50,
          limit: 1000,
        });

        const roleData = response?.data?.data || [];
        setRoleOptions(
          roleData.map((item: any) => ({
            label: item.appliedRole,
            value: item.appliedRole,
          }))
        );
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
          toast.error("Failed to fetch roles.. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      }
    };

    const fetchQualifications = async () => {
      try {
        const response = await viewAllDegree({
          page: 1,
          pageSize: 50,
          limit: 1000,
        });

        const qualificationData = response?.data?.data || [];
        setQualificationOptions(
          qualificationData.map((item: any) => ({
            label: item.degree,
            value: item.degree,
          }))
        );
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
      }
    };

    fetchSkills();
    fetchRoles();
    fetchQualifications();
  }, []);

  return (
    <Fragment>
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <Row className="pl-3 mb-3">
                  <Row className="mt-1 fw-bold text-dark d-flex align-items-center">
                    <Col
                      sm={12}
                      lg={12}
                      className="flex-wrap mb-2 ml-3 d-flex justify-content-between align-items-center"
                    >
                      <div className="justify-content-start h4 fw-bold">
                        {formTitle}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4 justify-content-center">
                    <Col xs={12} md={10} lg={8}>
                      <Row>
                        <Col xs={12} md={8} lg={8}>
                          <BaseSelect
                            label="Select Fields"
                            name="selectFields"
                            options={findAndReplaceOptions}
                            className="mb-1 select-border "
                            placeholder="Select Fields"
                            value={
                              findAndReplaceOptions.find(
                                (opt) => opt.value === validation.values.field
                              ) || null
                            }
                            handleChange={handleField}
                            handleBlur={validation.handleBlur}
                            touched={!!validation.touched.field}
                            error={
                              typeof validation.errors.field === "string"
                                ? validation.errors.field
                                : undefined
                            }
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
                      </Row>
                      <Row className="mt-3 d-flex">
                        <Col xs={10} md={8} lg={8}>
                          <BaseInput
                            label="Find"
                            name="findValue"
                            // className="bg-gray-100"
                            type="text"
                            placeholder={InputPlaceHolder(
                              `Field to ${
                                findAndReplaceOption?.label || "Find"
                              } `
                            )}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.findValue}
                            touched={!!validation.touched.findValue}
                            error={
                              typeof validation.errors.findValue === "string"
                                ? validation.errors.findValue
                                : undefined
                            }
                            passwordToggle={false}
                            disabled={!validation.values.field}
                          />
                        </Col>
                        <Col xs={2} md={2} lg={2}>
                          <BaseButton
                            className="!p-0 mt-[35px] ml-n5 bg-primary "
                            onClick={handleFind}
                            disabled={!validation.values.findValue}
                          >
                            <i className="p-1 ri-search-2-line"> </i>
                          </BaseButton>
                          <ReactTooltip
                            id="find-tooltip"
                            place="bottom"
                            variant="info"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3 mb-3">
                        {findAndReplaceOption?.value === "appliedSkills" && (
                          <Col xs={12} md={8} lg={8}>
                            <BaseSelect
                              label="Replace"
                              name="ReplaceValue"
                              options={skillOptions}
                              className="mb-1 select-border"
                              placeholder="Select Fields"
                              value={
                                skillOptions.find(
                                  (opt) =>
                                    opt.value === validation.values.ReplaceValue
                                ) || null
                              }
                              handleChange={handleAppliedField}
                              handleBlur={validation.handleBlur}
                              touched={!!validation.touched.ReplaceValue}
                              error={
                                typeof validation.errors.ReplaceValue ===
                                "string"
                                  ? validation.errors.ReplaceValue
                                  : undefined
                              }
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
                        )}

                        {findAndReplaceOption?.value === "appliedRole" && (
                          <Col xs={12} md={8} lg={8}>
                            <BaseSelect
                              label="Replace"
                              name="ReplaceValue"
                              options={roleOptions}
                              className="mb-1 select-border"
                              placeholder="Select Role"
                              value={
                                roleOptions.find(
                                  (opt) =>
                                    opt.value === validation.values.ReplaceValue
                                ) || null
                              }
                              handleChange={handleAppliedField}
                              handleBlur={validation.handleBlur}
                              touched={!!validation.touched.ReplaceValue}
                              error={
                                typeof validation.errors.ReplaceValue ===
                                "string"
                                  ? validation.errors.ReplaceValue
                                  : undefined
                              }
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
                        )}

                        {findAndReplaceOption?.value === "qualification" && (
                          <Col xs={12} md={8} lg={8}>
                            <BaseSelect
                              label="Replace"
                              name="ReplaceValue"
                              options={qualificationOptions}
                              className="mb-1 select-border"
                              placeholder="Select Qualification"
                              value={
                                qualificationOptions.find(
                                  (opt) =>
                                    opt.value === validation.values.ReplaceValue
                                ) || null
                              }
                              handleChange={handleAppliedField}
                              handleBlur={validation.handleBlur}
                              touched={!!validation.touched.ReplaceValue}
                              error={
                                typeof validation.errors.ReplaceValue ===
                                "string"
                                  ? validation.errors.ReplaceValue
                                  : undefined
                              }
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
                        )}

                        {![
                          "appliedSkills",
                          "appliedRole",
                          "qualification",
                        ].includes(findAndReplaceOption?.value || "") && (
                          <Col xs={10} md={8} lg={8}>
                            <BaseInput
                              label="Replace"
                              name="ReplaceValue"
                              type="text"
                              placeholder={InputPlaceHolder("Field to Replace")}
                              handleChange={validation.handleChange}
                              handleBlur={validation.handleBlur}
                              value={validation.values.ReplaceValue}
                              touched={!!validation.touched.ReplaceValue}
                              error={
                                typeof validation.errors.ReplaceValue ===
                                "string"
                                  ? validation.errors.ReplaceValue
                                  : undefined
                              }
                              passwordToggle={false}
                              disabled={
                                !validation.values.field &&
                                !validation.values.findValue
                              }
                            />
                          </Col>
                        )}
                        <Col xs={2} md={2} lg={2}>
                          <BaseButton
                            className="!p-0  mt-[35px] ml-n5 bg-primary "
                            onClick={replaceAll}
                            disabled={
                              !validation.values.ReplaceValue ||
                              !validation.values.field
                            }
                          >
                            <FindReplace />
                          </BaseButton>
                          <ReactTooltip
                            id="replace-tooltip"
                            place="bottom"
                            variant="info"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default FindAndReplace;