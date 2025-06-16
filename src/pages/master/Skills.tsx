/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect, useRef } from "react";
// import { read, utils } from "xlsx";
// import toast from "react-hot-toast";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";

import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  createSkill,
  updateSkill,
  viewAllSkill,
  deleteSkill,
  importSkills,
} from "api/skillsApi";
// import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const { projectTitle, Modules, handleResponse } = appConstants;

const AddSkill = () => {
  const navigate = useNavigate();
  document.title = Modules.SKill + " | " + projectTitle;
  const [skills, setSkills] = useState<any[]>([]);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [importLoader, setImportLoader] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");

  const fetchSkills = async () => {
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

      const res = await viewAllSkill(params);

      if (res?.success) {
        setSkills(res.data.data || []);
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
    fetchSkills();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

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

  const confirmDelete = async () => {
    if (!skillToDelete || skillToDelete.length === 0) {
      toast.error("No skills selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      // If deleting multiple skills
      if (Array.isArray(skillToDelete)) {
        const deleteRequests = skillToDelete.map((id) =>
          deleteSkill({ _id: id })
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
      else if (skillToDelete._id) {
        const res = await deleteSkill({ _id: skillToDelete._id });
        if (res?.success) {
          toast.success("Skill deleted successfully");
        } else {
          toast.error("Failed to delete skill");
        }
      }

      fetchSkills(); // Refresh data
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setSkillToDelete([]);
      setSelectedSkills([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSkills(skills.map((skill) => skill._id)); // Select all
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
      setSkillToDelete([...selectedSkills]);
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
              selectedSkills.length === skills.length && skills.length > 0
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
        header: "Skill",
        accessorKey: "skills",
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
    [selectedSkills, skills, pagination]
  );

  const [loader, setLoader] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      addSkills: editingSkill ? editingSkill.skills : "",
    },
    validationSchema: Yup.object({
      addSkills: Yup.string()
        .min(1, "Skill Name must be at least 1.")
        .max(50, "Skill name must be between 1 to 50 characters.")
        .required("Skill name is required"),
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
        .then((res) => {
          if (res?.success) {
            toast.success(
              res?.message ||
                `Skill ${editingSkill ? "updated" : "added"} successfully`
            );
            setEditingSkill(null); // Reset editing state
            validation.resetForm(); // Clear form data after submission
            fetchSkills(); // Refresh data
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${editingSkill ? "update" : "add"} skill`
            );
          }
        })
        .catch(() => {
          toast.error("Something went wrong!");
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  const formTitle = editingSkill ? "Edit Skill" : "Add Skills";
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

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExtension || "")) {
      toast.error("Please upload a valid CSV or Excel file");
      return;
    }

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      const response = await importSkills(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      if (response?.success) {
        toast.success(response?.message || "File imported successfully!");
        await fetchSkills();
      } else {
        throw new Error(response?.message || "Import failed");
      }
    } catch (error: any) {
      if (error.response?.data) {
        // Handle structured API errors
        const errorMessage =
          error.response.data.message || error.response.data.error;
        toast.error(errorMessage || "Failed to import file");
      } else if (error.message) {
        // Handle other errors with messages
        toast.error(error.message);
      } else {
        // Generic error
        toast.error("An unexpected error occurred during import");
      }
    } finally {
      // Reset states
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
    setSelectedSkills([]);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.skills.toLowerCase().includes(searchAll.toLowerCase())
  );

  const handleSkills = (applicantId: string[]) => {
    if (applicantId.length > 0) {
      // navigate(`/dashboard/${applicantId || "0"}`);
      console.log("this is in skillll", applicantId);
      navigate(`/dashboard`, { state: { applicantIds: applicantId } });
    }
  };

  return (
    <Fragment>
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
                      <div className="flex-wrap d-flex justify-content-end ">
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
                          <>
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

                            <BaseButton
                              className="ml-2 text-lg border-0 btn bg-primary edit-list w-fit"
                              onClick={() => handleSkills(selectedSkills)}
                            >
                              View in Chart
                              <ReactTooltip
                                place="bottom"
                                variant="error"
                                content="Delete"
                                anchorId={`Delete ${selectedSkills.length} Emails`}
                              />
                            </BaseButton>
                          </>
                        )}

                        {/* Import & Submit Buttons (Stack only on smaller screens) */}
                        <div className="flex-wrap d-flex align-items-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".csv,.xlsx,.xls"
                            style={{ display: "none" }}
                            onChange={handleFileImport}
                          />
                          <BaseButton
                            color="primary"
                            className="mx-2 position-relative"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={importLoader}
                          >
                            {importLoader ? (
                              <>
                                <i className="align-bottom ri-loader-4-line animate-spin me-1" />
                                {isImporting
                                  ? `Importing... ${importProgress}%`
                                  : "Processing..."}
                              </>
                            ) : (
                              <>
                                <i className="align-bottom ri-download-2-line me-1" />
                                Import
                              </>
                            )}
                            {isImporting && (
                              <div
                                className="bottom-0 progress position-absolute start-0"
                                style={{
                                  height: "4px",
                                  width: "100%",
                                  borderRadius: "0 0 4px 4px",
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: `${importProgress}%` }}
                                  aria-valuenow={importProgress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            )}
                          </BaseButton>

                          <BaseButton
                            color="success"
                            disabled={loader}
                            type="submit"
                            loader={loader}
                            onClick={handleOpenBaseModal}
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
                  >
                    <Row>
                      <Col xs={9} md={5} lg={9}>
                        <BaseInput
                          label="Skill Name"
                          name="addSkills"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Skill to be Added")}
                          // handleChange={validation.handleChange}
                          handleChange={(e) => {
                            const value = e.target.value;
                            const words = value.split(" ");

                            if (words.length === 0) {
                              validation.setFieldValue("addSkills", "");
                              return;
                            }

                            const firstWord =
                              words[0].charAt(0).toUpperCase() +
                              words[0].slice(1);

                            // Keep the rest as the user typed
                            const restWords = words.slice(1);
                            const finalValue = [firstWord, ...restWords].join(
                              " "
                            );

                            validation.setFieldValue("addSkills", finalValue);
                          }}
                          handleBlur={validation.handleBlur}
                          value={validation.values.addSkills}
                          touched={!!validation.touched.addSkills}
                          error={
                            typeof validation.errors.addSkills === "string"
                              ? validation.errors.addSkills
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
                        <div>
                          {skills?.length > 0 ? (
                            <TableContainer
                              // isHeaderTitle="Skills"
                              columns={columns}
                              data={filteredSkills}
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

export default AddSkill;
