/**
 * Filter Drawer Component for Applicant Filtering
 * Handles all filter options in a side drawer
 */

import React from "react";
import { Row, Col } from "react-bootstrap";
import { Box, Drawer, List, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import BaseSlider from "components/BaseComponents/BaseSlider";
import BaseInput from "components/BaseComponents/BaseInput";
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import appConstants from "constants/constant";

const { anchorEnums } = appConstants;

const DRAWER_STYLES = {
  stickyHeader: {
    position: "sticky" as const,
    top: 0,
    background: "#fff",
    zIndex: 100,
    paddingBottom: "8px",
    paddingTop: "8px",
  },
};
interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  isDesktop: boolean;
  appliedSkills: SelectedOption1[];
  multipleSkills: SelectedOption1[];
  filterState: SelectedOption | null;
  filterGender: SelectedOption | null;
  filterInterviewStage: SelectedOption | null;
  filterStatus: SelectedOption | null;
  filterWorkPreference: SelectedOption | null;
  filterAnyHandOnOffers: SelectedOption | null;
  filterDesignation: SelectedOption | null;
  addedBy: SelectedOption[];
  filterActiveStatus: SelectedOption | null;
  filterFavorite: SelectedOption | null;

  // Date filters
  startDate: string;
  endDate: string;
  updatedStartDate: string;
  updatedEndDate: string;

  // Range filters
  experienceRange: number[];
  filterNoticePeriod: number[];
  filterRating: number[];
  filterEngRating: number[];
  filterExpectedPkg: number[];
  filterCurrentPkg: number[];

  // Options
  skillsOptions: SelectedOption1[];
  statesOptions: SelectedOption[];
  interviewStageOptions: SelectedOption[];
  statusOptions: SelectedOption[];
  gendersOptions: SelectedOption[];
  workPreferenceOptions: SelectedOption[];
  anyHandOnOffersOptions: SelectedOption[];
  designationOptions: SelectedOption[];
  addedByOptions: SelectedOption[];
  activeStatusOptions: SelectedOption[];
  favoriteOptions: SelectedOption[];

  // Handlers
  onAppliedSkillsChange: (selectedOptions: SelectedOption1[]) => void;
  onMultipleSkillsChange: (selectedOptions: SelectedOption1[]) => void;
  onStateChange: (selectedOption: SelectedOption | null) => void;
  onGenderChange: (selectedOption: SelectedOption | null) => void;
  onInterviewStageChange: (selectedOption: SelectedOption | null) => void;
  onStatusChange: (selectedOption: SelectedOption | null) => void;
  onWorkPreferenceChange: (selectedOption: SelectedOption | null) => void;
  onAnyHandOnOffersChange: (selectedOption: SelectedOption | null) => void;
  onDesignationChange: (selectedOption: SelectedOption | null) => void;
  onAppliedRoleChange: (selectedOption: SelectedOption[]) => void;
  onActiveStatusChange: (selectedOption: SelectedOption | null) => void;
  onFavoriteChange: (selectedOption: SelectedOption | null) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onUpdatedStartDateChange: (value: string) => void;
  onUpdatedEndDateChange: (value: string) => void;
  onExperienceChange: (value: number[]) => void;
  onNoticePeriodChange: (value: number[]) => void;
  onRatingChange: (value: number[]) => void;
  onEngRatingChange: (value: number[]) => void;
  onExpectedPkgChange: (value: number[]) => void;
  onCurrentPkgChange: (value: number[]) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  isDesktop,
  appliedSkills,
  multipleSkills,
  filterState,
  filterGender,
  filterInterviewStage,
  filterStatus,
  filterWorkPreference,
  filterAnyHandOnOffers,
  filterDesignation,
  addedBy,
  filterActiveStatus,
  filterFavorite,
  startDate,
  endDate,
  updatedStartDate,
  updatedEndDate,
  experienceRange,
  filterNoticePeriod,
  filterRating,
  filterEngRating,
  filterExpectedPkg,
  filterCurrentPkg,
  skillsOptions,
  statesOptions,
  interviewStageOptions,
  statusOptions,
  gendersOptions,
  workPreferenceOptions,
  anyHandOnOffersOptions,
  designationOptions,
  addedByOptions,
  activeStatusOptions,
  favoriteOptions,
  onAppliedSkillsChange,
  onMultipleSkillsChange,
  onStateChange,
  onGenderChange,
  onInterviewStageChange,
  onStatusChange,
  onWorkPreferenceChange,
  onAnyHandOnOffersChange,
  onDesignationChange,
  onAppliedRoleChange,
  onActiveStatusChange,
  onFavoriteChange,
  onStartDateChange,
  onEndDateChange,
  onUpdatedStartDateChange,
  onUpdatedEndDateChange,
  onExperienceChange,
  onNoticePeriodChange,
  onRatingChange,
  onEngRatingChange,
  onExpectedPkgChange,
  onCurrentPkgChange,
}) => {
  const drawerContent = (
    <Box
      sx={{
        padding: "16px",
        marginTop: anchorEnums.top ? "64px" : 0,
        width: isDesktop ? 400 : 250,
      }}
      role="presentation"
    >
      <div style={DRAWER_STYLES.stickyHeader}>
        <Row className="flex items-center justify-between">
          <Col>
            <h3>Apply Filters</h3>
          </Col>
          <Col className="text-end">
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
            >
              <Close />
            </IconButton>
          </Col>
        </Row>
      </div>

      <List>
        {/* Applied Skills */}
        <MultiSelect
          label="Applied Skills"
          name="appliedSkills"
          options={skillsOptions}
          value={appliedSkills}
          onChange={onAppliedSkillsChange}
          placeholder="Select skills..."
        />

        {/* Multiple Skills */}
        <MultiSelect
          label="Multiple Skills"
          name="multipleSkills"
          options={skillsOptions}
          value={multipleSkills}
          onChange={onMultipleSkillsChange}
          placeholder="Select multiple skills..."
        />

        {/* State Filter */}
        <BaseSelect
          label="State"
          name="filterState"
          options={statesOptions}
          value={filterState}
          handleChange={onStateChange}
          placeholder="Select state..."
        />

        {/* Gender Filter */}
        <BaseSelect
          label="Gender"
          name="filterGender"
          options={gendersOptions}
          value={filterGender}
          handleChange={onGenderChange}
          placeholder="Select gender..."
        />

        {/* Interview Stage Filter */}
        <BaseSelect
          label="Interview Stage"
          name="filterInterviewStage"
          options={interviewStageOptions}
          value={filterInterviewStage}
          handleChange={onInterviewStageChange}
          placeholder="Select interview stage..."
        />

        {/* Status Filter */}
        <BaseSelect
          label="Status"
          name="filterStatus"
          options={statusOptions}
          value={filterStatus}
          handleChange={onStatusChange}
          placeholder="Select status..."
        />

        {/* Work Preference Filter */}
        <BaseSelect
          label="Work Preference"
          name="filterWorkPreference"
          options={workPreferenceOptions}
          value={filterWorkPreference}
          handleChange={onWorkPreferenceChange}
          placeholder="Select work preference..."
        />

        {/* Any Hand On Offers Filter */}
        <BaseSelect
          label="Any Hand On Offers"
          name="filterAnyHandOnOffers"
          options={anyHandOnOffersOptions}
          value={filterAnyHandOnOffers}
          handleChange={onAnyHandOnOffersChange}
          placeholder="Select option..."
        />

        {/* Designation Filter */}
        <BaseSelect
          label="Designation"
          name="filterDesignation"
          options={designationOptions}
          value={filterDesignation}
          handleChange={onDesignationChange}
          placeholder="Select designation..."
        />

        {/* Added By Filter */}
        <MultiSelect
          label="Added By"
          name="addedBy"
          options={addedByOptions}
          value={addedBy}
          onChange={onAppliedRoleChange}
          placeholder="Select added by..."
        />

        {/* Active Status Filter */}
        <BaseSelect
          label="Active Status"
          name="filterActiveStatus"
          options={activeStatusOptions}
          value={filterActiveStatus}
          handleChange={onActiveStatusChange}
          placeholder="Select active status..."
        />

        {/* Favorite Filter */}
        <BaseSelect
          label="Favorite"
          name="filterFavorite"
          options={favoriteOptions}
          value={filterFavorite}
          handleChange={onFavoriteChange}
          placeholder="Select favorite..."
        />

        {/* Date Range Filters */}
        <div className="mt-3">
          <h6>Date Range Filters</h6>

          <BaseInput
            label="Start Date"
            type="date"
            name="startDate"
            value={startDate}
            handleChange={(e) => onStartDateChange(e.target.value)}
          />

          <BaseInput
            label="End Date"
            type="date"
            name="endDate"
            value={endDate}
            handleChange={(e) => onEndDateChange(e.target.value)}
          />

          <BaseInput
            label="Updated Start Date"
            type="date"
            name="updatedStartDate"
            value={updatedStartDate}
            handleChange={(e) => onUpdatedStartDateChange(e.target.value)}
          />

          <BaseInput
            label="Updated End Date"
            type="date"
            name="updatedEndDate"
            value={updatedEndDate}
            handleChange={(e) => onUpdatedEndDateChange(e.target.value)}
          />
        </div>

        {/* Range Sliders */}
        <div className="mt-3">
          <h6>Range Filters</h6>

          <BaseSlider
            label="Experience (Years)"
            min={0}
            max={25}
            step={0.1}
            value={experienceRange}
            handleChange={onExperienceChange}
          />

          <BaseSlider
            label="Notice Period (Days)"
            min={0}
            max={90}
            step={1}
            value={filterNoticePeriod}
            handleChange={onNoticePeriodChange}
          />

          <BaseSlider
            label="Rating (1-10)"
            min={0}
            max={10}
            step={1}
            value={filterRating}
            handleChange={onRatingChange}
          />

          <BaseSlider
            label="English Rating (1-10)"
            min={0}
            max={10}
            step={1}
            value={filterEngRating}
            handleChange={onEngRatingChange}
          />

          <BaseSlider
            label="Expected Package (LPA)"
            min={0}
            max={100}
            step={1}
            value={filterExpectedPkg}
            handleChange={onExpectedPkgChange}
          />

          <BaseSlider
            label="Current Package (LPA)"
            min={0}
            max={100}
            step={1}
            value={filterCurrentPkg}
            handleChange={onCurrentPkgChange}
          />
        </div>
      </List>
    </Box>
  );

  return (
    <Drawer className="!mt-16" anchor="right" open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
};

export default FilterDrawer;
