import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";
import { Modules } from "components/constants/enum";
import {
  handleResponse,
  InputPlaceHolder,
  projectTitle,
} from "components/constants/common";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Loader } from "react-feather";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  createSkill,
  updateSkill,
  viewAllSkill,
  deleteSkill,
} from "api/skillsApi";
import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";

const AddSkill = () => {
  document.title = Modules.Login + " | " + projectTitle;
  const [skills, setSkills] = useState<any[]>([]);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<any>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    viewAllSkill()
      .then((res: { success: any; data: { getskills: any }; message: any }) => {
        if (res?.success) {
          setSkills(res.data.getskills || []);
        } else {
          toast.error(res?.message || "Failed to fetch skills");
        }
      })
      .catch((error: any) => {
        toast.error("Something went wrong!");
        console.error(error);
      });
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    validation.setValues({
      addSkills: skill.skills,
    });
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
        accessorKey: "_id",
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
              id={`delete-${cell?.row?.original?._id}`}
              className="btn btn-sm btn-soft-danger delete-list"
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
      addSkills: "",
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
            validation.resetForm();
            setEditingSkill(null);
            fetchSkills();
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
                  <Row className="fw-bold text-dark ms-2 mt-1 h4">
                    <Col xl={5} sm={12} md={4} lg={2} className="!mb-2">
                      {formTitle}
                    </Col>
                  </Row>
                  <Row className="ms-2">
                    <Col xs={9} md={5} lg={5}>
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
                  <Row className="mt-3 ms-2">
                    <Col
                      xs={9}
                      md={5}
                      lg={5}
                      className="d-flex justify-content-end px-1"
                    >
                      <BaseButton
                        color=" "
                        className="btn btn-outline-dark border-1 rounded-5"
                        type="button"
                        onClick={() => validation.resetForm()}
                      >
                        Cancel
                      </BaseButton>
                      <BaseButton
                        color="success"
                        disabled={loader}
                        type="submit"
                        loader={loader}
                        className="ms-3 px-5 border rounded-5"
                        onClick={() => validation.handleSubmit()}
                      >
                        {submitButtonText}
                      </BaseButton>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Card id="addedSkillList">
                        {loader ? (
                          <Loader />
                        ) : (
                          <div className="card-body pt-0">
                            <div>
                              {skills?.length > 0 ? (
                                <TableContainer
                                  isHeaderTitle="Skills"
                                  columns={columns}
                                  data={skills}
                                  isGlobalFilter={true}
                                  customPageSize={5}
                                  theadClass="table-light text-muted"
                                  SearchPlaceholder="Search..."
                                />
                              ) : (
                                <div className="py-4 text-center">
                                  <i className="ri-search-line d-block fs-1 text-success"></i>
                                  {handleResponse?.dataNotFound}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
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
