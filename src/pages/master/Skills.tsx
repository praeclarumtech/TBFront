/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect, useRef } from "react";
// import { read, utils } from "xlsx";
import toast from "react-hot-toast";
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
  importSkills,
} from "api/skillsApi";
// import { toast } from "react-toastify";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { getSerialNumber, InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const { projectTitle, Modules, handleResponse } = appConstants;

const AddSkill = () => {
  document.title = Modules.SKill + " | " + projectTitle;
  const [skills, setSkills] = useState<any[]>([]);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
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
      const res = await viewAllSkill({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
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
    } finally {
      setIsLoading(false);
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

  // const confirmDelete = () => {
  //   if (!skillToDelete) return;

  //   setLoader(true);
  //   deleteSkill({ _id: skillToDelete._id })
  //     .then((res: { success: any; message: any }) => {
  //       if (res?.success) {
  //         toast.success(res?.message || "Skill deleted successfully");
  //         fetchSkills();
  //       } else {
  //         toast.error(res?.message || "Failed to delete skill");
  //       }
  //     })
  //     .catch((error: any) => {
  //       toast.error("Something went wrong!");
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setLoader(false);
  //       setShowDeleteModal(false);
  //       setSkillToDelete(null);
  //     });
  // };

  const confirmDelete = async () => {
    console.log("Attempting to delete skills:", skillToDelete);

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
    [selectedSkills, skills]
  );

  const [loader, setLoader] = useState(false);

 const validation = useFormik({
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

      const existingSkill = skills.find(
        (skill) => skill.skills.toLowerCase() === values.addSkills.toLowerCase()
     );
     
       if (existingSkill && !editingSkill) {
         toast.error("This skill already exists!");
         setLoader(false);
         return;
       }
     const apiCall = editingSkill ? updateSkill(payload) : createSkill(payload);

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

  const formTitle = editingSkill
    ? "Edit Skill"
    : "Add DropDown Items of Skills";
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

    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExtension || "")) {
      toast.error("Please upload a valid CSV or Excel file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast("Large file detected. Import may take a few minutes.", {
        icon: "⚠️",
        duration: 4000,
      });
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
      console.error("Import error:", error);

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
  };

  const filteredSkills = skills.filter((skill) =>
    skill.skills.toLowerCase().includes(searchAll.toLowerCase())
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
                  <Row className="fw-bold text-dark mt-1 h4 d-flex align-items-center">
                    <Col
                      sm={12}
                      md={12}
                      className="d-flex justify-content-between ml-2 !mb-2"
                    >
                      {formTitle}
                      <div className="d-flex justify-end">
                        <div>
                          <input
                            id="search-bar-0"
                            className="form-control search h-10 "
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>
                        {selectedSkills.length > 1 && (
                          <BaseButton
                            className="btn text-lg bg-danger edit-list ml-2 w-fit border-0"
                            onClick={handleDeleteAll}
                          >
                            <i className="ri-delete-bin-fill align-bottom" />
                            <ReactTooltip
                              place="bottom"
                              variant="error"
                              content="Delete"
                              anchorId={`Delete ${selectedSkills.length} Emails`}
                            />
                          </BaseButton>
                        )}
                        <div className="d-flex justify-content-end">
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
                                <i className="ri-loader-4-line animate-spin align-bottom me-1" />
                                {isImporting
                                  ? `Importing... ${importProgress}%`
                                  : "Processing..."}
                              </>
                            ) : (
                              <>
                                <i className="ri-upload-2-line align-bottom me-1" />
                                Import
                              </>
                            )}
                            {isImporting && (
                              <div
                                className="progress position-absolute bottom-0 start-0"
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
                            // className="ms-3 px-5 border rounded-5"
                            onClick={handleOpenBaseModal}
                          >
                            <i className="ri-add-line align-bottom me-1" />
                            {submitButtonText}
                          </BaseButton>
                        </div>{" "}
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
                          handleChange={validation.handleChange}
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
                        <div className="text-center py-4">
                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <div>
                          {skills?.length > 0 ? (
                            <TableContainer
                              isHeaderTitle="Skills"
                              columns={columns}
                              data={filteredSkills}
                              // isGlobalFilter={true}
                              customPageSize={10}
                              theadClass="table-light text-muted"
                              // SearchPlaceholder="Search..."
                              totalRecords={totalRecords}
                              pagination={pagination}
                              setPagination={setPagination}
                              loader={loader}
                              customPadding="0.3rem 1.5rem"
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
