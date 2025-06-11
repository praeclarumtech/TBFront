// export { BaseSelect, MultiSelect };
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFeedback, Label } from "reactstrap";
import Select from "react-select";
import { BaseSelectProps, MultiSelectProps } from "interfaces/global.interface";

const BaseSelect = ({
  label,
  name,
  className,
  options,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  isDisabled,
  styles,
  isRequired,
  menuPortalTarget,
  menuPosition,
}: BaseSelectProps) => {
  const customStyles = {
    ...styles,
    menu: (provided: any) => ({
      ...provided,
      width: "100%",
      minWidth: "fit-content",
      zIndex: 9999,
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "200px", // reduce dropdown height here (adjust as needed)
      overflowY: "auto", // enable scroll if too many items
    }),
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "38px",
      borderColor: state.isFocused ? "#2684FF" : base.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : base.boxShadow,
      "&:hover": {
        borderColor: "#2684FF",
      },
      width: "100%",
    }),
  };
  return (
    <>
      {label && (
        <Label
          htmlFor={name}
          className="font-semibold text-gray-700 form-label"
        >
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select
        name={name}
        className={`${className ? className : "select-border"} ${
          touched && error ? "is-invalid" : ""
        }`}
        options={options?.length > 0 ? options : []}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        menuPlacement="auto"
        styles={customStyles}
        menuPortalTarget={menuPortalTarget}
        menuPosition={menuPosition}
      />
      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}
    </>
  );
};

const MultiSelect = ({
  label,
  value,
  isMulti,
  onChange,
  options,
  styles = {},
  touched,
  error,
  name,
  handleBlur,
  className,
  isDisabled,
  placeholder,
  isRequired,
}: MultiSelectProps) => {
  const customStyles = {
    ...styles,
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: "39px", // fixed height
      overflowY: "auto", // vertical scroll if overflow
      overflowX: "hidden",
      flexWrap: "wrap", // allow wrapping
      display: "flex",
    }),
    multiValue: (base: any) => ({
      ...base,
      whiteSpace: "nowrap",
    }),
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "38px",
      borderColor: state.isFocused ? "#2684FF" : base.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : base.boxShadow,
      "&:hover": {
        borderColor: "#2684FF",
      },
    }),
    input: (base: any) => ({
      ...base,
      margin: 0, // remove default margin that causes misalignment
      padding: 0,
      flexGrow: 1, // allow the input to fill space
      minWidth: "2px", // ensure it takes full width
    }),
    placeholder: (base: any) => ({
      ...base,
      marginLeft: 0,
      position: "absolute",
      left: "10px", // optional: adds spacing from left edge
    }),
  };

  return (
    <>
      {label && (
        <Label
          htmlFor={name}
          className="font-semibold text-gray-700 form-label"
        >
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select
        value={value}
        className={`${className ? className : "select-border"} ${
          touched && error ? "is-invalid" : ""
        }`}
        isMulti={isMulti}
        onChange={onChange}
        options={options}
        styles={customStyles}
        name={name}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        placeholder={placeholder}
      />
      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}
    </>
  );
};

export { BaseSelect, MultiSelect };
