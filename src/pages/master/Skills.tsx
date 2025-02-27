// import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
// import { Fragment, useMemo, useState } from "react";
// import { Modules } from "components/constants/enum";
// import {
//   handleResponse,
//   InputPlaceHolder,
//   projectTitle,
// } from "components/constants/common";
// import BaseButton from "components/BaseComponents/BaseButton";
// import TableContainer from "components/BaseComponents/TableContainer";
// import { Link } from "react-router-dom";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { Loader } from "react-feather";
// import BaseInput from "components/BaseComponents/BaseInput";

// type SelectedOption = { label: string; value: string };

// const AddSkill = () => {
//   document.title = Modules.Login + " | " + projectTitle;

//   const columns = useMemo(
//     () => [
//       {
//         header: "Sr.no",
//         accessorKey: "id",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Skill",
//         accessorKey: "skill",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Action",
//         cell: (cell: { row: { original: { id: any } } }) => (
//           <div className="hstack gap-2">
//             <Link
//               to={`/stock-detail/${cell?.row?.original?.id}`}
//               id={`view-${cell?.row?.original?.id}`}
//               className="btn btn-sm btn-soft-info view-list"
//             >
//               <i className="ri-eye-fill align-bottom" />
//               <ReactTooltip
//                 place="bottom"
//                 variant="info"
//                 content="View"
//                 anchorId={`view-${cell?.row?.original?.id}`}
//               />
//             </Link>
//             <BaseButton
//               id={`usage-${cell?.row?.original?.id}`}
//               className="btn btn-sm btn-soft-success usage-list"
//               // onClick={() => toggleUsageModal(cell?.row?.original)}
//             >
//               <i className="ri-survey-fill align-bottom" />
//               <ReactTooltip
//                 place="bottom"
//                 variant="success"
//                 content="Used Stock"
//                 anchorId={`usage-${cell?.row?.original?.id}`}
//               />
//             </BaseButton>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const testEmails = [
//     {
//       id: 1,
//       skill: "React JS",
//     },
//     {
//       id: 2,
//       skill: "Node JS",
//     },
//   ];

//   const [loader, setLoader] = useState(false);

//   const validation: any = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       appliedSkills: "",
//       totalExperience: "",
//     },
//     validationSchema: Yup.object({
//       appliedSkills: Yup.string(),
//       // .required(validationMessages.required("Email"))
//       // .email(validationMessages.format("Email"))
//       // .matches(emailRegex, validationMessages.format("Email")),
//       totalExperience: Yup.string(),
//     }),
//     onSubmit: () => {
//       // const payload = {
//       //   email: String(value.email),
//       //   password: value.password,
//       // };
//       // setLoader(true);
//       // login(payload)
//       //   .then((res) => {
//       //     if (res?.statusCode === OK && res?.success === SUCCESS) {
//       //       setItem("authUser", res?.data?.token);
//       //       const decode = jwtDecode<any>(res?.data);
//       //       const role = decode.role;
//       //       const id = decode.id;
//       //       setItem("role", role);
//       //       setItem("id", id);
//       //       navigate("/");
//       //       toast.success(res?.message);
//       //     } else {
//       //       toast.error(res?.message);
//       //     }
//       //   })
//       //   .catch((error) => {
//       //     errorHandle(error);
//       //     setLoader(false);
//       //   })
//       //   .finally(() => setLoader(false));
//     },
//   });

//   const [filteredEmails, setFilteredEmails] = useState(testEmails);
//   const [selectedFilter, setSelectedFilter] = useState("");

//   // useEffect(() => {
//   //     let sortedEmails = [...testEmails];

//   //     if (selectedFilter === "date") {
//   //         sortedEmails.sort(
//   //             (a, b) =>
//   //                 new Date(a.date).getTime() - new Date(b.date).getTime()
//   //         );
//   //     } else if (selectedFilter === "id") {
//   //         sortedEmails.sort((a, b) => a.id - b.id);
//   //     }

//   //     setFilteredEmails(sortedEmails);
//   // }, [selectedFilter]);

//   return (
//     <Fragment>
//       <div className="pt-1 page-content"></div>
//       <Container fluid>
//         <Row>
//           <div>
//             <Card className="mb-3 my-3">
//               <CardBody>
//                 <Row className="flex">
//                   <Row className="fw-bold text-dark ms-2 mt-1 h4">
//                     <Col xl={5} sm={12} md={4} lg={2} className="!mb-2">
//                       Add DropDown Items of Skills
//                     </Col>
//                   </Row>
//                   <Row className="ms-2">
//                     <Col xs={9} md={5} lg={5}>
//                       <BaseInput
//                         label="Skill Name"
//                         name="addSkills"
//                         className="bg-gray-100"
//                         type="text"
//                         placeholder={InputPlaceHolder("Skill to be Added")}
//                         handleChange={validation.handleChange}
//                         handleBlur={validation.handleBlur}
//                         value={validation.values.emailTo}
//                         touched={validation.touched.emailTo}
//                         error={validation.errors.emailTo}
//                         passwordToggle={false}
//                       />
//                     </Col>
//                   </Row>
//                   <Row className="mt-3 ms-2">
//                     <Col
//                       xs={9}
//                       md={5}
//                       lg={5}
//                       // className="!d-flex !justify-content-end !px-1 mb-2"
//                       className="d-flex justify-content-end px-1"
//                     >
//                       <BaseButton
//                         color=" "
//                         disabled={loader}
//                         className="btn btn-outline-dark border-1 rounded-5"
//                         type="submit"
//                         loader={loader}
//                       >
//                         Cancle
//                       </BaseButton>
//                       <BaseButton
//                         color="success"
//                         disabled={loader}
//                         // className="w-100"
//                         type="submit"
//                         loader={loader}
//                         className="ms-3 px-5 border rounded-5"
//                       >
//                         Add
//                       </BaseButton>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col lg={12}>
//                       <Card id="addedSkillList">
//                         {loader ? (
//                           <Loader />
//                         ) : (
//                           <div className="card-body pt-0">
//                             <div>
//                               {testEmails?.length > 0 ? (
//                                 <TableContainer
//                                   isHeaderTitle="Skills"
//                                   columns={columns}
//                                   data={testEmails ? testEmails : []}
//                                   isGlobalFilter={true}
//                                   customPageSize={5}
//                                   theadClass="table-light text-muted"
//                                   SearchPlaceholder="Search..."
//                                 />
//                               ) : (
//                                 <div className="py-4 text-center">
//                                   <i className="ri-search-line d-block fs-1 text-success"></i>
//                                   {handleResponse?.dataNotFound}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </Card>
//                     </Col>
//                   </Row>
//                 </Row>
//               </CardBody>
//             </Card>
//           </div>
//         </Row>
//       </Container>
//     </Fragment>
//   );
// };

// export default AddSkill;
