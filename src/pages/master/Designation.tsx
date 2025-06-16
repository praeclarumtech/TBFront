/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";

import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import {
  createDesignation,
  deleteDesignation,
  deleteMultipleDesignation,
  updateDesignation,
  viewAllDesignation,
} from "api/designation";

const { projectTitle, Modules, handleResponse } = appConstants;

const AddDesignation = () => {
  document.title = Modules.Designation + " | " + projectTitle;
  const [designations, setDesignations] = useState<any[]>([]);
  const [editingDesignation, setEditingDesignation] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");

  const fetchDesignations = async () => {
    setIsLoading(true);
    try {
      const params: {
        search?: string;
        page?: number;
        pageSize?: number;
        limit?: number;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };

      const searchValue = searchAll?.trim();
      if (searchValue) {
        params.search = searchValue;
      }

      const res = await viewAllDesignation(params);

      if (res?.success) {
        setDesignations(res.data.data || []);
        setTotalRecords(res.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch designations");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const handleEdit = (designation: any) => {
    setEditingDesignation(designation);
    validation.setValues({
      designationName: designation.designation,
    });
    setShowBaseModal(true);
  };

  const handleDelete = (designation: any) => {
    setDesignationToDelete(designation);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!designationToDelete || designationToDelete.length === 0) {
      toast.error("No designations selected for deletion.");
      return;
    }

    setLoader(true);
    try {
      await deleteDesignation(designationToDelete._id);

      toast.success("Selected designations deleted successfully");
      fetchDesignations();
    } catch (error) {
      toast.error("Failed to delete one or more designations.");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setDesignationToDelete([]);
    }
  };

  const confirmMultiDelete = async (
    multipleDesignationDelete: string[] | undefined | null
  ) => {
    setLoader(true);
    try {
      await deleteMultipleDesignation(multipleDesignationDelete);

      toast.success("Selected designations deleted successfully");
      fetchDesignations();
    } catch (error) {
      toast.error("Failed to delete one or more designations.");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setDesignationToDelete([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDesignation(
        designations.map((designation) => designation._id)
      ); // Select all
    } else {
      setSelectedDesignation([]); // Unselect all
    }
  };

  const handleSelectDesignation = (designationId: string) => {
    setSelectedDesignation(
      (prev) =>
        prev.includes(designationId)
          ? prev.filter((id) => id !== designationId) // Unselect if already selected
          : [...prev, designationId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedDesignation.length > 1) {
      setDesignationToDelete([...selectedDesignation]);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedDesignation.length > 1) {
      confirmMultiDelete(selectedDesignation);
    } else {
      confirmDelete();
    }
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedDesignation.length === designations.length &&
              designations.length > 0
            }
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedDesignation.includes(info.row.original._id)}
            onChange={() => handleSelectDesignation(info.row.original._id)}
          />
        ),
        enableColumnFilter: false,
      },
      // {
      //   header: "Sr.no",
      //   cell: getSerialNumber,
      //   enableColumnFilter: false,
      // },
      {
        header: "Designation",
        accessorKey: "designation",
        enableColumnFilter: false,
      },
      // {
      //   header: "Action",
      //   cell: (cell: { row: { original: any } }) => (
      //     <div className="gap-2 hstack">
      //       <BaseButton
      //         id={`edit-${cell?.row?.original?._id}`}
      //         color="primary"
      //         className="btn btn-sm btn-soft-warning edit-list"
      //         onClick={() => handleEdit(cell?.row?.original)}
      //       >
      //         <i className="align-bottom ri-pencil-fill" />
      //         <ReactTooltip
      //           place="bottom"
      //           variant="warning"
      //           content="Edit"
      //           anchorId={`edit-${cell?.row?.original?._id}`}
      //         />
      //       </BaseButton>
      //       <BaseButton
      //         color="danger"
      //         id={`delete-${cell?.row?.original?._id}`}
      //         className="btn btn-sm btn-soft-danger bg-danger"
      //         onClick={() => handleDelete(cell?.row?.original)}
      //       >
      //         <i className="align-bottom ri-delete-bin-fill" />
      //         <ReactTooltip
      //           place="bottom"
      //           variant="error"
      //           content="Delete"
      //           anchorId={`delete-${cell?.row?.original?._id}`}
      //         />
      //       </BaseButton>
      //     </div>
      //   ),
      // },

      {
        header: "Action",
        cell: ({ row }: { row: { original: any } }) => {
          const original = row.original;
          // const id = original._id;

          return (
            <Tooltip.Provider delayDuration={100}>
              <div className="flex items-center gap-2">
                {/* Edit Button with Tooltip */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-warning edit-list bg-primary"
                      onClick={() => handleEdit(original)}
                    >
                      <i className="text-white align-bottom ri-pencil-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                    >
                      Edit
                      <Tooltip.Arrow style={{ fill: "#624bff" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* Delete Button with Tooltip */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-danger bg-danger"
                      onClick={() => handleDelete(original)}
                    >
                      <i className="text-white align-bottom ri-delete-bin-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                    >
                      Delete
                      <Tooltip.Arrow className="fill-[#dc3545]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </Tooltip.Provider>
          );
        },
      },
    ],
    [designations, selectedDesignation]
  );

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      designationName: "",
    },
    validationSchema: Yup.object({
      designationName: Yup.string()
        .min(1, "Designation Name must be at least 1.")
        .max(50, "Designation name must be between 1 to 50 characters.")
        .required("Designation name is required"),
    }),

    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        _id: editingDesignation?._id,
        designation: values.designationName,
      };

      const apiCall = editingDesignation
        ? updateDesignation(editingDesignation._id, payload)
        : createDesignation(payload);

      apiCall
        .then((res: { success: any; message: any }) => {
          if (res?.success) {
            toast.success(
              res?.message ||
                `Designation ${
                  editingDesignation ? "updated" : "added"
                } successfully`
            );

            setEditingDesignation(null);
            validation.resetForm();
            fetchDesignations();
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${editingDesignation ? "update" : "add"} Designation`
            );
          }
        })
        .catch((error: any) => {
          toast.error("Something went wrong!");
          console.error(error);
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  const formTitle = editingDesignation ? "Designation" : "Designation";
  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingDesignation(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingDesignation(null);
    validation.resetForm();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  // const filteredDesignation = designations.filter((fDesignation) =>
  //   fDesignation.designation.toLowerCase().includes(searchAll.toLowerCase())
  // );

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDesignation([]);
  };

  return (
    <Fragment>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={handleDeleteClick}
        loader={loader}
      />
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <Row className="flex">
                  <Row className="fw-bold text-dark h4 d-flex align-items-center">
                    <Col
                      sm={12}
                      md={12}
                      className="justify-between ml-2 d-flex align-items-center"
                    >
                      {formTitle}
                      <div className="justify-end d-flex">
                        <div>
                          <input
                            id="search-bar-0"
                            className="h-10 gap-2 form-control search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>
                        <div className="d-flex justify-content-end">
                          {selectedDesignation.length > 1 && (
                            <BaseButton
                              className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                              onClick={handleDeleteAll}
                            >
                              <i className="align-bottom ri-delete-bin-fill" />
                              <ReactTooltip
                                place="bottom"
                                variant="error"
                                content="Delete"
                                anchorId={`Delete ${selectedDesignation.length} Designations`}
                              />
                            </BaseButton>
                          )}
                          <BaseButton
                            color="success"
                            disabled={loader}
                            type="submit"
                            loader={loader}
                            // className="px-5 border ms-3 rounded-5"
                            className="mx-2"
                            onClick={handleOpenBaseModal}
                          >
                            <i className="mx-1 align-bottom ri-add-line" />
                            {submitButtonText}
                          </BaseButton>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <BaseModal
                    show={showBaseModal}
                    setShowBaseModal={setShowBaseModal}
                    onCloseClick={handleCloseClick}
                    onSubmitClick={handleSubmit}
                    modalTitle={
                      editingDesignation
                        ? "Edit Designation"
                        : "Add Designation"
                    }
                    submitButtonText={
                      editingDesignation
                        ? "Update Designation"
                        : "Add Designation"
                    }
                    closeButtonText="Close"
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Designation Name"
                          name="designationName"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder(
                            "Designation to be Added"
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.designationName}
                          touched={validation.touched.designationName}
                          error={validation.errors.designationName}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                  </BaseModal>
                  <Row className="mt-3">
                    <Col lg={12}>
                      {isLoading ? (
                        <div className="py-4 text-center">
                          <Skeleton count={1} className="mb-5 min-h-10" />

                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <div>
                          {designations?.length > 0 ? (
                            <TableContainer
                              // isHeaderTitle="Qualification"
                              columns={columns}
                              data={designations}
                              isGlobalFilter={false}
                              customPageSize={50}
                              tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
                              theadClass="table-light text-muted "
                              SearchPlaceholder="Search..."
                              totalRecords={totalRecords}
                              pagination={pagination}
                              setPagination={setPagination}
                              loader={loader}
                              customPadding="0.3rem 1.5rem "
                              rowHeight="10px !important"
                            />
                          ) : (
                            <div className="py-4 text-center">
                              <i className="ri-search-line d-block fs-1 text-success"></i>
                              {handleResponse?.dataNotFound}
                            </div>
                          )}
                        </div>
                      )}
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

export default AddDesignation;
