import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnConfig } from "interfaces/global.interface";
import { SelectedOption } from "interfaces/applicant.interface";
import moment from "moment";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import {
    listOfApplicants,
    updateStage,
    updateStatus,
    updateApplicant,
    deleteMultipleApplicant,
    ExportApplicant,
} from "api/applicantApi";
import { activeApplicant, inActiveApplicant } from "api/apiActive";
import {
    dynamicFind,
    errorHandle,
    getCurrentUserRole,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import {
    truncateText,
    toolipComponents,
    customStyles,
} from "styles/applicantStyles";
import {
    buildApplicantParams,
    ChartParams,
    FilterState,
} from "utils/applicantUtils";
import toastify from "utils/toastify";

const { interviewStageOptions, statusOptions } = appConstants;

interface Applicant {
  _id: string;
  name?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
  appliedSkills?: string[];
  appliedRole?: string;
  totalExperience?: number;
  currentCity?: string;
  gender?: string;
  qualification?: string;
  workPreference?: string;
  currentPkg?: number;
  expectedPkg?: number;
  noticePeriod?: number;
  createdAt?: string;
  updatedAt?: string;
  relevantSkillExperience?: number;
  communicationSkill?: number;
  lastFollowUpDate?: string;
  interviewStage?: string;
  status?: string;
  isActive?: boolean;
  isFavorite?: boolean;
}

interface UseApplicantParams {
  filters: FilterState;
  pagination: { pageIndex: number; pageSize: number };
  chartParams: ChartParams;
  availableColumns: ColumnConfig[];
  onView?: (id: string, source: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEmail?: (id: string, applicantData?: any) => void;
  onToggleFavorite?: (isFav: boolean, id: string) => void;
  onToggleSwitch?: (id: string, isActive: boolean) => void;
}

function useApplicant({
  filters,
  pagination,
  chartParams,
  availableColumns,
  onView,
  onEdit,
  onDelete,
  onEmail,
  onToggleFavorite,
  onToggleSwitch,
}: UseApplicantParams) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentRole = getCurrentUserRole();
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  // Build query params for API call
  const queryParams = useMemo(() => {
    return buildApplicantParams(filters, pagination, chartParams);
  }, [filters, pagination, chartParams]);

  const {
    data: applicantsData,
    isLoading: isDataLoading,
    refetch: refetchApplicants,
  } = useQuery({
    queryKey: ["applicants", queryParams],
    queryFn: async () => {
      const response = await listOfApplicants(queryParams);
      if (response.success === false) {
        toastify(response.message, { type: "error" });
        return { data: { item: [], results: [], totalRecords: 0 } };
      }
      return response;
    },
  });

  const { mutateAsync: updateStageMutation, isPending: isUpdatingStage } =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: { interviewStage: string };
      }) => updateStage(data, id),
      onSuccess: () => {
        toastify("Applicant Interview Stage updated successfully!", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["applicants"] });
      },
      onError: (error: any) => {
        errorHandle(error);
      },
    });

  const { mutateAsync: updateStatusMutation, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: { status: string } }) =>
        updateStatus(data, id),
      onSuccess: () => {
        toastify("Applicant status updated successfully!", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["applicants"] });
      },
      onError: (error: any) => {
        errorHandle(error);
      },
    });

  const {
    mutateAsync: updateApplicantMutation,
    isPending: isUpdatingApplicant,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateApplicant(data, id),
    onSuccess: () => {
      toastify("Applicant updated successfully!", { type: "success" });
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    onError: (error: any) => {
      errorHandle(error);
    },
  });

  const { mutateAsync: deleteMultipleMutation, isPending: isDeletingMultiple } =
    useMutation({
      mutationFn: (ids: string[]) => deleteMultipleApplicant(ids),
      onSuccess: () => {
        toastify("Applicants deleted successfully!", { type: "success" });
        setSelectedApplicants([]);
        queryClient.invalidateQueries({ queryKey: ["applicants"] });
      },
      onError: (error: any) => {
        errorHandle(error);
      },
    });

  const {
    mutateAsync: toggleActiveStatusMutation,
    isPending: isTogglingActive,
  } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? activeApplicant(id) : inActiveApplicant(id),
    onSuccess: (_response: any, variables: { id: string; isActive: boolean }) => {
      toastify(
        `Applicant ${
          variables.isActive ? "activated" : "deactivated"
        } successfully!`
      , { type: "success" });
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    onError: (error: any) => {
      errorHandle(error);
    },
  });

  const { mutateAsync: exportApplicantsMutation, isPending: isExporting } =
    useMutation({
      mutationFn: ({ params, payload }: { params: any; payload: any }) =>
        ExportApplicant(params, payload),
      onSuccess: (response: any) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `applicants_${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toastify("Applicants exported successfully!", { type: "success" });
      },
      onError: (error: any) => {
        toastify(
          error.response?.data?.message || "Failed to export applicants"
        , { type: "error" });
      },
    });

  const handleView = useCallback(
    (id: string, source: string) => {
      if (onView) {
        onView(id, source);
      } else {
        navigate(`/applicant/view/${id}`, { state: { source } });
      }
    },
    [navigate, onView]
  );

  const handleEdit = useCallback(
    (id: string) => {
      if (onEdit) {
        onEdit(id);
      } else {
        navigate(`/applicant/edit/${id}`);
      }
    },
    [navigate, onEdit]
  );

  const handleDeleteSingle = useCallback(
    (id: string) => {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteMultipleMutation([id]);
      }
    },
    [deleteMultipleMutation, onDelete]
  );

  const handleEmail = useCallback(
    (id: string) => {
      if (onEmail) {
        const selectedApplicant =
          applicantsData?.data?.item?.find(
            (app: Applicant) => app._id === id
          ) ||
          applicantsData?.data?.results?.find(
            (app: Applicant) => app._id === id
          );
        onEmail(id, selectedApplicant);
      } else {
        navigate(`/applicant/email/${id}`);
      }
    },
    [navigate, onEmail, applicantsData]
  );

  const handleSelectApplicant = useCallback((id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const currentApplicants =
      applicantsData?.data?.item || applicantsData?.data?.results || [];
    if (selectedApplicants.length === currentApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(currentApplicants.map((app: Applicant) => app._id));
    }
  }, [selectedApplicants, applicantsData]);

  const handleToggleSwitch = useCallback(
    (id: string, isActive: boolean) => {
      if (onToggleSwitch) {
        onToggleSwitch(id, isActive);
      } else {
        toggleActiveStatusMutation({ id, isActive: !isActive });
      }
    },
    [toggleActiveStatusMutation, onToggleSwitch]
  );

  const handleConfirmFav = useCallback(
    (isFav: boolean, id: string) => {
      if (onToggleFavorite) {
        onToggleFavorite(isFav, id);
      } else {
        updateApplicantMutation({ id, data: { isFavorite: !isFav } });
      }
    },
    [updateApplicantMutation, onToggleFavorite]
  );

  const columns: ColumnDef<Applicant>[] = useMemo(() => {
    const baseColumns: ColumnDef<Applicant>[] = [
      {
        header: () => (
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedApplicants.length ===
              (applicantsData?.data?.item?.length ||
                applicantsData?.data?.results?.length ||
                0)
            }
          />
        ),
        accessorKey: "select",
        id: "select",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedApplicants.includes(row.original._id)}
            onChange={() => handleSelectApplicant(row.original._id)}
          />
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Applicant Name",
        accessorKey: "name",
        id: "name",
        cell: ({ row }) => {
          const nameObj = row.original?.name || {};
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";
          const fullName = `${firstName} ${middleName} ${lastName}`.trim();

          return (
            <>
              <div
                style={truncateText}
                className="text-[#624bff] underline cursor-pointer truncated-text hover:text-[#3f3481]"
                title={fullName}
                onClick={() => handleView(row.original._id, "main")}
              >
                {fullName}
              </div>
              <ReactTooltip
                place="top"
                variant="info"
                content={fullName}
                style={toolipComponents}
              />
            </>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Skills",
        accessorKey: "appliedSkills",
        id: "appliedSkills",
        cell: ({ row }) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={row.original.appliedSkills?.join(", ")}
          >
            {row.original.appliedSkills?.join(", ")}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "appliedRole",
        id: "appliedRole",
        enableColumnFilter: false,
      },
      {
        header: "Total Exp",
        accessorKey: "totalExperience",
        id: "totalExperience",
        enableColumnFilter: false,
      },
      {
        header: "City",
        accessorKey: "currentCity",
        id: "currentCity",
        enableColumnFilter: false,
      },
      {
        header: "Gender",
        accessorKey: "gender",
        id: "gender",
        enableColumnFilter: false,
      },
      {
        header: "Qualification",
        accessorKey: "qualification",
        id: "qualification",
        enableColumnFilter: false,
      },
      {
        header: "Current Pkg",
        accessorKey: "currentPkg",
        id: "currentPkg",
        enableColumnFilter: false,
      },
      {
        header: "Expected Pkg",
        accessorKey: "expectedPkg",
        id: "expectedPkg",
        enableColumnFilter: false,
      },
      {
        header: "Notice Period",
        accessorKey: "noticePeriod",
        id: "noticePeriod",
        enableColumnFilter: false,
      },
      {
        header: "Create Date",
        accessorKey: "createdAt",
        id: "createdAt",
        cell: ({ row }) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={row.original.createdAt}
          >
            {row.original.createdAt
              ? moment(row.original.createdAt).format("DD-MM-YYYY")
              : "N/A"}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Updated Date",
        accessorKey: "updatedAt",
        id: "updatedAt",
        cell: ({ row }) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={row.original.updatedAt}
          >
            {row.original.updatedAt
              ? moment(row.original.updatedAt).format("DD-MM-YYYY")
              : "N/A"}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Relevant Skill Exp",
        accessorKey: "relevantSkillExperience",
        id: "relevantSkillExperience",
        enableColumnFilter: false,
      },
      {
        header: "Communication Skill",
        accessorKey: "communicationSkill",
        id: "communicationSkill",
        enableColumnFilter: false,
      },
      {
        header: "Last-Followup Date",
        accessorKey: "lastFollowUpDate",
        id: "lastFollowUpDate",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        id: "action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip.Provider delayDuration={50}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() =>
                      currentRole === "admin"
                        ? handleView(row.original._id, "main")
                        : toastify(
                            "Access denied you do not have permission to access this resource."
                          , { type: "error" })
                    }
                    disabled={!row.original.isActive}
                  >
                    <i className="text-white ri-eye-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-primary"
                  >
                    View
                    <Tooltip.Arrow style={{ fill: "#624bff" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-secondary bg-secondary"
                    onClick={() =>
                      currentRole === "admin"
                        ? handleEdit(row.original._id)
                        : toastify(
                            "Access denied you do not have permission to access this resource."
                          , { type: "error" })
                    }
                    disabled={!row.original.isActive}
                  >
                    <i className="ri-pencil-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-secondary"
                  >
                    Edit
                    <Tooltip.Arrow style={{ fill: "#637381" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() =>
                      currentRole === "admin"
                        ? handleDeleteSingle(row.original._id)
                        : toastify(
                            "Access denied you do not have permission to access this resource."
                          , { type: "error" })
                    }
                    disabled={!row.original.isActive}
                  >
                    <i className="align-bottom ri-delete-bin-5-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-danger"
                  >
                    Delete
                    <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-success bg-success"
                    onClick={() =>
                      currentRole === "admin"
                        ? handleEmail(row.original._id)
                        : toastify(
                            "Access denied you do not have permission to access this resource."
                          , { type: "error" })
                    }
                    disabled={!row.original.isActive}
                  >
                    <i className="align-bottom ri-mail-close-line" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-success"
                  >
                    Mail
                    <Tooltip.Arrow style={{ fill: "#198754" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  {row?.original?.isFavorite ? (
                    <i
                      className="align-bottom ri-heart-fill text-danger"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() =>
                        handleConfirmFav(
                          row?.original?.isFavorite || false,
                          row?.original?._id
                        )
                      }
                    />
                  ) : (
                    <i
                      className="align-bottom ri-heart-line"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() =>
                        handleConfirmFav(
                          row?.original?.isFavorite || false,
                          row?.original?._id
                        )
                      }
                    />
                  )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg"
                  >
                    {row?.original?.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                    <Tooltip.Arrow style={{ fill: "#454f5b" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
        id: "interviewStage",
        cell: ({ row }) => (
          <BaseSelect
            name="interviewStage"
            styles={customStyles}
            options={interviewStageOptions}
            value={dynamicFind(
              interviewStageOptions,
              row.original.interviewStage
            )}
            handleChange={(selectedOption: SelectedOption) => {
              updateStageMutation({
                id: row.original._id,
                data: { interviewStage: selectedOption.value },
              });
            }}
            isDisabled={!row?.original?.isActive}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Applicant Status",
        accessorKey: "status",
        id: "status",
        cell: ({ row }) => (
          <BaseSelect
            name="status"
            styles={customStyles}
            options={statusOptions}
            value={dynamicFind(statusOptions, row.original.status)}
            handleChange={(selectedOption: SelectedOption) => {
              updateStatusMutation({
                id: row.original._id,
                data: { status: selectedOption.value },
              });
            }}
            isDisabled={!row?.original?.isActive}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "isActive",
        id: "isActive",
        cell: ({ row }) => {
          const id = row.original._id;
          const isActive = row.original.isActive || false;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: "24px",
              }}
            >
              <Switch
                size="small"
                checked={isActive}
                onClick={() => handleToggleSwitch(id, isActive)}
                checkedChildren={
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckOutlined />
                  </span>
                }
                unCheckedChildren={
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CloseOutlined />
                  </span>
                }
              />
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ];

    return baseColumns.filter((column) => {
      const columnConfig = availableColumns.find((c) => c.id === column.id);
      return columnConfig?.isVisible !== false;
    });
  }, [
    selectedApplicants,
    applicantsData,
    availableColumns,
    handleSelectAll,
    handleSelectApplicant,
    handleView,
    handleEdit,
    handleDeleteSingle,
    handleEmail,
    handleConfirmFav,
    handleToggleSwitch,
    currentRole,
  ]);

  const data = applicantsData?.data || {
    item: [],
    results: [],
    totalRecords: 0,
  };

  return {
    data: {
      items: data.item || data.results || [],
      totalRecords: data.totalRecords || 0,
    },
    columns,
    isDataLoading,
    selectedApplicants,
    setSelectedApplicants,
    refetchApplicants,
    updateStage: updateStageMutation,
    updateStatus: updateStatusMutation,
    updateApplicant: updateApplicantMutation,
    deleteMultiple: deleteMultipleMutation,
    toggleActiveStatus: toggleActiveStatusMutation,
    exportApplicants: exportApplicantsMutation,
    isUpdatingStage,
    isUpdatingStatus,
    isUpdatingApplicant,
    isDeletingMultiple,
    isTogglingActive,
    isExporting,
    handleView,
    handleEdit,
    handleDeleteSingle,
    handleEmail,
  };
}

export default useApplicant;
