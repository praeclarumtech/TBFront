/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect} from "react";

import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { getSerialNumber, InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  addRoleSkill,
  deleteRoleSkill,
  updateRoleSkill,
  viewRoleSkill,
} from "api/roleApi";
import ViewRoleSkill from "./ViewRoleSkill";

const { projectTitle, Modules, handleResponse } = appConstants;

const UpdateSkill = () => {
  document.title = Modules.SKill + " | " + projectTitle;
  const [roleSkill, setRoleSkills] = useState<any[]>([]);

  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleAndSkillToDelete, setRoleAndSkillToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
 
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchRoleSkills = async () => {
    setIsLoading(true);
    try {
      const res = await viewRoleSkill({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      });

      if (res?.success) {
        setRoleSkills(res?.data?.data || []);
        setTotalRecords(res.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch skills");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleSkills();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleEdit = (roleSkill: any) => {
    setEditingSkill(roleSkill);
    validation.setValues({
      addSkill: roleSkill.skill || "",
      addRole: roleSkill.appliedRole || "",
    });
    setShowBaseModal(true);
  };

  const handleDelete = (skill: any) => {
    setRoleAndSkillToDelete(skill);
    console.log(skill);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roleAndSkillToDelete || roleAndSkillToDelete.length === 0) {
      toast.error("No skills selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      // If deleting multiple skills
      if (Array.isArray(roleAndSkillToDelete)) {
        const deleteRequests = roleAndSkillToDelete.map((id) =>
          deleteRoleSkill({ _id: id })
        );

        // Wait for all delete requests to finish
        const results = await Promise.all(deleteRequests);

        const allSuccess = results.every((res) => res?.success);
        if (allSuccess) {
          toast.success("Skills deleted successfully");
        } else {
          toast.error("Some skills could not be deleted.");
        }
      }
      // If deleting a single skill
      else if (roleAndSkillToDelete._id) {
        const res = await deleteRoleSkill({ _id: roleAndSkillToDelete._id });
        if (res?.success) {
          toast.success("Skill deleted successfully");
        } else {
          toast.error("Failed to delete skill");
        }
      }
      fetchRoleSkills();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setRoleAndSkillToDelete([]);
      setSelectedSkills([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSkills(roleSkill.map((skill) => skill._id)); // Select all
    } else {
      setSelectedSkills([]); // Unselect all
    }
  };

  const handleSelectApplicant = (skillId: string) => {
    setSelectedSkills(
      (prev) =>
        prev.includes(skillId)
          ? prev.filter((id) => id !== skillId) // Unselect if already selected
          : [...prev, skillId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedSkills.length > 1) {
      //   setSkillToDelete([...selectedSkills]);
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
              selectedSkills.length === roleSkill.length && roleSkill.length > 0
            }
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedSkills.includes(info.row.original._id)}
            onChange={() => handleSelectApplicant(info.row.original._id)}
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
        header: "Role",
        accessorKey: "appliedRole",
        enableColumnFilter: false,
      },
      {
        header: "Skill",
        accessorKey: "skill",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell: { row: { original: any } }) => (
          <div className="gap-2 hstack">
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              color="primary"
              className="btn btn-sm btn-soft-success usage-list"
              onClick={() => handleView(cell.row.original)}
            >
              <i className="align-bottom ri-eye-fill" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="View"
                anchorId={`usage-${cell?.row?.original?.id}`}
              />
            </BaseButton>
            <BaseButton
              id={`edit-${cell?.row?.original?._id}`}
              color="secondary"
              className="btn btn-sm btn-soft-warning edit-list"
              onClick={() => handleEdit(cell?.row?.original)}
            >
              <i className="align-bottom ri-pencil-fill" />
            </BaseButton>
            <BaseButton
              color="danger"
              id={`delete-${cell?.row?.original?._id}`}
              className="btn btn-sm btn-soft-danger bg-danger"
              onClick={() => handleDelete(cell?.row?.original)}
            >
              <i className="align-bottom ri-delete-bin-fill" />
            </BaseButton>

            {/* Tooltips should be outside buttons */}
            <ReactTooltip
              place="bottom"
              variant="warning"
              content="Edit"
              anchorId={`edit-${cell?.row?.original?._id}`}
            />
            <ReactTooltip
              place="bottom"
              variant="error"
              content="Delete"
              anchorId={`delete-${cell?.row?.original?._id}`}
            />
          </div>
        ),
      },
    ],
    [selectedSkills, roleSkill]
  );

  const [loader, setLoader] = useState(false);

  const handleView = (id: string) => {
    setSelectedId(id);
    console.log("Seconf ID sndingggggg", id);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      addRole: editingSkill ? editingSkill.appliedRole : "",
      addSkill: editingSkill ? editingSkill.skill : "",
    },
    validationSchema: Yup.object({
      addRole: Yup.string().required("Role is required"),
      addSkill: Yup.string().required("Skill is required"),
    }),
    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        _id: editingSkill?._id, // Pass only if edit
        appliedRole: values.addRole,
        skill: values.addSkill,
      };

      const existingData = roleSkill.find(
        (item) =>
          item.appliedRole.toLowerCase() === values.addRole.toLowerCase() &&
          item.skill.toLowerCase() === values.addSkill.toLowerCase()
      );

      if (existingData && !editingSkill) {
        toast.error("This Role-Skill already exists!");
        setLoader(false);
        return;
      }

      const apiCall = editingSkill
        ? updateRoleSkill(payload)
        : addRoleSkill(payload);

      apiCall
        .then((res) => {
          if (res?.success) {
            toast.success(
              `Role-Skill ${editingSkill ? "updated" : "added"} successfully`
            );
            setEditingSkill(null);
            validation.resetForm();
            fetchRoleSkills();
            setShowBaseModal(false);
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        })
        .catch(() => toast.error("API Error"))
        .finally(() => setLoader(false));
    },
  });

  const formTitle = editingSkill
    ? "Edit Skill"
    : "Add or Update Role and Skills";
  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingSkill(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingSkill(null);
    validation.resetForm();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSkills([]);
  };

  const filteredRoleSkills = roleSkill.filter(
    (skill) =>
      skill.appliedRole.toLowerCase().includes(searchAll.toLowerCase()) ||
      skill.skill.toLowerCase().includes(searchAll.toLowerCase())
  );

  return (
    <Fragment>
      {showViewModal && selectedId && (
        <ViewRoleSkill
          show={showViewModal}
          onHide={handleCloseModal}
          applicantId={selectedId}
        />
      )}
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
                        )}

                        {/* Import & Submit Buttons (Stack only on smaller screens) */}
                        <div className="flex-wrap gap-2 d-flex align-items-center">
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
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <BaseModal
                    show={showBaseModal}
                    onCloseClick={handleCloseClick}
                    setShowBaseModal={setShowBaseModal}
                    onSubmitClick={handleSubmit}
                    modalTitle={editingSkill ? "Edit Skill" : "Add Skill"}
                    submitButtonText={
                      editingSkill ? "Update Skill" : "Add Skill"
                    }
                    closeButtonText="Close"
                    size="lg"
                  >
                    <Row className="inline-block d-flex">
                      <Col xs={12} md={8} lg={6}>
                        <BaseInput
                          label="Role Name"
                          name="addRole"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Role to be Added")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.addRole}
                          touched={!!validation.touched.addRole}
                          error={
                            typeof validation.errors.addRole === "string"
                              ? validation.errors.addRole
                              : undefined
                          }
                          //   value={"lol"}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={6}>
                        <BaseInput
                          label="Skill Name"
                          name="addSkill"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Skill to be Added")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.addSkill}
                          touched={!!validation.touched.addSkill}
                          error={
                            typeof validation.errors.addSkill === "string"
                              ? validation.errors.addSkill
                              : undefined
                          }
                          passwordToggle={false}
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
                          {filteredRoleSkills?.length > 0 ? (
                            <TableContainer
                              //   isHeaderTitle="Roles and Skills"
                              columns={columns}
                              data={filteredRoleSkills}
                              // isGlobalFilter={true}
                              customPageSize={50}
                              theadClass="table-light text-muted"
                              // SearchPlaceholder="Search..."
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

export default UpdateSkill;
