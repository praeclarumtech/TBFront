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

import { viewAllState } from "api/stateApi";
import { SelectedOption1 } from "interfaces/applicant.interface";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { createCity, deleteCity, updateCity, viewAllCity } from "api/cityApis";

const { projectTitle, Modules, handleResponse } = appConstants;

const City = () => {
  document.title = Modules.City + " | " + projectTitle;
  const [city, setCity] = useState<any[]>([]);
  const [editingCity, setEditingCity] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState<SelectedOption1[]>([]);

  const [selectedcountry, setSelectedCountry] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  //   const [selectedId, setSelectedId] = useState<string | null>(null);
  //   const [showViewModal, setShowViewModal] = useState(false);

  const fetchState = async () => {
    try {
      setIsLoading(true);
      //  const allSkills: any[] = [];
      const page = 1;
      const pageSize = 50;
      const limit = 500;
      const response = await viewAllState({
        page,
        pageSize,
        limit,
      });

      const stateData = response?.data?.item || [];

      setStateOptions(
        stateData.map((item: any) => ({
          label: item.state_name,
          value: item.state_name, // match what you'll use in selected
          id: item._id, // if needed
        }))
      );
    } catch (error) {
      errorHandle(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCity = async () => {
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

      const res = await viewAllCity(params);

      if (res?.success) {
        setCity(res?.data?.item || []);
        setTotalRecords(res.data?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch Cities");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCity();
    fetchState();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const handleDelete = (city: any) => {
    setCityToDelete(city);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!cityToDelete || cityToDelete.length === 0) {
      toast.error("No city selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      // If deleting multiple skills
      if (Array.isArray(cityToDelete)) {
        const deleteRequests = cityToDelete.map((id) =>
          deleteCity({ _id: id })
        );

        // Wait for all delete requests to finish
        const results = await Promise.all(deleteRequests);

        const allSuccess = results.every((res) => res?.success);
        if (allSuccess) {
          toast.success("Country deleted successfully");
        } else {
          toast.error("Some state could not be deleted.");
        }
      }
      // If deleting a single skill
      else if (cityToDelete._id) {
        const res = await deleteCity({ _id: cityToDelete._id });
        if (res?.success) {
          toast.success(res?.message);
        } else {
          toast.error("Failed to delete city");
        }
      }
      fetchCity();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setCityToDelete([]);
      setSelectedCountry([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCountry(city.map((city) => city._id)); // Select all
    } else {
      setSelectedCountry([]); // Unselect all
    }
  };

  const handleSelectApplicant = (cityId: string) => {
    setSelectedCountry(
      (prev) =>
        prev.includes(cityId)
          ? prev.filter((id) => id !== cityId) // Unselect if already selected
          : [...prev, cityId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedcountry.length > 1) {
      setCityToDelete([...selectedcountry]);
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
            checked={selectedcountry.length === city.length && city.length > 0}
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedcountry.includes(info.row.original._id)}
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
        header: "City",
        accessorKey: "city_name",
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
    [selectedcountry, city]
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
      _id: editingCity ? editingCity._id : "",
      city_name: editingCity ? editingCity.city_name : "",
      state_id: editingCity ? editingCity.state_id : "",
    },
    validationSchema: Yup.object({
      city_name: Yup.string()
        .min(1, "City Name must be at least 1.")
        .max(50, "City name must be between 1 to 50 characters.")
        .required("City is required"),
      state_id: Yup.string().required("State is required"),
    }),
    onSubmit: (values) => {
      setLoader(true);

      const payload = {
        _id: values._id,
        state_id: values.state_id,
        city_name: values.city_name,
      };

      const apiCall = editingCity ? updateCity(payload) : createCity(payload);

      apiCall
        .then((res) => {
          if (res?.success) {
            toast.success(
              // `Role-Skill ${editingSkill ? "updated" : "added"} successfully`
              res?.message
            );
            setEditingCity(null);
            validation.resetForm();
            fetchCity();
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
    setEditingCity(id);
    const selectedState = stateOptions.find(
      (state) => state.id === id.state_id
    );
    validation.setValues({
      _id: id._id || "",
      state_id: selectedState?.value || null, // or use `value` if needed
      city_name: id.city_name || "",
    });

    setShowBaseModal(true);
  };

  const formTitle = editingCity ? "Update City" : "Add City";
  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingCity(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingCity(null);
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
    setSelectedCountry([]);
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

                        {/* Delete Button (Only if skills are selected) */}
                        {selectedcountry.length > 1 && (
                          <BaseButton
                            className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
                          >
                            <i className="align-bottom ri-delete-bin-fill" />
                            <ReactTooltip
                              place="bottom"
                              variant="error"
                              content="Delete"
                              anchorId={`Delete ${selectedcountry.length} Emails`}
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
                    modalTitle={editingCity ? "Edit City" : "Add City"}
                    submitButtonText={editingCity ? "Update City" : "Add City"}
                    closeButtonText="Close"
                    size="lg"
                  >
                    <Row className="inline-block d-flex">
                      <Col xs={12} md={8} lg={6}>
                        <BaseSelect
                          label="State"
                          name="state_id"
                          className="mb-1 bg-gray-100 cursor-pointer select-border"
                          placeholder="Select State"
                          value={stateOptions.find(
                            (option) =>
                              option.value === validation.values.state_id
                          )}
                          handleChange={(selectedOption: { id: any }) => {
                            validation.setFieldValue(
                              "state_id",
                              selectedOption?.id
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          options={stateOptions}
                          error={
                            typeof validation.errors.state_id === "string"
                              ? validation.errors.state_id
                              : undefined
                          }
                          touched={!!validation.touched.state_id}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={6}>
                        <BaseInput
                          label="City Name"
                          name="city_name"
                          className="bg-gray-100 cursor-pointer"
                          type="text"
                          placeholder={InputPlaceHolder("City to be Added")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.city_name}
                          touched={!!validation.touched.city_name}
                          error={
                            typeof validation.errors.city_name === "string"
                              ? validation.errors.city_name
                              : undefined
                          }
                          passwordToggle={false}
                          // disabled={!validation.values.addState}
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
                          {city?.length > 0 ? (
                            <TableContainer
                              columns={columns}
                              data={city}
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

export default City;
