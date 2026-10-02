/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { Col, Row } from "react-bootstrap";
import * as Tooltip from "@radix-ui/react-tooltip";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TableContainer from "components/BaseComponents/TableContainer";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import {
  deleteTrainingApplication,
  getPublicCities,
  getPublicQualifications,
  getPublicStates,
  listTrainingApplications,
  updateTrainingApplication,
} from "api/trainingApplicationApi";
import { listTrainingTechnologies } from "api/trainingTechnologyApi";
import appConstants from "constants/constant";
import {
  APPLICANT_TYPE_OPTIONS,
  DURATION_OPTIONS,
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  SEMESTER_OPTIONS,
  applicantFullName,
  labelFor,
  publicTrainingFormUrl,
  technologyText,
  technologyValues,
} from "./options";

const { projectTitle, Modules } = appConstants;

type Option = { label: string; value: string };

const emptyFilters = {
  technology: "",
  semester: "",
  duration: "",
  interestedFor: "",
  gender: "",
  applicantType: "",
  state: "",
  city: "",
  startDate: "",
  endDate: "",
};

const TrainingApplications = () => {
  document.title = (Modules.TrainingApplication || "Training Applications") + " | " + projectTitle;
  const navigate = useNavigate();
  const handleSendMail = useCallback(
    (record: any) => {
      const email = (record?.email || "").trim();
      if (!email) {
        toast.error("This applicant does not have an email id.");
        return;
      }
      const firstName = record?.name?.firstName?.trim() || "there";
      navigate("/email/compose", {
        state: {
          email_to: email,
          name: applicantFullName(record.name),
          subject: "Training application received",
          description: `<p>Hello ${firstName}, we received your training application.</p>`,
          fromPage: "/training-applications",
        },
      });
    },
    [navigate]
  );
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchAll, setSearchAll] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [technologies, setTechnologies] = useState<Option[]>([]);
  const [qualifications, setQualifications] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchAll(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    );
  }, [searchAll, filters]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await listTrainingApplications({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: searchAll || undefined,
          technology: filters.technology || undefined,
          semester: filters.semester || undefined,
          duration: filters.duration || undefined,
          interestedFor: filters.interestedFor || undefined,
          gender: filters.gender || undefined,
          applicantType: filters.applicantType || undefined,
          state: filters.state || undefined,
          city: filters.city || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        });
        if (response?.success) {
          setRows(response.data?.data || []);
          setTotalRecords(response.data?.pagination?.totalRecords || 0);
        } else {
          toast.error(response?.message || "Failed to fetch applications.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pagination, searchAll, filters, refreshKey]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [technologyBody, stateBody] = await Promise.all([
          listTrainingTechnologies({ page: 1, limit: 1000 }),
          getPublicStates(),
        ]);
        setTechnologies(
          (technologyBody?.data?.data || []).map((item: any) => ({
            label: item.name,
            value: item.name,
          }))
        );
        setStates(
          (stateBody?.data?.item || []).map((item: any) => ({
            label: item.state_name,
            value: item._id,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    loadOptions();
    getPublicQualifications()
      .then((qualificationBody) => {
        setQualifications(
          (qualificationBody?.data?.data || [])
            .map((item: any) => ({
              label: item.degree,
              value: item.degree,
            }))
            .filter((item: Option) => item.label)
        );
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const selectedState = states.find((item) => item.label === filters.state);
    if (!selectedState) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      try {
        const cityBody = await getPublicCities(selectedState.value);
        setCities(
          (cityBody?.data?.item || []).map((item: any) => ({
            label: item.city_name,
            value: item.city_name,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    loadCities();
  }, [filters.state, states]);

  const copyPublicLink = async () => {
    const url = publicTrainingFormUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Public form link copied.");
    } catch {
      toast.error(url);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: ({ row }: any) => (
          <button
            type="button"
            className="p-0 btn btn-link fw-semibold text-decoration-underline"
            onClick={() => setSelected(row.original)}
          >
            {applicantFullName(row.original.name) || "-"}
          </button>
        ),
      },
      {
        header: "Contact",
        accessorKey: "phone",
        enableColumnFilter: false,
        cell: ({ row }: any) =>
          `${row.original.countryCode || "+91"} ${row.original.phone || ""}`.trim(),
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        cell: ({ row }: any) => row.original.email || "-",
      },
      {
        header: "Type",
        accessorKey: "applicantType",
        enableColumnFilter: false,
        cell: ({ row }: any) =>
          labelFor(APPLICANT_TYPE_OPTIONS, row.original.applicantType),
      },
      {
        header: "Gender",
        accessorKey: "gender",
        enableColumnFilter: false,
        cell: ({ row }: any) => labelFor(GENDER_OPTIONS, row.original.gender),
      },
      {
        header: "Technology",
        accessorKey: "technology",
        enableColumnFilter: false,
        cell: ({ row }: any) => technologyText(row.original.technology),
      },
      {
        header: "Duration",
        accessorKey: "duration",
        enableColumnFilter: false,
      },
      {
        header: "Interested for",
        accessorKey: "interestedFor",
        enableColumnFilter: false,
        cell: ({ row }: any) => labelFor(INTEREST_OPTIONS, row.original.interestedFor),
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: ({ row }: any) =>
          row.original.createdAt
            ? moment(row.original.createdAt).format("DD MMM YYYY")
            : "-",
      },
      {
        header: "Action",
        enableColumnFilter: false,
        cell: ({ row }: any) => (
          <div className="d-flex gap-2">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="btn btn-sm btn-soft-primary"
                    onClick={() => setSelected(row.original)}
                  >
                    <i className="ri-eye-line" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                  >
                    View
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-white btn btn-sm btn-soft-success bg-primary"
                    onClick={() => setEditing(row.original)}
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
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-white btn btn-sm btn-soft-info bg-info"
                    onClick={() => handleSendMail(row.original)}
                  >
                    <i className="align-bottom ri-mail-send-line" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-info"
                  >
                    Send mail
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() => setPendingDelete(row.original)}
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
    [handleSendMail]
  );

  const selectValue = (options: Option[], value: string) =>
    options.find((option) => option.value === value || option.label === value) ||
    null;

  const setFilter = (key: keyof typeof emptyFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" ? { city: "" } : {}),
    }));
  };

  const confirmDelete = async () => {
    if (!pendingDelete?._id) return;
    setDeleting(true);
    try {
      const response = await deleteTrainingApplication(pendingDelete._id);
      if (response?.success) {
        toast.success(response?.message || "Application deleted.");
        if (selected?._id === pendingDelete._id) setSelected(null);
        setPendingDelete(null);
        setRefreshKey((value) => value + 1);
      } else {
        toast.error(response?.message || "Unable to delete the application.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to delete the application.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto mb-3">
      <DeleteModal
        show={!!pendingDelete}
        onCloseClick={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onDeleteClick={confirmDelete}
        recordId={applicantFullName(pendingDelete?.name)}
        loader={deleting}
      />
      {editing && (
        <EditApplicationModal
          record={editing}
          technologies={technologies}
          qualifications={qualifications}
          states={states}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setRefreshKey((value) => value + 1);
          }}
        />
      )}
      <div className="mt-3 mb-4 px-2 sm:px-0">
        <div className="mb-3 card">
          <div className="card-body">
            <div className="row gy-2 gx-2 align-items-center justify-content-between">
              <div className="col-12 col-md-auto d-flex flex-wrap gap-2 align-items-center">
             
              <h4 className="fw-bold text-dark"> Training Applicants</h4>
              </div>
              <div className="col-12 col-md d-flex flex-wrap gap-2 justify-content-md-end">
              <input
                  className="form-control h-10 px-2 border rounded"
                  style={{ maxWidth: 260 }}
                  placeholder="Search name, email, phone, city..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                /> 
              <button type="button" className="btn btn-outline-primary" onClick={copyPublicLink}>
                  Copy public form link
                </button>
             
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setDrawerOpen(true)}
                >
                  <i className="mx-1 fa fa-filter" /> Filters
                </button>
            
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: "100vw", sm: 380 }, padding: "16px" }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ mb: 1 }}>
            <Close />
          </IconButton>
          <Row className="align-items-center mb-3">
            <Col>
              <h3 className="mb-0">Apply Filters</h3>
            </Col>
            <Col className="text-end">
              <BaseButton color="primary" onClick={() => setFilters(emptyFilters)}>
                Reset
              </BaseButton>
            </Col>
          </Row>
          <BaseSelect
            label="Technology"
            name="technology"
            placeholder="All technologies"
            options={technologies}
            value={selectValue(technologies, filters.technology)}
            handleChange={(option: Option | null) =>
              setFilter("technology", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="Semester"
            name="semester"
            placeholder="All semesters"
            options={SEMESTER_OPTIONS}
            value={selectValue(SEMESTER_OPTIONS, filters.semester)}
            handleChange={(option: Option | null) =>
              setFilter("semester", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="Duration"
            name="duration"
            placeholder="All durations"
            options={DURATION_OPTIONS}
            value={selectValue(DURATION_OPTIONS, filters.duration)}
            handleChange={(option: Option | null) =>
              setFilter("duration", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="Interested for"
            name="interestedFor"
            placeholder="All"
            options={INTEREST_OPTIONS}
            value={selectValue(INTEREST_OPTIONS, filters.interestedFor)}
            handleChange={(option: Option | null) =>
              setFilter("interestedFor", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="Gender"
            name="gender"
            placeholder="All"
            options={GENDER_OPTIONS}
            value={selectValue(GENDER_OPTIONS, filters.gender)}
            handleChange={(option: Option | null) =>
              setFilter("gender", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="Student / Employee / Other"
            name="applicantType"
            placeholder="All"
            options={APPLICANT_TYPE_OPTIONS}
            value={selectValue(APPLICANT_TYPE_OPTIONS, filters.applicantType)}
            handleChange={(option: Option | null) =>
              setFilter("applicantType", option?.value || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="State"
            name="state"
            placeholder="All states"
            options={states}
            value={states.find((option) => option.label === filters.state) || null}
            handleChange={(option: Option | null) =>
              setFilter("state", option?.label || "")
            }
            className="mb-3"
          />
          <BaseSelect
            label="City"
            name="city"
            placeholder="All cities"
            options={cities}
            value={selectValue(cities, filters.city)}
            handleChange={(option: Option | null) =>
              setFilter("city", option?.value || "")
            }
            isDisabled={!filters.state}
            className="mb-3"
          />
          <BaseInput
            label="Start Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            handleChange={(event) => setFilter("startDate", event.target.value)}
            className="mb-3"
          />
          <BaseInput
            label="End Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            handleChange={(event) => setFilter("endDate", event.target.value)}
          />
        </Box>
      </Drawer>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="py-4 text-center">
              <Skeleton count={1} className="mb-5 min-h-10" />
              <Skeleton count={5} />
            </div>
          ) : (
            <TableContainer
              isHeaderTitle={false}
              columns={columns}
              data={rows}
              customPageSize={pagination.pageSize}
              theadClass="table-light text-muted"
              tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover"
              totalRecords={totalRecords}
              pagination={pagination}
              setPagination={setPagination}
              loader={loading}
              customPadding="0.3rem 1.5rem"
            />
          )}
        </div>
      </div>

      <Modal
        open={!!selected}
        footer={null}
        title={null}
        closable={false}
        onCancel={() => setSelected(null)}
        width={760}
        styles={{
          header: { display: "none" },
          content: { padding: 0, overflow: "hidden", borderRadius: 16 },
          body: { padding: 0 },
        }}
      >
        {selected && (
          <ApplicationProfile
            record={selected}
            onClose={() => setSelected(null)}
            onEdit={() => {
              setEditing(selected);
              setSelected(null);
            }}
            onSendMail={() => {
              handleSendMail(selected);
              setSelected(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

const editValidationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required."),
  middleName: Yup.string().trim(),
  lastName: Yup.string().trim().required("Last name is required."),
  phone: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")
    .required("Contact number is required."),
  email: Yup.string()
    .trim()
    .test(
      "email-optional",
      "Enter a valid email id.",
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
  technology: Yup.string().trim(),
  qualification: Yup.string().trim(),
  collegeName: Yup.string().trim(),
  semester: Yup.string().trim(),
  duration: Yup.string().required("Duration is required."),
  interestedFor: Yup.string().required("Select online, offline, or hybrid."),
  gender: Yup.string().required("Gender is required."),
  applicantType: Yup.string().required("Select student, employee, or other."),
  state: Yup.string().trim().required("State is required."),
  city: Yup.string().trim().required("City is required."),
  address: Yup.string().trim().required("Address is required."),
});

const formFromRecord = (record: any) => ({
  firstName: record?.name?.firstName || "",
  middleName: record?.name?.middleName || "",
  lastName: record?.name?.lastName || "",
  phone: record?.phone || "",
  email: record?.email || "",
  technology: technologyValues(record?.technology)[0] || "",
  interestedFor: record?.interestedFor || "",
  qualification: record?.qualification || "",
  collegeName: record?.collegeName || "",
  semester: record?.semester || "",
  duration: record?.duration || "15 Days",
  gender: record?.gender || "",
  applicantType: record?.applicantType || "",
  state: record?.state || "",
  city: record?.city || "",
  address: record?.address || "",
});

const EditApplicationModal = ({
  record,
  technologies,
  qualifications,
  states,
  onClose,
  onSaved,
}: {
  record: any;
  technologies: Option[];
  qualifications: Option[];
  states: Option[];
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [saving, setSaving] = useState(false);
  const [cities, setCities] = useState<Option[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: formFromRecord(record),
    validationSchema: editValidationSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const response = await updateTrainingApplication(record._id, {
          name: {
            firstName: values.firstName.trim(),
            middleName: values.middleName.trim(),
            lastName: values.lastName.trim(),
          },
          countryCode: record.countryCode || "+91",
          phone: values.phone.trim(),
          email: values.email.trim(),
          technology: values.technology,
          interestedFor: values.interestedFor,
          qualification: values.qualification.trim(),
          collegeName: values.collegeName.trim(),
          semester: values.semester,
          duration: values.duration,
          gender: values.gender,
          applicantType: values.applicantType,
          state: values.state,
          city: values.city,
          address: values.address.trim(),
        });
        if (response?.success) {
          toast.success(response?.message || "Application updated.");
          onSaved();
        } else {
          toast.error(response?.message || "Unable to update the application.");
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        toast.error(
          details?.[0] ||
            error?.response?.data?.message ||
            "Unable to update the application."
        );
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    const selectedState = states.find((item) => item.label === validation.values.state);
    if (!selectedState) {
      setCities([]);
      setCityLoading(false);
      return;
    }
    let cancelled = false;
    const loadCities = async () => {
      setCityLoading(true);
      try {
        const cityBody = await getPublicCities(selectedState.value);
        if (cancelled) return;
        setCities(
          (cityBody?.data?.item || []).map((item: any) => ({
            label: item.city_name,
            value: item.city_name,
          }))
        );
      } catch (error) {
        console.error(error);
        if (!cancelled) setCities([]);
      } finally {
        if (!cancelled) setCityLoading(false);
      }
    };
    loadCities();
    return () => {
      cancelled = true;
    };
  }, [validation.values.state, states]);

  const selectValue = (options: Option[], value: string) =>
    options.find((option) => option.value === value || option.label === value) ||
    null;

  const fieldError = (name: keyof ReturnType<typeof formFromRecord>) =>
    validation.touched[name] && validation.errors[name]
      ? String(validation.errors[name])
      : "";

  const cityOptions =
    validation.values.city &&
    !cities.some((option) => option.value === validation.values.city)
      ? [{ label: validation.values.city, value: validation.values.city }, ...cities]
      : cities;

  const qualificationOptions =
    validation.values.qualification &&
    !qualifications.some((option) => option.value === validation.values.qualification)
      ? [
          ...qualifications,
          {
            label: validation.values.qualification,
            value: validation.values.qualification,
          },
        ]
      : qualifications;

  return (
    <Modal
      open
      title="Edit application"
      onCancel={onClose}
      width={860}
      maskClosable={!saving}
      footer={
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={saving}
            onClick={() => validation.handleSubmit()}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <div className="row g-3">
        <div className="col-md-4">
          <BaseInput
            label="First name"
            name="firstName"
            type="text"
            isRequired
            placeholder="Enter first name"
            value={validation.values.firstName}
            handleChange={validation.handleChange}
            handleBlur={validation.handleBlur}
            touched={!!validation.touched.firstName}
            error={fieldError("firstName")}
          />
        </div>
        <div className="col-md-4">
          <BaseInput
            label="Middle name"
            name="middleName"
            type="text"
            placeholder="Enter middle name"
            value={validation.values.middleName}
            handleChange={validation.handleChange}
            handleBlur={validation.handleBlur}
            touched={!!validation.touched.middleName}
            error={fieldError("middleName")}
          />
        </div>
        <div className="col-md-4">
          <BaseInput
            label="Last name"
            name="lastName"
            type="text"
            isRequired
            placeholder="Enter last name"
            value={validation.values.lastName}
            handleChange={validation.handleChange}
            handleBlur={validation.handleBlur}
            touched={!!validation.touched.lastName}
            error={fieldError("lastName")}
          />
        </div>
        <div className="col-md-6">
          <BaseInput
            label="Contact number"
            name="phone"
            type="text"
            isRequired
            placeholder="Enter contact number"
            value={validation.values.phone}
            handleChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
              validation.setFieldValue("phone", digits);
            }}
            handleBlur={validation.handleBlur}
            touched={!!validation.touched.phone}
            error={fieldError("phone")}
          />
        </div>
        <div className="col-md-6">
          <BaseInput
            label="Email id"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={validation.values.email}
            handleChange={validation.handleChange}
            handleBlur={validation.handleBlur}
            touched={!!validation.touched.email}
            error={fieldError("email")}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Gender"
            name="gender"
            isRequired
            placeholder="Select gender"
            options={GENDER_OPTIONS}
            value={selectValue(GENDER_OPTIONS, validation.values.gender)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("gender", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("gender", true)}
            touched={!!validation.touched.gender}
            error={fieldError("gender")}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Student / Employee / Other"
            name="applicantType"
            isRequired
            placeholder="Select one"
            options={APPLICANT_TYPE_OPTIONS}
            value={selectValue(APPLICANT_TYPE_OPTIONS, validation.values.applicantType)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("applicantType", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("applicantType", true)}
            touched={!!validation.touched.applicantType}
            error={fieldError("applicantType")}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Technology"
            name="technology"
            placeholder="Select a technology"
            options={technologies}
            value={
              selectValue(technologies, validation.values.technology) ||
              (validation.values.technology
                ? {
                    label: validation.values.technology,
                    value: validation.values.technology,
                  }
                : null)
            }
            handleChange={(option: Option | null) =>
              validation.setFieldValue("technology", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("technology", true)}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Qualification"
            name="qualification"
            placeholder="Select qualification"
            options={qualificationOptions}
            value={selectValue(qualificationOptions, validation.values.qualification)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("qualification", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("qualification", true)}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
          />
        </div>
        <div className="col-md-6">
          <BaseInput
            label="College name"
            name="collegeName"
            type="text"
            placeholder="Enter college name"
            value={validation.values.collegeName}
            handleChange={validation.handleChange}
            handleBlur={validation.handleBlur}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Semester"
            name="semester"
            placeholder="Select semester"
            options={SEMESTER_OPTIONS}
            value={selectValue(SEMESTER_OPTIONS, validation.values.semester)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("semester", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("semester", true)}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Duration"
            name="duration"
            isRequired
            placeholder="Select duration"
            options={DURATION_OPTIONS}
            value={selectValue(DURATION_OPTIONS, validation.values.duration)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("duration", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("duration", true)}
            touched={!!validation.touched.duration}
            error={fieldError("duration")}
          />
        </div>
        <div className="col-md-6">
          <BaseSelect
            label="Interested for"
            name="interestedFor"
            isRequired
            placeholder="Select online, offline, or hybrid"
            options={INTEREST_OPTIONS}
            value={selectValue(INTEREST_OPTIONS, validation.values.interestedFor)}
            handleChange={(option: Option | null) =>
              validation.setFieldValue("interestedFor", option?.value || "")
            }
            handleBlur={() => validation.setFieldTouched("interestedFor", true)}
            touched={!!validation.touched.interestedFor}
            error={fieldError("interestedFor")}
          />
        </div>
        <div className="col-md-6">
          {states.length > 0 ? (
            <BaseSelect
              label="State"
              name="state"
              isRequired
              placeholder="Select state"
              options={states}
              value={states.find((option) => option.label === validation.values.state) || null}
              handleChange={(option: Option | null) => {
                validation.setFieldValue("state", option?.label || "");
                validation.setFieldValue("city", "");
              }}
              handleBlur={() => validation.setFieldTouched("state", true)}
              touched={!!validation.touched.state}
              error={fieldError("state")}
            />
          ) : (
            <BaseInput
              label="State"
              name="state"
              type="text"
              isRequired
              placeholder="Enter state"
              value={validation.values.state}
              handleChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              touched={!!validation.touched.state}
              error={fieldError("state")}
            />
          )}
        </div>
        <div className="col-md-6">
          {states.length > 0 && (cityLoading || cities.length > 0 || validation.values.city) ? (
            <BaseSelect
              label="City"
              name="city"
              isRequired
              placeholder={cityLoading ? "Loading cities..." : "Select city"}
              options={cityOptions}
              value={selectValue(cityOptions, validation.values.city)}
              handleChange={(option: Option | null) =>
                validation.setFieldValue("city", option?.value || "")
              }
              handleBlur={() => validation.setFieldTouched("city", true)}
              touched={!!validation.touched.city}
              error={fieldError("city")}
              isDisabled={!validation.values.state || cityLoading}
            />
          ) : (
            <BaseInput
              label="City"
              name="city"
              type="text"
              isRequired
              placeholder="Enter city"
              value={validation.values.city}
              handleChange={validation.handleChange}
              handleBlur={validation.handleBlur}
              touched={!!validation.touched.city}
              error={fieldError("city")}
            />
          )}
        </div>
        <div className="col-12">
          <label className="font-semibold text-gray-700 form-label" htmlFor="edit-address">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="edit-address"
            name="address"
            rows={3}
            className={`form-control ${fieldError("address") ? "is-invalid" : ""}`}
            placeholder="Enter address"
            value={validation.values.address}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
          />
          {fieldError("address") && (
            <div className="invalid-feedback d-block">{fieldError("address")}</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const initialsFor = (name?: { firstName?: string; lastName?: string }) => {
  const letters = [name?.firstName, name?.lastName]
    .map((part) => part?.trim()?.charAt(0) || "")
    .join("")
    .toUpperCase();
  return letters || "A";
};

const ApplicationProfile = ({
  record,
  onClose,
  onEdit,
  onSendMail,
}: {
  record: any;
  onClose: () => void;
  onEdit: () => void;
  onSendMail: () => void;
}) => {
  const fullName = applicantFullName(record.name) || "Applicant";
  const phone = `${record.countryCode || "+91"} ${record.phone || ""}`.trim();
  const phoneHref = phone.replace(/\s/g, "");
  const submitted = record.createdAt
    ? moment(record.createdAt).format("DD MMM YYYY, hh:mm A")
    : "";
  const location = [record.city, record.state].filter(Boolean).join(", ");

  return (
    <div className="application-profile">
      <div className="application-profile-hero">
        <button type="button" className="application-profile-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="application-profile-avatar" aria-hidden>
          {initialsFor(record.name)}
        </div>
        <div className="application-profile-identity">
          <h2>{fullName}</h2>
          <div className="application-profile-tags">
            <span>{labelFor(APPLICANT_TYPE_OPTIONS, record.applicantType)}</span>
            <span>{labelFor(GENDER_OPTIONS, record.gender)}</span>
            {technologyValues(record.technology).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          {submitted ? <p>Submitted on {submitted}</p> : null}
        </div>
      </div>

      <div className="application-profile-body">
        <section>
          <h3>Contact</h3>
          <div className="application-profile-grid">
            <ProfileItem label="Phone">
              {record.phone ? <a href={`tel:${phoneHref}`}>{phone}</a> : "-"}
            </ProfileItem>
            <ProfileItem label="Email">
              {record.email ? <a href={`mailto:${record.email}`}>{record.email}</a> : "-"}
            </ProfileItem>
          </div>
        </section>

        <section>
          <h3>Training</h3>
          <div className="application-profile-grid">
            <ProfileItem label="Technology">{technologyText(record.technology)}</ProfileItem>
            <ProfileItem label="Duration">{record.duration || "-"}</ProfileItem>
            <ProfileItem label="Interested for">
              {labelFor(INTEREST_OPTIONS, record.interestedFor)}
            </ProfileItem>
            <ProfileItem label="Qualification">{record.qualification || "-"}</ProfileItem>
            <ProfileItem label="College">{record.collegeName || "-"}</ProfileItem>
            <ProfileItem label="Semester">{record.semester || "-"}</ProfileItem>
          </div>
        </section>

        <section>
          <h3>Location</h3>
          <div className="application-profile-grid">
            <ProfileItem label="City and state">{location || "-"}</ProfileItem>
            <ProfileItem label="Address">{record.address || "-"}</ProfileItem>
          </div>
        </section>
      </div>

      <div className="application-profile-actions">
        <button type="button" className="btn btn-light" onClick={onClose}>
          Close
        </button>
        <button type="button" className="btn btn-info text-white" onClick={onSendMail}>
          Send mail
        </button>
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Edit application
        </button>
      </div>
      <ProfileStyles />
    </div>
  );
};

const ProfileItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="application-profile-item">
    <div>{label}</div>
    <strong>{children}</strong>
  </div>
);

const ProfileStyles = () => (
  <style>{`
    .application-profile-hero {
      position: relative;
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 24px 24px 20px;
      background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 70%);
      border-bottom: 1px solid #e5e7eb;
    }
    .application-profile-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #475569;
      font-size: 22px;
      line-height: 1;
    }
    .application-profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #4f46e5;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .application-profile-identity h2 {
      margin: 0 36px 8px 0;
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
    }
    .application-profile-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .application-profile-tags span {
      padding: 4px 10px;
      border-radius: 999px;
      background: #fff;
      border: 1px solid #e2e8f0;
      color: #334155;
      font-size: 13px;
      font-weight: 600;
    }
    .application-profile-identity p {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 13px;
    }
    .application-profile-body {
      padding: 8px 24px 4px;
    }
    .application-profile-body section {
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .application-profile-body h3 {
      margin: 0 0 12px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #64748b;
    }
    .application-profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 24px;
    }
    .application-profile-item div {
      margin-bottom: 2px;
      color: #64748b;
      font-size: 13px;
    }
    .application-profile-item strong {
      color: #0f172a;
      font-size: 15px;
      font-weight: 600;
      word-break: break-word;
    }
    .application-profile-item a {
      color: #4338ca;
      text-decoration: none;
    }
    .application-profile-item a:hover { text-decoration: underline; }
    .application-profile-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px 20px;
    }
    @media (max-width: 640px) {
      .application-profile-grid { grid-template-columns: 1fr; }
      .application-profile-hero { align-items: flex-start; }
    }
  `}</style>
);

export default TrainingApplications;
