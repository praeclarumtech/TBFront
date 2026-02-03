import { useState } from "react";
import { toast } from "react-toastify";
import {
  listOfApplicants,
  updateStage,
  updateStatus,
  ExportApplicant,
  deleteMultipleApplicant,
  updateApplicant,
} from "api/applicantApi";
import { activeApplicant, inActiveApplicant } from "api/apiActive";
import { FilterState } from "./useApplicantFilters";

export interface Applicant {
  _id: string;
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  appliedSkills: string[];
  appliedRole: string;
  totalExperience: number;
  currentCity: string;
  gender: string;
  qualification: string;
  workPreference: string;
  currentPkg: number;
  expectedPkg: number;
  noticePeriod: number;
  createdAt: string;
  updatedAt: string;
  relevantSkillExperience: number;
  communicationSkill: number;
  lastFollowUpDate: string;
  interviewStage: string;
  status: string;
  isActive: boolean;
  isFavorite: boolean;
  email: string;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export const useApplicantData = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [loading, setLoading] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);

  const fetchApplicants = async (
    filters: FilterState,
    chartParams?: Record<string, string>,
  ) => {
    setTableLoader(true);
    setLoading(true);
    setApplicants([]);

    try {
      const params: any = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: pagination.pageSize,
      };

      // Build params from filters
      if (
        filters.experienceRange[0] !== 0 ||
        filters.experienceRange[1] !== 25
      ) {
        params.totalExperience = `${filters.experienceRange[0]}-${filters.experienceRange[1]}`;
      }
      if (
        filters.filterNoticePeriod[0] !== 0 ||
        filters.filterNoticePeriod[1] !== 90
      ) {
        params.noticePeriod = `${filters.filterNoticePeriod[0]}-${filters.filterNoticePeriod[1]}`;
      }
      if (filters.filterRating[0] !== 0 || filters.filterRating[1] !== 10) {
        params.rating = `${filters.filterRating[0]}-${filters.filterRating[1]}`;
      }
      if (
        filters.filterEngRating[0] !== 0 ||
        filters.filterEngRating[1] !== 10
      ) {
        params.communicationSkill = `${filters.filterEngRating[0]}-${filters.filterEngRating[1]}`;
      }
      if (
        filters.filterExpectedPkg[0] !== 0 ||
        filters.filterExpectedPkg[1] !== 100
      ) {
        params.expectedPkg = `${filters.filterExpectedPkg[0]}-${filters.filterExpectedPkg[1]}`;
      }
      if (
        filters.filterCurrentPkg[0] !== 0 ||
        filters.filterCurrentPkg[1] !== 100
      ) {
        params.currentPkg = `${filters.filterCurrentPkg[0]}-${filters.filterCurrentPkg[1]}`;
      }
      if (filters.filterAnyHandOnOffers) {
        params.anyHandOnOffers = filters.filterAnyHandOnOffers.value;
      }
      if (filters.filterCity.length > 0) {
        params.currentCity = filters.filterCity
          .map((city) => city.label)
          .join(",");
      }
      if (filters.filterState) {
        params.state = encodeURIComponent(filters.filterState.label);
      }
      if (filters.appliedSkills.length > 0) {
        params.appliedSkills = filters.appliedSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (filters.multipleSkills.length > 0) {
        params.appliedSkillsOR = filters.multipleSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (filters.addedBy.length > 0) {
        params.addedBy = filters.addedBy
          .map((role: any) => role.value)
          .join(",");
      }
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.updatedStartDate)
        params.updatedStartDate = filters.updatedStartDate;
      if (filters.updatedEndDate)
        params.updatedEndDate = filters.updatedEndDate;
      if (filters.filterStatus) params.status = filters.filterStatus.value;
      if (filters.filterDesignation)
        params.currentCompanyDesignation = filters.filterDesignation.value;
      if (filters.filterInterviewStage)
        params.interviewStage = filters.filterInterviewStage.value;
      if (filters.filterGender) params.gender = filters.filterGender.value;
      if (
        filters.filterActiveStatus &&
        filters.filterActiveStatus.value !== ""
      ) {
        params.isActive = filters.filterActiveStatus.value;
      }
      if (filters.filterAppliedRole.length > 0) {
        params.appliedRole = filters.filterAppliedRole
          .map((role) => role.label)
          .join(",");
      }
      if (filters.searchAll?.trim()) {
        params.search = filters.searchAll.trim();
      }
      if (filters.filterFavorite) {
        params.isFavorite = filters.filterFavorite.value;
      }

      // Apply chart params if provided
      if (chartParams) {
        Object.assign(params, chartParams);
      }

      const res = await listOfApplicants(params);

      if (res.success === false) {
        toast.error(res.message);
      }

      setApplicants(res?.data?.item || res?.data?.results || []);
      setTotalRecords(res?.data?.totalRecords || 0);
    } catch (error: any) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details)) {
        details.forEach((msg: string) => {
          toast.error(msg, { closeOnClick: true, autoClose: 5000 });
        });
      } else {
        console.log(error);
        toast.error("Failed to fetch applicants. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setTableLoader(false);
      setLoading(false);
    }
  };

  const updateApplicantStage = async (applicantId: string, stage: string) => {
    try {
      await updateStage({ interviewStage: stage }, applicantId);
      toast.success("Applicant interview stage updated successfully.");

      // Update local state
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === applicantId
            ? { ...applicant, interviewStage: stage }
            : applicant,
        ),
      );
    } catch (error: any) {
      console.error("Error updating stage:", error);
      toast.error("Failed to update interview stage");
    }
  };

  const updateApplicantStatus = async (applicantId: string, status: string) => {
    try {
      await updateStatus({ status }, applicantId);
      toast.success("Applicant status updated successfully.");

      // Update local state
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === applicantId ? { ...applicant, status } : applicant,
        ),
      );
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update applicant status");
    }
  };

  const toggleApplicantActiveStatus = async (
    applicantId: string,
    isActive: boolean,
  ) => {
    try {
      const res = isActive
        ? await inActiveApplicant(applicantId)
        : await activeApplicant(applicantId);

      if (res.success) {
        toast.success(res.message);

        // Update local state
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant._id === applicantId
              ? { ...applicant, isActive: !isActive }
              : applicant,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update applicant status");
    }
  };

  const deleteApplicants = async (applicantIds: string[]) => {
    try {
      const res = await deleteMultipleApplicant(applicantIds);
      toast.success(res?.message);
      return true;
    } catch (error: any) {
      console.error("Error deleting applicants:", error);
      toast.error("Failed to delete applicants");
      return false;
    }
  };

  const updateApplicantFavorite = async (
    applicantId: string,
    isFavorite: boolean,
  ) => {
    try {
      const res = await updateApplicant(
        { isFavorite: !isFavorite },
        applicantId,
      );
      if (res.success) {
        toast.success("Applicant added to favorite list.");

        // Update local state
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant._id === applicantId
              ? { ...applicant, isFavorite: !isFavorite }
              : applicant,
          ),
        );
      }
    } catch (error: any) {
      const errorMessages = error?.response?.data?.details;
      if (errorMessages && Array.isArray(errorMessages)) {
        errorMessages.forEach((errorMessage) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error("An error occurred while updating the applicant.");
      }
    }
  };

  const exportApplicants = async (
    filters: FilterState,
    selectedApplicants: string[],
    exportableFields: any[],
    source: string,
  ) => {
    try {
      toast.info("Preparing file for download...");

      const selectedColumns = exportableFields.map((field) => field.value);
      const payload = {
        ids: selectedApplicants,
        fields: selectedColumns,
        flag: false,
        main: true,
      };

      const queryParams: any = { source };

      // Apply filters (same logic as fetchApplicants)
      if (
        filters.experienceRange[0] !== 0 ||
        filters.experienceRange[1] !== 25
      ) {
        queryParams.totalExperience = `${filters.experienceRange[0]}-${filters.experienceRange[1]}`;
      }
      if (
        filters.filterNoticePeriod[0] !== 0 ||
        filters.filterNoticePeriod[1] !== 90
      ) {
        queryParams.noticePeriod = `${filters.filterNoticePeriod[0]}-${filters.filterNoticePeriod[1]}`;
      }
      if (filters.filterRating[0] !== 0 || filters.filterRating[1] !== 10) {
        queryParams.rating = `${filters.filterRating[0]}-${filters.filterRating[1]}`;
      }
      if (
        filters.filterEngRating[0] !== 0 ||
        filters.filterEngRating[1] !== 10
      ) {
        queryParams.communicationSkill = `${filters.filterEngRating[0]}-${filters.filterEngRating[1]}`;
      }
      if (
        filters.filterExpectedPkg[0] !== 0 ||
        filters.filterExpectedPkg[1] !== 100
      ) {
        queryParams.expectedPkg = `${filters.filterExpectedPkg[0]}-${filters.filterExpectedPkg[1]}`;
      }
      if (
        filters.filterCurrentPkg[0] !== 0 ||
        filters.filterCurrentPkg[1] !== 100
      ) {
        queryParams.currentPkg = `${filters.filterCurrentPkg[0]}-${filters.filterCurrentPkg[1]}`;
      }
      if (filters.filterAnyHandOnOffers) {
        queryParams.anyHandOnOffers = filters.filterAnyHandOnOffers.value;
      }
      if (filters.filterCity.length > 0) {
        queryParams.currentCity = filters.filterCity
          .map((city) => city.label)
          .join(",");
      }
      if (filters.filterState) {
        queryParams.state = encodeURIComponent(filters.filterState.label);
      }
      if (filters.appliedSkills.length > 0) {
        queryParams.appliedSkills = filters.appliedSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (filters.multipleSkills.length > 0) {
        queryParams.appliedSkillsOR = filters.multipleSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (filters.addedBy.length > 0) {
        queryParams.addedBy = filters.addedBy
          .map((role) => role.value)
          .join(",");
      }
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.endDate) queryParams.endDate = filters.endDate;
      if (filters.updatedStartDate)
        queryParams.updatedStartDate = filters.updatedStartDate;
      if (filters.updatedEndDate)
        queryParams.updatedEndDate = filters.updatedEndDate;
      if (filters.filterStatus) queryParams.status = filters.filterStatus.value;
      if (filters.filterDesignation)
        queryParams.currentCompanyDesignation = filters.filterDesignation.value;
      if (filters.filterInterviewStage)
        queryParams.interviewStage = filters.filterInterviewStage.value;
      if (filters.filterGender) queryParams.gender = filters.filterGender.value;
      if (
        filters.filterActiveStatus &&
        filters.filterActiveStatus.value !== ""
      ) {
        queryParams.isActive = filters.filterActiveStatus.value;
      }
      if (filters.filterAppliedRole.length > 0) {
        queryParams.appliedRole = filters.filterAppliedRole
          .map((role) => role.label)
          .join(",");
      }
      if (filters.searchAll?.trim()) {
        queryParams.search = filters.searchAll.trim();
      }
      if (filters.filterFavorite) {
        queryParams.isFavorite = filters.filterFavorite.value;
      }

      await new Promise((resolve) => setTimeout(resolve, 3500));

      const responseBlob = await ExportApplicant(queryParams, payload);
      if (responseBlob.success === false) {
        toast.error(responseBlob.message);
        return;
      }

      const text = await responseBlob.text();
      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        const blob = new Blob([text], { type: "text/csv" });
        const saveAs = (await import("file-saver")).default;
        saveAs(blob, "Main_Applicants_Data.csv");
        toast.success("File downloaded successfully.");
        return;
      }

      if (
        parsed?.success === false ||
        parsed?.statusCode === 404 ||
        parsed?.statuscode === 500 ||
        parsed?.statuscode === 403
      ) {
        toast.error(parsed?.message || "No data available to export");
      } else {
        toast.error("Unexpected JSON response during export.");
      }
    } catch (error: any) {
      console.log("Export error", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.statusText ||
          "Export failed.",
      );
    }
  };

  return {
    applicants,
    totalRecords,
    pagination,
    setPagination,
    loading,
    tableLoader,
    fetchApplicants,
    updateApplicantStage,
    updateApplicantStatus,
    toggleApplicantActiveStatus,
    deleteApplicants,
    updateApplicantFavorite,
    exportApplicants,
  };
};
