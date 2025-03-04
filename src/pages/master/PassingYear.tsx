import { useEffect, useState, useMemo, Fragment } from "react";
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import TableContainer from "components/BaseComponents/TableContainer";
import { Loader } from "react-feather";
import {
  viewAllPassingYear,
  addPassingYear,
  deletePassingYear,
  editPassingYear,
} from "api/paasingYearApi";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { PassingYearData } from "interfaces/passingYear.interface";

const PassingYear = () => {
  const [passingYears, setPassingYears] = useState([]);
  const [loader, setLoader] = useState(false);
  const [editingYear, setEditingYear] = useState<PassingYearData | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  const fetchPassingYears = async () => {
    setLoader(true);
    try {
      const response = await viewAllPassingYear();
      setPassingYears(response?.data?.item || []);
    } catch (error) {
      toast.error("Error fetching passing years");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPassingYears();
  }, []);

  const validation = useFormik({
    initialValues: { addYear: "" },
    validationSchema: Yup.object({
      addYear: Yup.number()
        .typeError("Year must be a number")
        .integer("Year must be a whole number")
        .min(1900, "Year must be after 1900")
        .max(new Date().getFullYear(), "Year cannot be in the future")
        .required("Year is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoader(true);
      try {
        if (editingYear) {
          await editPassingYear({
            _id: editingYear._id,
            year: Number(values.addYear),
          });
          toast.success("Passing year updated successfully");
        } else {
          await addPassingYear({ year: Number(values.addYear) });
          toast.success("Passing year added successfully");
        }
        fetchPassingYears();
        resetForm();
        setEditingYear(null);
      } catch (error) {
        toast.error("Error saving passing year");
      } finally {
        setLoader(false);
      }
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoader(true);
    try {
      await deletePassingYear({ _id: deleteId });
      toast.success("Passing year deleted successfully");
      fetchPassingYears();
    } catch (error) {
      toast.error("Error deleting passing year");
    } finally {
      setLoader(false);
      setDeleteModal(false);
      setDeleteId(undefined);
    }
  };

  const handleEdit = (yearData: PassingYearData) => {
    validation.setValues({ addYear: yearData.year.toString() });
    setEditingYear(yearData);
  };

  const columns = useMemo(
    () => [
      { header: "Sr.no", accessorKey: "_id", size: "20px" },
      { header: "Year", accessorKey: "year" },
      {
        header: "Action",
        cell: (cell: { row: { original: PassingYearData } }) => (
          <div className="hstack gap-2">
            <BaseButton
              className="btn btn-sm btn-soft-primary"
              onClick={() => handleEdit(cell.row.original)}
            >
              <i className="ri-edit-line align-bottom" />
            </BaseButton>
            <BaseButton
              className="btn btn-sm btn-soft-danger"
              onClick={() => {
                setDeleteId(cell.row.original._id);
                setDeleteModal(true);
              }}
            >
              <i className="ri-delete-bin-6-fill align-bottom" />
            </BaseButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Fragment>
      <Container fluid>
        <Row>
          <Col>
            <Card className="mb-3 my-3">
              <CardBody>
                <Row>
                  <Col xl={5} className="fw-bold h4 ms-4">
                    {editingYear ? "Edit Passing Year" : "Add Passing Year"}
                  </Col>
                </Row>
                <form onSubmit={validation.handleSubmit}>
                  <Row className="ms-2">
                    <Col xs={9} md={5} lg={5}>
                      <BaseInput
                        label="Passing Year"
                        name="addYear"
                        type="text"
                        placeholder="Enter Year"
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.addYear}
                        touched={validation.touched.addYear}
                        error={validation.errors.addYear}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3 ms-2">
                    <Col
                      xs={9}
                      md={5}
                      lg={5}
                      className="d-flex justify-content-end px-1"
                    >
                      <BaseButton
                        className="btn btn-outline-dark text-white"
                        type="button"
                        onClick={() => {
                          validation.resetForm();
                          setEditingYear(null);
                        }}
                      >
                        Cancel
                      </BaseButton>
                      <BaseButton
                        className="ms-3 px-5 btn btn-success"
                        type="submit"
                      >
                        {editingYear ? "Update" : "Add"}
                      </BaseButton>
                    </Col>
                  </Row>
                </form>
                <Row>
                  <Col lg={12}>
                    <Card>
                      {loader ? (
                        <Loader />
                      ) : (
                        <div className="card-body pt-0">
                          {passingYears.length > 0 ? (
                            <TableContainer
                              isHeaderTitle="Passing Year"
                              columns={columns}
                              data={passingYears}
                              isGlobalFilter={true}
                              customPageSize={5}
                              theadClass="table-light text-muted"
                              SearchPlaceholder="Search..."
                            />
                          ) : (
                            <div className="py-4 text-center">
                              <i className="ri-search-line d-block fs-1 text-success" />
                              No passing years found.
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
        recordId={deleteId}
        loader={loader}
      />
    </Fragment>
  );
};

export default PassingYear;
