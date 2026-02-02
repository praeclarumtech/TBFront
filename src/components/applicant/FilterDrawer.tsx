/**
 * Filter Drawer Component for Applicant Filtering
 * Handles all filter options in a side drawer
 */

import React from "react";
import { Row, Col } from "react-bootstrap";
import { Box, Drawer, List, Divider, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import BaseSlider from "components/BaseComponents/BaseSlider";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { InputPlaceHolder } from "utils/commonFunctions";
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
  filterCity: SelectedOption1[];
  filterAppliedRole: SelectedOption[];
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
  citiesOptions: SelectedOption1[];
  appliedRoleOptions: SelectedOption[];
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
  onCityChange: (selectedOptions: SelectedOption1[]) => void;
  onAppliedRoleFilterChange: (selectedOptions: SelectedOption[]) => void;
  onAddedByChange: (selectedOptions: SelectedOption[]) => void;
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
  onResetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  isDesktop,
  appliedSkills,
  multipleSkills,
  filterCity,
  filterAppliedRole,
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
  citiesOptions,
  appliedRoleOptions,
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
  onCityChange,
  onAppliedRoleFilterChange,
  onAddedByChange,
  onStateChange,
  onGenderChange,
  onInterviewStageChange,
  onStatusChange,
  onWorkPreferenceChange,
  onAnyHandOnOffersChange,
  onDesignationChange,
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
  onResetFilters,
}) => {
  const drawerContent = (
    <Box
      sx={{
        padding: "16px",
        marginTop: anchorEnums.top ? "0px" : 0,
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
          className="mb-1 select-border"
          isMulti={true}
        />

        {/* Multiple Skills */}
        <MultiSelect
          label="Multiple Skills"
          name="multipleSkills"
          options={skillsOptions}
          value={multipleSkills}
          onChange={onMultipleSkillsChange}
          placeholder="Select multiple skills..."
          className="mb-1 select-border"
          isMulti={true}
        />

        {/* Applied Role */}
        <MultiSelect
          label="Applied Role"
          name="appliedRole"
          options={appliedRoleOptions}
          placeholder="Applied Role"
          value={filterAppliedRole}
          isMulti={true}
          onChange={onAppliedRoleFilterChange}
          className="mb-1"
        />

        {/* City Filter */}
        <MultiSelect
          label="City"
          name="city"
          className="mb-1 select-border"
          options={citiesOptions}
          placeholder="City"
          value={filterCity}
          isMulti={true}
          onChange={onCityChange}
        />

        {/* State Filter */}
        <BaseSelect
          label="State"
          name="filterState"
          options={statesOptions}
          value={filterState}
          handleChange={onStateChange}
          placeholder="Select state..."
          className="mb-1"
        />

        {/* Gender Filter */}
        <BaseSelect
          label="Gender"
          name="filterGender"
          options={gendersOptions}
          value={filterGender}
          handleChange={onGenderChange}
          placeholder="Select gender..."
          className="mb-1"
        />

        {/* Interview Stage Filter */}
        <BaseSelect
          label="Interview Stage"
          name="filterInterviewStage"
          options={interviewStageOptions}
          value={filterInterviewStage}
          handleChange={onInterviewStageChange}
          placeholder="Select interview stage..."
          className="mb-1"
        />

        {/* Status Filter */}
        <BaseSelect
          label="Status"
          name="filterStatus"
          options={statusOptions}
          value={filterStatus}
          handleChange={onStatusChange}
          placeholder="Select status..."
          className="mb-1"
        />

        {/* Work Preference Filter */}
        <BaseSelect
          label="Work Preference"
          name="filterWorkPreference"
          options={workPreferenceOptions}
          value={filterWorkPreference}
          handleChange={onWorkPreferenceChange}
          placeholder="Select work preference..."
          className="mb-1"
        />

        {/* Any Hand On Offers Filter */}
        <BaseSelect
          label="Any Hand On Offers"
          name="filterAnyHandOnOffers"
          options={anyHandOnOffersOptions}
          value={filterAnyHandOnOffers}
          handleChange={onAnyHandOnOffersChange}
          placeholder="Select option..."
          className="mb-1"
        />

        {/* Designation Filter */}
        <BaseSelect
          label="Designation"
          name="filterDesignation"
          options={designationOptions}
          value={filterDesignation}
          handleChange={onDesignationChange}
          placeholder="Select designation..."
          className="mb-1"
        />

        {/* Added By Filter */}
        <MultiSelect
          label="Added By"
          name="addedBy"
          options={addedByOptions}
          value={addedBy}
          onChange={onAddedByChange}
          placeholder="Select added by..."
          className="mb-1"
        />

        {/* Active Status Filter */}
        <BaseSelect
          label="Active Status"
          name="filterActiveStatus"
          options={activeStatusOptions}
          value={filterActiveStatus}
          handleChange={onActiveStatusChange}
          placeholder="Select active status..."
          className="mb-1"
        />

        {/* Favorite Filter */}
        <BaseSelect
          label="Favorite"
          name="filterFavorite"
          options={favoriteOptions}
          value={filterFavorite}
          handleChange={onFavoriteChange}
          placeholder="Select favorite..."
          className="mb-1"
        />

        {/* Date Range Filters */}
        <div className="mt-3">

          <BaseInput
            label="Start Date"
            type="date"
            name="startDate"
            value={startDate}
            handleChange={(e) => onStartDateChange(e.target.value)}
            className="mb-1 select-border"
          />

          <BaseInput
            label="End Date"
            type="date"
            name="endDate"
            value={endDate}
            handleChange={(e) => onEndDateChange(e.target.value)}
            className="mb-1 select-border"
          />

          <BaseInput
            label="Updated Start Date"
            type="date"
            name="updatedStartDate"
            value={updatedStartDate}
            handleChange={(e) => onUpdatedStartDateChange(e.target.value)}
            className="mb-1 select-border"
          />

          <BaseInput
            label="Updated End Date"
            type="date"
            name="updatedEndDate"
            value={updatedEndDate}
            handleChange={(e) => onUpdatedEndDateChange(e.target.value)}
            className="mb-1 select-border"
          />
        </div>

        {/* Range Sliders */}
        <div className="mt-3">
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
            label="JavaScript Rating (1-10)"
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

        {/* Date Range Filters */}
        <Row className="mb-3">
          <Col xs={6}>
            <BaseInput
              label="Created Start Date"
              name="startDate"
              className="mb-1 select-border"
              type="date"
              placeholder={InputPlaceHolder("Start Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onStartDateChange(e.target.value)
              }
              value={startDate || ""}
              max={new Date().toISOString().split("T")[0]}
            />
          </Col>
          <Col xs={6}>
            <BaseInput
              label="Created End Date"
              name="endDate"
              type="date"
              placeholder={InputPlaceHolder("End Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onEndDateChange(e.target.value)
              }
              value={endDate || ""}
              max={new Date().toISOString().split("T")[0]}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={6}>
            <BaseInput
              label="Update Start Date"
              name="updatedStartDate"
              className="mb-1 select-border"
              type="date"
              placeholder={InputPlaceHolder("Start Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdatedStartDateChange(e.target.value)
              }
              value={updatedStartDate || ""}
              max={new Date().toISOString().split("T")[0]}
            />
          </Col>
          <Col xs={6}>
            <BaseInput
              label="Update End Date"
              name="updatedEndDate"
              type="date"
              placeholder={InputPlaceHolder("End Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdatedEndDateChange(e.target.value)
              }
              value={updatedEndDate || ""}
              max={new Date().toISOString().split("T")[0]}
            />
          </Col>
        </Row>
      </List>

      <Divider />
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          zIndex: 100,
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        <Row>
          <Col className="text-end">
            <BaseButton
              color="primary"
              onClick={onResetFilters}
              sx={{ width: "auto" }}
            >
              Reset Filters
            </BaseButton>
          </Col>
        </Row>
      </div>
    </Box>
  );

  return (
    <Drawer className="!mt-16" anchor="right" open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
};

export default FilterDrawer;
