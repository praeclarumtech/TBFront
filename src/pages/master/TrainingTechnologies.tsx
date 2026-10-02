/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Card, CardBody } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import * as Tooltip from "@radix-ui/react-tooltip";
import Skeleton from "react-loading-skeleton";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseModal from "components/BaseComponents/BaseModal";
import DeleteModal from "components/BaseComponents/DeleteModal";
import EmptyState from "components/BaseComponents/EmptyState";
import TableContainer from "components/BaseComponents/TableContainer";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import {
  addTrainingTechnology,
  deleteTrainingTechnology,
  listTrainingTechnologies,
  updateTrainingTechnology,
} from "api/trainingTechnologyApi";

const { projectTitle, Modules } = appConstants;

const TrainingTechnologies = () => {
  document.title = Modules.TrainingTechnology + " | " + projectTitle;
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAll, setSearchAll] = useState("");

  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const response = await listTrainingTechnologies({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchAll.trim() || undefined,
      });
      if (response?.success) {
        setRows(response.data?.data || []);
        setTotalRecords(response.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(response?.message || "Failed to fetch technologies.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRows, 300);
    return () => clearTimeout(timer);
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .max(80, "Technology name must be 80 characters or fewer.")
        .required("Technology name is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoader(true);
      try {
        const payload = { name: values.name.trim() };
        const response = editing
          ? await updateTrainingTechnology(editing._id, payload)
          : await addTrainingTechnology(payload);
        if (response?.success) {
          toast.success(response.message || "Technology saved.");
          setEditing(null);
          resetForm();
          setShowModal(false);
          fetchRows();
        } else {
          toast.error(response?.message || "Unable to save technology.");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Unable to save technology."
        );
      } finally {
        setLoader(false);
      }
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "Technology",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: { row: { original: any } }) => (
          <div className="flex gap-2">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => {
                      setEditing(cell.row.original);
                      validation.setValues({ name: cell.row.original.name });
                      setShowModal(true);
                    }}
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
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() => {
                      setRowToDelete(cell.row.original);
                      setShowDeleteModal(true);
                    }}
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
    [validation]
  );

  const confirmDelete = async () => {
    if (!rowToDelete?._id) return;
    setLoader(true);
    try {
      const response = await deleteTrainingTechnology(rowToDelete._id);
      if (response?.success) {
        toast.success(response.message || "Technology deleted.");
        fetchRows();
      } else {
        toast.error(response?.message || "Failed to delete technology.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete technology.");
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setRowToDelete(null);
    }
  };

  return (
    <Fragment>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={() => {
          setShowDeleteModal(false);
          setRowToDelete(null);
        }}
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
                  <Row className="fw-bold text-dark h4 d-flex align-items-center">
                    <Col
                      sm={12}
                      md={12}
                      className="justify-between ml-2 d-flex align-items-center"
                    >
                      Training Technologies
                      <div className="justify-end d-flex">
                        <input
                          className="h-10 gap-2 form-control search"
                          placeholder="Search..."
                          value={searchAll}
                          onChange={(event) => {
                            setSearchAll(event.target.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                          }}
                        />
                        <BaseButton
                          color="success"
                          disabled={loader}
                          type="button"
                          loader={loader}
                          className="mx-2"
                          onClick={() => {
                            setEditing(null);
                            validation.resetForm();
                            setShowModal(true);
                          }}
                        >
                          <i className="mx-1 align-bottom ri-add-line" />
                          Add
                        </BaseButton>
                      </div>
                    </Col>
                  </Row>
                  <BaseModal
                    show={showModal}
                    setShowBaseModal={setShowModal}
                    onCloseClick={() => {
                      setShowModal(false);
                      setEditing(null);
                      validation.resetForm();
                    }}
                    onSubmitClick={() => validation.handleSubmit()}
                    modalTitle={editing ? "Edit Technology" : "Add Technology"}
                    submitButtonText={editing ? "Update Technology" : "Add Technology"}
                    closeButtonText="Close"
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Technology Name"
                          name="name"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Technology")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.name}
                          touched={validation.touched.name}
                          error={validation.errors.name}
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
                      ) : rows.length > 0 ? (
                        <TableContainer
                          columns={columns}
                          data={rows}
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
                        <EmptyState />
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

export default TrainingTechnologies;
