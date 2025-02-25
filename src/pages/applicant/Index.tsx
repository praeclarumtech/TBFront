/* eslint-disable @typescript-eslint/no-explicit-any */

import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import * as Yup from "yup";
//import custom hook
import {
  handleResponse,
  InputPlaceHolder,
  projectTitle,
} from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment, useEffect, useMemo, useState } from "react";
import { dynamicFind } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { Loader } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { listOfApplicants } from "api/applicantApi";

type SelectedOption = { label: string; value: string };

const Applicant = () => {
  document.title = Modules.Login + " | " + projectTitle;

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [applicant, setApplicant] = useState([]);

  const listOfApplicant = () => {
    setLoader(true);
    listOfApplicants()
      .then((res) => {
        setApplicant(res?.data?.item);
      })
      .catch(() => {})
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    listOfApplicant();
  }, []);

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
    onSubmit: () => {
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

  const technologyType = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
    { label: "Express Js", value: "express_js" },
    { label: "DotNet", value: "dotnet" },
    { label: "Testing", value: "testing" },
  ];

  const experinceType = [
    { label: "0+", value: "0" },
    { label: "1+", value: "1" },
    { label: "2+", value: "1" },
    { label: "3+", value: "2" },
    { label: "4+", value: "4" },
  ];

  const columns = useMemo(
    () => [
      {
        header: "Applicant Name",
        accessorKey: "name.firstName",
        enableColumnFilter: false,
      },
      {
        header: "Technology",
        accessorKey: "appliedSkills",
        enableColumnFilter: false,
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
        enableColumnFilter: false,
      },
      {
        header: "Comments",
        accessorKey: "comments",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: { row: { original: { id: any } } }) => (
          <div className="hstack gap-2">
            <Link
              to={`/stock-detail/${cell?.row?.original?.id}`}
              id={`view-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-info view-list"
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="View"
                anchorId={`view-${cell?.row?.original?.id}`}
              />
            </Link>
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              // onClick={() => toggleUsageModal(cell?.row?.original)}
            >
              <i className="ri-survey-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="Used Stock"
                anchorId={`usage-${cell?.row?.original?.id}`}
              />
            </BaseButton>
          </div>
        ),
      },
    ],
    []
  );

  const handleNavigate = () => {
    navigate("/add-applicant");
  }

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <div className="d-flex justify-content-end">
          <BaseButton
            color="success"
            disabled={loader}
            className="w-100"
            loader={loader}
            onClick={handleNavigate}
          >
            Add New Applicant
          </BaseButton>
        </div>
        <Row>
          <div>
            <Card className="mb-3 my-3">
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
            </Card>
          </div>
        </Row>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              {loader ? (
                <Loader />
              ) : (
                <div className="card-body pt-0">
                  <div>
                    {applicant?.length > 0 ? (
                      <TableContainer
                        isHeaderTitle="Applicants"
                        columns={columns}
                        data={applicant ? applicant : []}
                        isGlobalFilter={true}
                        customPageSize={5}
                        theadClass="table-light text-muted"
                        SearchPlaceholder="Search..."
                      />
                    ) : (
                      <div className="py-4 text-center">
                        <i className="ri-search-line d-block fs-1 text-success"></i>
                        {handleResponse?.dataNotFound}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {/* <BreadCrumb title='applicant' pageTitle={projectTitle} /> */}
      </Container>
    </Fragment>
  );
};

export default Applicant;
