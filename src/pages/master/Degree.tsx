/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";

import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  createDegree,
  updateDegree,
  viewAllDegree,
  deleteDegree,
} from "api/apiDegree";
import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { getSerialNumber, InputPlaceHolder } from "utils/commonFunctions";
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
    pageSize: 10,
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
        toast.error(res?.message || "Failed to fetch degrees");
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

  // const confirmDelete = () => {
  //   if (!degreeToDelete) return;

  //   setLoader(true);
  //   deleteDegree({ _id: degreeToDelete._id })
  //     .then((res: { success: any; message: any }) => {
  //       if (res?.success) {
  //         toast.success(res?.message || "Degree deleted successfully");
  //         fetchDegrees();
  //       } else {
  //         toast.error(res?.message || "Failed to delete degree");
  //       }
  //     })
  //     .catch((error: any) => {
  //       toast.error("Something went wrong!");
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setLoader(false);
  //       setShowDeleteModal(false);
  //       setDegreeToDelete(null);
  //     });
  // };

  const confirmDelete = async () => {
    if (!degreeToDelete || degreeToDelete.length === 0) {
      toast.error("No degrees selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      await Promise.all(
        degreeToDelete.map((id: any) => deleteDegree({ _id: id }))
      );

      toast.success("Selected degrees deleted successfully");
      fetchDegrees();
    } catch (error) {
      toast.error("Failed to delete one or more degrees.");
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
      {
        header: "Sr.no",
        cell: getSerialNumber,
        enableColumnFilter: false,
      },
      {
        header: "Degree",
        accessorKey: "degree",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: { row: { original: any } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`edit-${cell?.row?.original?._id}`}
              color="primary"
              className="btn btn-sm btn-soft-warning edit-list"
              onClick={() => handleEdit(cell?.row?.original)}
            >
              <i className="ri-pencil-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="warning"
                content="Edit"
                anchorId={`edit-${cell?.row?.original?._id}`}
              />
            </BaseButton>
            <BaseButton
              color="danger"
              id={`delete-${cell?.row?.original?._id}`}
              className="btn btn-sm btn-soft-danger bg-danger"
              onClick={() => handleDelete(cell?.row?.original)}
            >
              <i className="ri-delete-bin-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="error"
                content="Delete"
                anchorId={`delete-${cell?.row?.original?._id}`}
              />
            </BaseButton>
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
      degreeName: Yup.string().required("Degree name is required"),
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
                `Degree ${editingDegree ? "updated" : "added"} successfully`
            );

            setEditingDegree(null);
            validation.resetForm();
            fetchDegrees();
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${editingDegree ? "update" : "add"} degree`
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

  const formTitle = editingDegree ? "Edit Degree" : "Add Degree";
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
  };

  const filteredDegree = degrees.filter((fDegree) =>
    fDegree.degree.toLowerCase().includes(searchAll.toLowerCase())
  );

  return (
    <Fragment>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={() => setShowDeleteModal(false)}
        onDeleteClick={confirmDelete}
        loader={loader}
      />
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="mb-3 my-3">
              <CardBody>
                <Row className="flex">
                  <Row className="fw-bold text-dark h4 d-flex align-items-center">
                    <Col
                      sm={12}
                      md={12}
                      className="d-flex align-items-center justify-between ml-2"
                    >
                      {formTitle}
                      <div className="d-flex justify-end">
                        <div>
                          <input
                            id="search-bar-0"
                            className="form-control search h-10 gap-2"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>
                        <div className="d-flex justify-content-end">
                          {selectedDegree.length > 1 && (
                            <BaseButton
                              className="btn text-lg bg-danger edit-list ml-2 w-fit border-0"
                              onClick={handleDeleteAll}
                            >
                              <i className="ri-delete-bin-fill align-bottom" />
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
                            // className="ms-3 px-5 border rounded-5"
                            className="mx-2"
                            onClick={handleOpenBaseModal}
                          >
                            <i className="ri-add-line align-bottom mx-1" />
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
                    modalTitle={editingDegree ? "Edit Degree" : "Add Degree"}
                    submitButtonText={
                      editingDegree ? "Update Degree" : "Add Degree"
                    }
                    closeButtonText="Close"
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Degree Name"
                          name="degreeName"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Degree to be Added")}
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
                        <div className="text-center py-4">
                          <Skeleton count={1} className="min-h-10 mb-5" />

                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <div>
                          {degrees?.length > 0 ? (
                            <TableContainer
                              isHeaderTitle="Degrees"
                              columns={columns}
                              data={filteredDegree}
                              isGlobalFilter={false}
                              customPageSize={10}
                              theadClass="table-light text-muted"
                              SearchPlaceholder="Search..."
                              totalRecords={totalRecords}
                              pagination={pagination}
                              setPagination={setPagination}
                              loader={loader}
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
