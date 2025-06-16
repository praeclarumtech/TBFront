/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";

import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";

import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import {
  errorHandle,
  // getSerialNumber,
  InputPlaceHolder,
} from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { viewAllCountry } from "api/CountryStateCity";
import {
  createState,
  deleteState,
  updateState,
  viewAllState,
} from "api/stateApi";
import { SelectedOption1 } from "interfaces/applicant.interface";
import { BaseSelect } from "components/BaseComponents/BaseSelect";

const { projectTitle, Modules, handleResponse } = appConstants;

const State = () => {
  document.title = Modules.State + " | " + projectTitle;
  const [state, setState] = useState<any[]>([]);
  const [editingState, setEditingState] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<SelectedOption1[]>([]);

  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  //   const [selectedId, setSelectedId] = useState<string | null>(null);
  //   const [showViewModal, setShowViewModal] = useState(false);

  const fetchCountry = async () => {
    try {
      setIsLoading(true);
      const page = 1;
      const pageSize = 50;
      const limit = 500;
      const response = await viewAllCountry({
        page,
        pageSize,
        limit,
      });

      const countryData = response?.data?.item || [];

      setCountryOptions(
        countryData.map((item: any) => ({
          label: item.country_name,
          value: item.country_name, // match what you'll use in selected
          id: item._id, // if needed
        }))
      );
    } catch (error) {
      errorHandle(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchState = async () => {
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

      const res = await viewAllState(params);

      if (res?.success) {
        setState(res?.data?.item || []);
        setTotalRecords(res.data?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch State");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    fetchCountry();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const handleDelete = (city: any) => {
    setStateToDelete(city);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!stateToDelete || stateToDelete.length === 0) {
      toast.error("No states selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      // If deleting multiple
      if (Array.isArray(stateToDelete)) {
        const deleteRequests = stateToDelete.map((id) =>
          deleteState({ _id: id })
        );

        // Wait for all delete requests to finish
        const results = await Promise.all(deleteRequests);

        const allSuccess = results.every((res) => res?.success);
        if (allSuccess) {
          toast.success("State deleted successfully");
        } else {
          toast.error("Some state could not be deleted.");
        }
      }
      // If deleting a single
      else if (stateToDelete._id) {
        const res = await deleteState({ _id: stateToDelete._id });
        if (res?.success) {
          toast.success(res?.message);
        } else {
          toast.error("Failed to delete State");
        }
      }
      fetchState();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setStateToDelete([]);
      setSelectedState([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedState(state.map((state) => state._id)); // Select all
    } else {
      setSelectedState([]); // Unselect all
    }
  };

  const handleSelectApplicant = (stateId: string) => {
    setSelectedState(
      (prev) =>
        prev.includes(stateId)
          ? prev.filter((id) => id !== stateId) // Unselect if already selected
          : [...prev, stateId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedState.length > 1) {
      setStateToDelete([...selectedState]);
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
            checked={selectedState.length === state.length && state.length > 0}
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedState.includes(info.row.original._id)}
            onChange={() => handleSelectApplicant(info.row.original._id)}
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
        header: "State",
        accessorKey: "state_name",
        enableColumnFilter: false,
      },
      //   {
      //     header: "Country",
      //     accessorKey: "country_id",
      //     enableColumnFilter: false,
      //   },
      // {
      //   header: "Action",
      //   cell: (cell: { row: { original: any } }) => (
      //     <div className="gap-2 hstack">
      //       {/* <BaseButton
      //         id={`usage-${cell?.row?.original?.id}`}
      //         color="primary"
      //         className="btn btn-sm btn-soft-success usage-list"
      //         onClick={() => handleView(cell.row.original)}
      //       >
      //         <i className="align-bottom ri-eye-fill" />
      //         <ReactTooltip
      //           place="bottom"
      //           variant="info"
      //           content="View"
      //           anchorId={`usage-${cell?.row?.original?.id}`}
      //         />
      //       </BaseButton> */}
      //       <BaseButton
      //         id={`edit-${cell?.row?.original?._id}`}
      //         color="primary"
      //         className="btn btn-sm btn-soft-warning edit-list"
      //         onClick={() => handleEdit(cell?.row?.original)}
      //       >
      //         <i className="align-bottom ri-pencil-fill" />
      //       </BaseButton>
      //       <BaseButton
      //         color="danger"
      //         id={`delete-${cell?.row?.original?._id}`}
      //         className="btn btn-sm btn-soft-danger bg-danger"
      //         onClick={() => handleDelete(cell?.row?.original)}
      //       >
      //         <i className="align-bottom ri-delete-bin-fill" />
      //       </BaseButton>

      //       {/* Tooltips should be outside buttons */}
      //       <ReactTooltip
      //         place="bottom"
      //         variant="warning"
      //         content="Edit"
      //         anchorId={`edit-${cell?.row?.original?._id}`}
      //       />
      //       <ReactTooltip
      //         place="bottom"
      //         variant="error"
      //         content="Delete"
      //         anchorId={`delete-${cell?.row?.original?._id}`}
      //       />
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
    [selectedState, state]
  );

  const [loader, setLoader] = useState(false);

  //   const handleView = (id: string) => {
  //     setSelectedId(id);
  //     setShowViewModal(true);
  //   };

  //   const handleCloseModal = () => {
  //     setShowViewModal(false);
  //   };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: editingState ? editingState._id : "",
      state_name: editingState ? editingState.state_name : "",
      country_id: editingState ? editingState.country_id : "",
    },
    validationSchema: Yup.object({
      state_name: Yup.string()
        .min(1, "State Name must be at least 1.")
        .max(50, "State name must be between 1 to 50 characters.")
        .required("State is required"),
      country_id: Yup.string().required("Country is required"),
    }),
    onSubmit: (values) => {
      setLoader(true);

      const payload = {
        _id: values._id,
        country_id: values.country_id,
        state_name: values.state_name,
      };

      const apiCall = editingState
        ? updateState(payload)
        : createState(payload);

      apiCall
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message);
            setEditingState(null);
            validation.resetForm();
            fetchState();
            setShowBaseModal(false);
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        })
        .catch((error) => toast.error(error?.message || "Something went wrong"))
        .finally(() => setLoader(false));
    },
  });

  const handleEdit = (id: any) => {
    setEditingState(id);
    const selectCountry = countryOptions.find(
      (country) => country.id === id.country_id
    );
    validation.setValues({
      _id: id._id || "",
      country_id: selectCountry?.value || null,
      state_name: id.state_name,
    });
    setShowBaseModal(true);
  };

  const formTitle = editingState ? "Update State" : "Add State";
  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingState(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingState(null);
    validation.resetForm();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedState([]);
  };

  return (
    <Fragment>
      {/* {showViewModal && selectedId && (
        <ViewRoleSkill
          show={showViewModal}
          onHide={handleCloseModal}
          applicantId={selectedId}
        />
      )} */}
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={confirmDelete}
        loader={loader}
      />
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <Row className="flex">
                  <Row className="mt-1 fw-bold text-dark d-flex align-items-center">
                    <Col
                      sm={12}
                      lg={12}
                      className="flex-wrap mb-2 ml-2 d-flex justify-content-between align-items-center"
                    >
                      <div className="justify-content-start h4 fw-bold">
                        {formTitle}
                      </div>
                      {/* Right Section (Search + Buttons) */}
                      <div className="flex-wrap mr-2 d-flex justify-content-end ">
                        {/* Search Bar */}
                        <div className="col-sm-auto col-12">
                          <input
                            id="search-bar-0"
                            className="h-10 form-control search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>

                        {/* Delete Button (Only if cities are selected) */}
                        {selectedState.length > 1 && (
                          <BaseButton
                            className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
                          >
                            <i className="align-bottom ri-delete-bin-fill" />
                            <ReactTooltip
                              place="bottom"
                              variant="error"
                              content="Delete"
                              anchorId={`Delete ${selectedState.length} Emails`}
                            />
                          </BaseButton>
                        )}

                        {/* Import & Submit Buttons (Stack only on smaller screens) */}
                        <div className="flex-wrap gap-2 d-flex align-items-center">
                          <BaseButton
                            color="success"
                            type="submit"
                            onClick={handleOpenBaseModal}
                            className="ml-2"
                          >
                            <i className="align-bottom ri-add-line me-1" />
                            {submitButtonText}
                          </BaseButton>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <BaseModal
                    show={showBaseModal}
                    onCloseClick={handleCloseClick}
                    setShowBaseModal={setShowBaseModal}
                    onSubmitClick={handleSubmit}
                    modalTitle={editingState ? "Edit State" : "Add State"}
                    submitButtonText={
                      editingState ? "Update State" : "Add State"
                    }
                    closeButtonText="Close"
                    size="lg"
                  >
                    <Row className="inline-block d-flex">
                      <Col xs={12} md={8} lg={6}>
                        <BaseSelect
                          label="Country"
                          name="country_id"
                          className="mb-1 bg-gray-100 cursor-pointer select-border"
                          placeholder="Country"
                          value={countryOptions.find(
                            (option) =>
                              option.id === validation.values.country_id
                          )}
                          handleChange={(selectedOption) => {
                            validation.setFieldValue(
                              "country_id",
                              selectedOption?.id
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          options={countryOptions}
                          error={
                            typeof validation.errors.country_id === "string"
                              ? validation.errors.country_id
                              : undefined
                          }
                          touched={!!validation.touched.country_id}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={6}>
                        <BaseInput
                          label="State Name"
                          name="state_name"
                          className="bg-gray-100 cursor-pointer"
                          type="text"
                          placeholder={InputPlaceHolder("State to be Added")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.state_name}
                          touched={!!validation.touched.state_name}
                          error={
                            typeof validation.errors.state_name === "string"
                              ? validation.errors.state_name
                              : undefined
                          }
                          passwordToggle={false}
                          // disabled={!validation.values.state_name}
                        />
                      </Col>
                    </Row>
                  </BaseModal>
                  <Row>
                    <Col lg={12}>
                      {isLoading ? (
                        <div className="py-4 text-center">
                          <Skeleton count={1} className="mb-5 min-h-10" />
                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <>
                          {state?.length > 0 ? (
                            <TableContainer
                              columns={columns}
                              data={state}
                              customPageSize={50}
                              theadClass="table-light text-muted"
                              totalRecords={totalRecords}
                              pagination={pagination}
                              setPagination={setPagination}
                              loader={loader}
                              customPadding="0.3rem 1.5rem"
                              rowHeight="10px !important"
                            />
                          ) : (
                            <div className="py-4 text-center">
                              <i className="ri-search-line d-block fs-1 text-success"></i>
                              {handleResponse?.dataNotFound}
                            </div>
                          )}
                        </>
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

export default State;
