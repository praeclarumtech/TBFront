/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Yup from "yup";
import { useFormik } from "formik";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import BaseModal from "components/BaseComponents/BaseModal";
import appConstants from "constants/constant";
import { InputPlaceHolder } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  createEmailTemplate,
  deleteEmailTemplate,
  updateEmailTemplate,
  viewEmailTemplate,
} from "api/emailApi";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import sanitizeHtml from "sanitize-html";
const { projectTitle, Modules, handleResponse } = appConstants;

import "react-quill/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const AddEmailTemplate = () => {
  document.title = Modules.EmailTemplate + " | " + projectTitle;
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailTemplateToDelete, setEmailTemplateToDelete] = useState<any>([]);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<
    string[]
  >([]);
  const [searchAll, setSearchAll] = useState<string>("");

  const fetchEmailTemplates = async () => {
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
      const res = await viewEmailTemplate(params);

      if (res?.success) {
        setEmailTemplates(res.data?.templates || []);
        setTotalRecords(res.data?.pagination?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch email templates");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const handleEdit = (emailTemplate: any) => {
    setEditingEmailTemplate(emailTemplate);
    validation.setValues({
      type: emailTemplate.type,
      subject: emailTemplate.subject,
      description: emailTemplate.description,
    });
    setShowBaseModal(true);
  };

  const handleDelete = (emailTemplate: any) => {
    setEmailTemplateToDelete(emailTemplate);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // ("Attempting to delete skills:", skillToDelete);

    if (!emailTemplateToDelete || emailTemplateToDelete.length === 0) {
      toast.error("No email templates selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      // If deleting multiple skills
      if (Array.isArray(emailTemplateToDelete)) {
        const deleteRequests = emailTemplateToDelete.map((id) =>
          deleteEmailTemplate(id)
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
      else if (emailTemplateToDelete._id) {
        const res = await deleteEmailTemplate(emailTemplateToDelete._id);
        if (res?.success) {
          toast.success("Email template deleted successfully");
        } else {
          toast.error("Failed to delete email template");
        }
      }

      fetchEmailTemplates(); // Refresh data
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setEmailTemplateToDelete([]);
      setSelectedEmailTemplates([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedEmailTemplates(
        emailTemplates.map((emailTemplate) => emailTemplate._id)
      ); // Select all
    } else {
      setSelectedEmailTemplates([]); // Unselect all
    }
  };

  const handleSelectApplicant = (emailTemplateId: string) => {
    setSelectedEmailTemplates(
      (prev: string[]) =>
        prev.includes(emailTemplateId)
          ? prev.filter((id) => id !== emailTemplateId) // Unselect if already selected
          : [...prev, emailTemplateId] // Add to selected list
    );
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedEmailTemplates.length === emailTemplates.length &&
              emailTemplates.length > 0
            }
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedEmailTemplates.includes(info.row.original._id)}
            onChange={() => handleSelectApplicant(info.row.original._id)}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Template Name",
        accessorKey: "type",
        enableColumnFilter: false,
      },
      {
        header: "subject",
        accessorKey: "subject",
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        cell: (info: any) => (
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(info.getValue(), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
                allowedAttributes: {
                  a: ["href", "target"],
                  img: ["src", "alt", "style"],
                  span: ["style"],
                  "*": ["style"],
                },
              }),
            }}
            className="overflow-hidden"
          />
        ),
      },
      {
        header: "Action",
        cell: (cell: { row: { original: any } }) => {
          const original = cell.row.original;
          const id = original._id;

          const indexInOriginal = emailTemplates.findIndex(
            (item) => item._id === id
          );

          const shouldShowDelete = indexInOriginal < emailTemplates.length - 10;

          return (
            <div className="gap-2 hstack">
              <Tooltip.Provider delayDuration={50}>
                {/* View Button with Tooltip */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-success bg-primary"
                      onClick={() => handleEdit(original)}
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
                      <Tooltip.Arrow className="fill-[#624bff]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                {shouldShowDelete && (
                  <>
                    {/* Delete Button with Tooltip */}
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          className="btn btn-sm btn-soft-danger bg-danger"
                          onClick={() => handleDelete(original)}
                        >
                          <i className="text-white ri-delete-bin-5-fill" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="bottom"
                          sideOffset={4}
                          className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                        >
                          Delete
                          <Tooltip.Arrow className="fill-[#dc3545]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </>
                )}
              </Tooltip.Provider>
            </div>
          );
        },
      },
    ],
    [selectedEmailTemplates, emailTemplates]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: editingEmailTemplate ? editingEmailTemplate.type : "",
      subject: editingEmailTemplate ? editingEmailTemplate.subject : "",
      description: editingEmailTemplate ? editingEmailTemplate.description : "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Template name is required"),
      subject: Yup.string().required("Subject is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      setLoader(true);

      const rawHtml = values.description; // from React Quill
      const cleanedHtml = sanitizeHtml(rawHtml, {
        allowedTags: [
          "p",
          "b",
          "i",
          "u",
          "strong",
          "em",
          "br",
          "ul",
          "ol",
          "li",
          "a",
          "img",
          "span",
          "blockquote",
          "code",
        ],
        allowedAttributes: {
          a: ["href", "target"],
          img: ["src", "alt", "width", "height", "style"],
          span: ["style"],
          "*": ["style"],
        },
        allowedStyles: {
          "*": {
            color: [/^.*$/],
            "background-color": [/^.*$/],
            "text-align": [/^.*$/],
            "font-weight": [/^.*$/],
            "text-decoration": [/^.*$/],
            "font-style": [/^.*$/],
            "font-size": [/^.*$/],
          },
        },
      });

      const payload = {
        _id: editingEmailTemplate?._id,
        type: values.type,
        subject: values.subject,
        description: cleanedHtml,
      };

      const apiCall = editingEmailTemplate
        ? updateEmailTemplate(payload)
        : createEmailTemplate(payload);

      apiCall
        .then((res: { success: any; message: any }) => {
          if (res?.success) {
            toast.success(
              res?.message ||
                `Email Template ${
                  editingEmailTemplate ? "updated" : "added"
                } successfully`
            );
            setEditingEmailTemplate(null); // Reset editing state
            validation.resetForm(); // Clear form data after submission
            fetchEmailTemplates(); // Refresh data
            setShowBaseModal(false);
          } else {
            toast.error(
              res?.message ||
                `Failed to ${
                  editingEmailTemplate ? "update" : "add"
                } email template`
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

  const submitButtonText = "Add";

  const handleOpenBaseModal = () => {
    setEditingEmailTemplate(null);
    validation.resetForm();
    setShowBaseModal(true);
  };

  const handleSubmit = () => {
    validation.handleSubmit();
  };

  const handleCloseClick = () => {
    setShowBaseModal(false);
    setEditingEmailTemplate(null);
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
    setSelectedEmailTemplates([]);
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
                  <Row className="mt-1 d-flex align-items-center">
                    <Col
                      sm={12}
                      lg={12}
                      className="flex-wrap mb-2 ml-2 d-flex justify-content-between align-items-center"
                    >
                      <div className="justify-content-start h4 fw-bold text-dark">
                        Add Email Template
                      </div>
                      <div className="flex-wrap d-flex justify-content-end ">
                        <div className="col-sm-auto col-12 me-2">
                          <input
                            id="search-bar-0"
                            className="h-10 form-control search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>

                        <div className="flex-wrap d-flex align-items-center">
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
                    modalTitle={
                      editingEmailTemplate
                        ? "Edit Email Template"
                        : "Add Email Template"
                    }
                    submitButtonText={
                      editingEmailTemplate ? "Update Template" : "Add Template"
                    }
                    closeButtonText="Close"
                  >
                    <Row className="mb-3">
                      <Col xs={12}>
                        <BaseInput
                          label="Template Name"
                          name="type"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Enter template name")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.type}
                          touched={!!validation.touched.type}
                          error={
                            typeof validation.errors.type === "string"
                              ? validation.errors.type
                              : undefined
                          }
                          passwordToggle={false}
                        />
                      </Col>

                      <Col xs={12}>
                        <BaseInput
                          label="Subject"
                          name="subject"
                          className="bg-gray-100"
                          type="text"
                          placeholder={InputPlaceHolder("Enter subject")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.subject}
                          touched={!!validation.touched.subject}
                          error={
                            typeof validation.errors.subject === "string"
                              ? validation.errors.subject
                              : undefined
                          }
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs={12}>
                        <ReactQuill
                          theme="snow"
                          value={validation.values.description}
                          onChange={(content) =>
                            validation.setFieldValue("description", content)
                          }
                          onBlur={() =>
                            validation.setFieldTouched("description", true)
                          }
                          modules={quillModules}
                          className="bg-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[300px]"
                          style={{ minHeight: "250px" }}
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
                          {emailTemplates?.length > 0 ? (
                            <TableContainer
                              columns={columns}
                              data={emailTemplates}
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

export default AddEmailTemplate;
