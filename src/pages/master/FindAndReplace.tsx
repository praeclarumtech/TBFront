/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useState } from "react";

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
import { SelectedOption } from "interfaces/applicant.interface";
import { FindInPage, FindReplace } from "@mui/icons-material";
import { find, findAndReplaceAll } from "api/findAndReplace";

const { projectTitle, Modules, findAndReplaceOptions } = appConstants;

const FindAndReplace = () => {
  document.title = Modules.SKill + " | " + projectTitle;
  const [findAndReplaceOption, setFindAndReplaceOption] =
    useState<SelectedOption | null>(null);

  const [editingSkill, setEditingSkill] = useState<any>(null);

  // const handleEdit = (roleSkill: any) => {
  //   setEditingSkill(roleSkill);
  //   validation.setValues({
  //     findValue: "",
  //     ReplaceValue: "",
  //     field: findAndReplaceOption?.value || "",
  //   });
  //   setShowBaseModal(true);
  // };

  console.log("hellllllllooooo ji", findAndReplaceOptions);

  // const columns = useMemo(
  //   () => [
  //     {
  //       header: (
  //         <input
  //           type="checkbox"
  //           onChange={handleSelectAll}
  //           checked={
  //             selectedSkills.length === roleSkill.length && roleSkill.length > 0
  //           }
  //         />
  //       ),
  //       accessorKey: "select",
  //       cell: (info: any) => (
  //         <input
  //           type="checkbox"
  //           checked={selectedSkills.includes(info.row.original._id)}
  //           onChange={() => handleSelectApplicant(info.row.original._id)}
  //         />
  //       ),
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Sr.no",
  //       cell: getSerialNumber,
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Role",
  //       accessorKey: "appliedRole",
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Skill",
  //       accessorKey: "skill",
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Action",
  //       cell: (cell: { row: { original: any } }) => (
  //         <div className="gap-2 hstack">
  //           <BaseButton
  //             id={`usage-${cell?.row?.original?.id}`}
  //             color="primary"
  //             className="btn btn-sm btn-soft-success usage-list"
  //             onClick={() => handleView(cell.row.original)}
  //           >
  //             <i className="align-bottom ri-eye-fill" />
  //             <ReactTooltip
  //               place="bottom"
  //               variant="info"
  //               content="View"
  //               anchorId={`usage-${cell?.row?.original?.id}`}
  //             />
  //           </BaseButton>
  //           <BaseButton
  //             id={`edit-${cell?.row?.original?._id}`}
  //             color="secondary"
  //             className="btn btn-sm btn-soft-warning edit-list"
  //             onClick={() => handleEdit(cell?.row?.original)}
  //           >
  //             <i className="align-bottom ri-pencil-fill" />
  //           </BaseButton>
  //           <BaseButton
  //             color="danger"
  //             id={`delete-${cell?.row?.original?._id}`}
  //             className="btn btn-sm btn-soft-danger bg-danger"
  //             onClick={() => handleDelete(cell?.row?.original)}
  //           >
  //             <i className="align-bottom ri-delete-bin-fill" />
  //           </BaseButton>

  //           {/* Tooltips should be outside buttons */}
  //           <ReactTooltip
  //             place="bottom"
  //             variant="warning"
  //             content="Edit"
  //             anchorId={`edit-${cell?.row?.original?._id}`}
  //           />
  //           <ReactTooltip
  //             place="bottom"
  //             variant="error"
  //             content="Delete"
  //             anchorId={`delete-${cell?.row?.original?._id}`}
  //           />
  //         </div>
  //       ),
  //     },
  //   ],
  //   [selectedSkills, roleSkill]
  // );

  // const handleView = (id: string) => {
  //   setSelectedId(id);
  //   setShowViewModal(true);
  // };

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
      // setLoader(true);
      const payload = {
        field: findAndReplaceOption?.value || "",
        find: values.findValue,
        replaceWith: values.ReplaceValue,
      };

      const apiCall = findAndReplaceAll(payload);
      apiCall
        .then((res) => {
          if (res?.success) {
            toast.success(
              `Your Field ${payload.find} is Succesfully replace with ${payload.replaceWith}`
            );
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

      // setLoader(true);

      findAndReplaceAll(payload)
        .then((res) => {
          if (res?.success) {
            toast.success(
              `Your field "${payload.find}" was successfully replaced with "${payload.replaceWith}"`
            );
            setEditingSkill(null);
            validation.resetForm();
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        })
        .catch(() => toast.error("API Error"));
      // .finally(() => setLoader(false));
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
    console.log(findAndReplaceOption);
  };

  const handleFind = async () => {
    // if (!findAndReplaceOption?.value) {
    //   toast.error("Please select a field");
    //   return;
    // }

    await validation.setFieldTouched("findValue", true);
    const error = await validation.validateField("findValue");

    if (!error) {
      // No validation error, safe to call API
      const payload = {
        field: findAndReplaceOption?.value || "",
        find: validation.values.findValue,
        replaceWith: validation.values.ReplaceValue, // Optional if API accepts it
      };

      // setLoader(true);

      find(payload)
        .then((res) => {
          if (res?.message === "No matching records found.") {
            toast.error("your find does not content any data ");
          } else {
            if (res?.success) {
              toast.success(
                `Your field "${payload.find}" was found successfully`
              );
              console.log("first", res);
              setEditingSkill(null);
              validation.resetForm();
            } else {
              toast.error(res?.message || "Something went wrong");
            }
          }
        })

        .catch(() => toast.error("API Error"));
      // .finally(() => setLoader(false));
    }
  };

  return (
    <Fragment>
      {/* <DeleteModal
        show={showDeleteModal}
        // onCloseClick={closeDeleteModal}
        onDeleteClick={confirmDelete}
        loader={loader}
      /> */}
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3 ">
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
                      {/* Right Section (Search + Buttons) */}
                      <div className="flex-wrap mr-2 d-flex justify-content-end ">
                        {/* Search Bar */}
                        {/* <div className="col-sm-auto col-12">
                          <input
                            id="search-bar-0"
                            className="h-10 form-control search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div> */}

                        {/* Delete Button (Only if skills are selected)
                        {selectedSkills.length > 1 && (
                          <BaseButton
                            className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
                          >
                            <i className="align-bottom ri-delete-bin-fill" />
                            <ReactTooltip
                              place="bottom"
                              variant="error"
                              content="Delete"
                              anchorId={`Delete ${selectedSkills.length} Emails`}
                            />
                          </BaseButton>
                        )} */}

                        {/* Import & Submit Buttons (Stack only on smaller screens) */}
                        {/* <div className="flex-wrap gap-2 d-flex align-items-center">
                          <BaseButton
                            color="success"
                            disabled={loader}
                            type="submit"
                            loader={loader}
                            onClick={handleOpenBaseModal}
                            className="ml-2"
                          >
                            <i className="align-bottom ri-add-line me-1" />
                            {submitButtonText}
                          </BaseButton>
                        </div> */}
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
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3 d-flex">
                        <Col xs={10} md={8} lg={8}>
                          <BaseInput
                            label="Find"
                            name="findValue"
                            className="bg-gray-100"
                            type="text"
                            placeholder={InputPlaceHolder("Field to Find")}
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
                          />
                        </Col>
                        <Col xs={2} md={2} lg={2}>
                          <BaseButton
                            className="!p-0 mt-[35px] ml-n5"
                            onClick={handleFind}
                          >
                            <FindInPage />
                          </BaseButton>
                          <ReactTooltip
                            id="find-tooltip"
                            place="bottom"
                            variant="info"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3 mb-3">
                        <Col xs={10} md={8} lg={8}>
                          <BaseInput  
                            label="Replace"
                            name="ReplaceValue"
                            className="bg-gray-100"
                            type="text"
                            placeholder={InputPlaceHolder("Field to Replace")}
                            handleChange={validation.handleChange}
                            handleBlur={validation.handleBlur}
                            value={validation.values.ReplaceValue}
                            touched={!!validation.touched.ReplaceValue}
                            error={
                              typeof validation.errors.ReplaceValue === "string"
                                ? validation.errors.ReplaceValue
                                : undefined
                            }
                            passwordToggle={false}
                          />
                        </Col>
                        <Col xs={2} md={2} lg={2}>
                          <BaseButton
                            className="!p-0  mt-[35px] ml-n5"
                            onClick={replaceAll}
                          >
                            <FindReplace />
                          </BaseButton>
                          <ReactTooltip
                            id="replace-tooltip"
                            place="bottom"
                            variant="info"
                          />
                          {/* <BaseButton className="!p-0  mt-[35px] ml-2">
                            <DoneAll />
                          </BaseButton> */}
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
