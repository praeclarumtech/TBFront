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
import {
  createDegree,
  updateDegree,
  viewAllDegree,
  deleteMultipleDegree,
} from "api/apiDegree";
import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";

const { projectTitle, Modules, handleResponse } = appConstants;

const AddDegree = () => {
  document.title = Modules.Degree + " | " + projectTitle;
  const [degrees, setDegrees] = useState<any[]>([]);
  const [editingDegree, setEditingDegree] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [degreeToDelete, setDegreeToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");

  const fetchDegrees = async () => {
    setIsLoading(true);
    try {
      const res = await viewAllDegree({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      });

      if (res?.success) {
        setDegrees(res.data.data || []);
        setTotalRecords(res.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch qualification!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleEdit = (degree: any) => {
    setEditingDegree(degree);
    validation.setValues({
      degreeName: degree.degree,
    });
    setShowBaseModal(true);
  };

  const handleDelete = (degree: any) => {
    setDegreeToDelete(degree);
    setShowDeleteModal(true);
  };

  const confirmManyDelete = async (
    degreeToDelete: string[] | undefined | null
  ) => {
    if (!degreeToDelete || degreeToDelete.length === 0) {
      toast.error("No Qualification selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      await deleteMultipleDegree(degreeToDelete);

      toast.success("Selected qualification deleted successfully");
      fetchDegrees();
    } catch (error) {
      toast.error("Failed to delete one or more qualification.");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setDegreeToDelete([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDegree(degrees.map((degree) => degree._id)); // Select all
    } else {
      setSelectedDegree([]); // Unselect all
    }
  };

  const handleSelectDegree = (degreeId: string) => {
    setSelectedDegree(
      (prev) =>
        prev.includes(degreeId)
          ? prev.filter((id) => id !== degreeId) // Unselect if already selected
          : [...prev, degreeId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedDegree.length > 1) {
      setDegreeToDelete([...selectedDegree]);
      setShowDeleteModal(true);
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
              selectedDegree.length === degrees.length && degrees.length > 0
            }
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedDegree.includes(info.row.original._id)}
            onChange={() => handleSelectDegree(info.row.original._id)}
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
        header: "Qualification",
        accessorKey: "degree",
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
        cell: (cell: { row: { original: any } }) => (
          <div className="flex gap-2">
            <Tooltip.Provider delayDuration={100}>
              {/* View Button with Tooltip */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => handleEdit(cell?.row?.original)}
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

              {/* Edit Button with Tooltip */}

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() => handleDelete(cell?.row?.original)}
                  >
                    <i className="align-bottom ri-delete-bin-5-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                  >
                    Delete
                    <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
      },
    ],
    [degrees, selectedDegree]
  );

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      degreeName: "",
    },
    validationSchema: Yup.object({
      degreeName: Yup.string()
        .min(1, "Qualification Name must be at least 1.")
        .max(50, "Qualification name must be between 1 to 50 characters.")
        .required("Qualification name is required"),
    }),

    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        _id: editingDegree?._id,
        degree: values.degreeName,
      };

      const apiCall = editingDegree
        ? updateDegree(payload)
        : createDegree(payload);

      apiCall
        .then((res: { success: any; message: any }) => {
          if (res?.success) {
            toast.success(
              res?.message ||
                `Qualification  ${
                  editingDegree ? "updated" : "added"
                } successfully`
            );

            setEditingDegree(null);
            validation.resetForm();
            fetchDegrees();
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${editingDegree ? "update" : "add"} Qualification`
            );
          }
        })
        .catch((error: any) => {
          toast.error(error);
          // toast.error("Something went wrong!");
          console.error(error);
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  const formTitle = editingDegree ? "Qualification" : "Qualification";
  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingDegree(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingDegree(null);
    validation.resetForm();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
       setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const filteredDegree = degrees.filter((fDegree) =>
    fDegree.degree.toLowerCase().includes(searchAll.toLowerCase())
  );

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDegree([]);
  };

  const handleDeleteClick = () => {
    console.log(degreeToDelete);
    confirmManyDelete(degreeToDelete);
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
                          {selectedDegree.length > 1 && (
                            <BaseButton
                              className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                              onClick={handleDeleteAll}
                            >
                              <i className="align-bottom ri-delete-bin-fill" />
                              <ReactTooltip
                                place="bottom"
                                variant="error"
                                content="Delete"
                                anchorId={`Delete ${selectedDegree.length} Emails`}
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
                      editingDegree ? "Edit Qualification" : "Add Qualification"
                    }
                    submitButtonText={
                      editingDegree
                        ? "Update Qualification"
                        : "Add Qualification"
                    }
                    closeButtonText="Close"
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Qualification Name"
                          name="degreeName"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder(
                            "Qualification to be Added"
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.degreeName}
                          touched={validation.touched.degreeName}
                          error={validation.errors.degreeName}
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
                          {degrees?.length > 0 ? (
                            <TableContainer
                              // isHeaderTitle="Qualification"
                              columns={columns}
                              data={filteredDegree}
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

export default AddDegree;
