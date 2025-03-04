import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";

import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  createSkill,
  updateSkill,
  viewAllSkill,
  deleteSkill,
} from "api/skillsApi";
import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { getSerialNumber, InputPlaceHolder } from "utils/commonFunctions";

const { projectTitle, Modules, handleResponse } = appConstants;

const AddSkill = () => {
  document.title = Modules.Login + " | " + projectTitle;
  const [skills, setSkills] = useState<any[]>([]);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<any>(null);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchSkills = async () => {
    try {
      const res = await viewAllSkill({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      if (res?.success) {
        setSkills(res.data.data || []);
        setTotalRecords(res.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch skills");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    validation.setValues({
      addSkills: skill.skills,
    });
    setShowBaseModal(true);
  };

  const handleDelete = (skill: any) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!skillToDelete) return;

    setLoader(true);
    deleteSkill({ _id: skillToDelete._id })
      .then((res: { success: any; message: any }) => {
        if (res?.success) {
          toast.success(res?.message || "Skill deleted successfully");
          fetchSkills();
        } else {
          toast.error(res?.message || "Failed to delete skill");
        }
      })
      .catch((error: any) => {
        toast.error("Something went wrong!");
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
        setShowDeleteModal(false);
        setSkillToDelete(null);
      });
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr.no",
        cell: getSerialNumber,
        enableColumnFilter: false,
      },
      {
        header: "Skill",
        accessorKey: "skills",
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
    []
  );

  const [loader, setLoader] = useState(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      addSkills: editingSkill ? editingSkill.skills : "",
    },
    validationSchema: Yup.object({
      addSkills: Yup.string().required("Skill name is required"),
    }),
    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        _id: editingSkill?._id,
        skills: values.addSkills,
      };

      const apiCall = editingSkill
        ? updateSkill(payload)
        : createSkill(payload);

      apiCall
        .then((res: { success: any; message: any }) => {
          if (res?.success) {
            toast.success(
              res?.message ||
                `Skill ${editingSkill ? "updated" : "added"} successfully`
            );
            setEditingSkill(null);
            validation.resetForm();
            fetchSkills();
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${editingSkill ? "update" : "add"} skill`
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

  const formTitle = editingSkill
    ? "Edit Skill"
    : "Add DropDown Items of Skills";
  const submitButtonText = editingSkill ? "Update" : "Add";

  const handleOpenBaseModal = () => {
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
  };

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
                  <Row className="fw-bold text-dark ms-2 mt-1 h4 d-flex align-items-center">
                    <Col
                      sm={12}
                      md={12}
                      className="d-flex align-items-center justify-between !mb-2"
                    >
                      {formTitle}
                      <BaseButton
                        color="primary"
                        disabled={loader}
                        type="submit"
                        loader={loader}
                        className="ms-3 px-5 border rounded-5"
                        onClick={handleOpenBaseModal}
                      >
                        {submitButtonText}
                      </BaseButton>
                    </Col>
                  </Row>

                  <BaseModal
                    show={showBaseModal}
                    onCloseClick={handleCloseClick}
                    onSubmitClick={handleSubmit}
                    modalTitle={editingSkill ? "Edit Skill" : "Add Skill"}
                    submitButtonText={
                      editingSkill ? "Update Skill" : "Add Skill"
                    }
                    cloaseButtonText="Close"
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Skill Name"
                          name="addSkills"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Skill to be Added")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.addSkills}
                          touched={validation.touched.addSkills}
                          error={validation.errors.addSkills}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                  </BaseModal>
                  <Row>
                    <Col lg={12}>
                      <div>
                        {skills?.length > 0 ? (
                          <TableContainer
                            isHeaderTitle="Skills"
                            columns={columns}
                            data={skills}
                            isGlobalFilter={true}
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

export default AddSkill;
