/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Style constants for Applicant components
 */

export const truncateText = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
  fontSize: "14px",
};

export const toolipComponents = {
  backgroundColor: "blue !important",
  color: "white !important",
  "border-radius": "5px !important",
  padding: "8px 12px !important",
  "font-size": "14px !important",
  border: "1px solid white !important",
};

export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    fontSize: "12px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    borderColor: "transparent",
    minHeight: "20px",
    outline: "none",
    boxShadow: "none",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "12px",
    backgroundColor: state.isSelected ? "#007bff" : "transparent",
    color: state.isSelected ? "#fff" : "#000",
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "#333",
  }),

  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#secondary",
  }),

  clearIndicator: (provided: any) => ({
    ...provided,
    display: "none",
    color: "#dc3545",
  }),

  menu: (provided: any) => ({
    ...provided,
    borderRadius: "8px",
  }),
};
