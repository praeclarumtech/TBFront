// import { FormFeedback, Label } from "reactstrap";
// import Select from "react-select";
// import { BaseSelectProps, MultiSelectProps } from "interfaces/global.interface";
// const BaseSelect = ({
//   label,
//   name,
//   className,
//   options,
//   placeholder,
//   handleChange,
//   handleBlur,
//   value,
//   touched,
//   error,
//   isDisabled,
//   styles,
//   isRequired,
// }: BaseSelectProps) => {
//   return (
//     <>
//       {label && (
//         <Label
//           htmlFor={name}
//           className="font-semibold text-gray-700 form-label"
//         >
//           {label}
//           {isRequired && <span className="text-red-500">*</span>}
//         </Label>
//       )}
//       <Select
//         name={name}
//         className={`${className ? className : "select-border"} ${
//           touched && error ? "is-invalid" : ""
//         }`} // Add "is-invalid" class
//         options={options?.length > 0 ? options : []}
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         isClearable
//         isDisabled={isDisabled}
//         menuPlacement="bottom"
//         styles={styles}
//       />
//       {touched && error && (
//         <FormFeedback className="d-block">{error}</FormFeedback>
//       )}{" "}
//       {/* Ensure it's visible */}
//     </>
//   );
// };

// const MultiSelect = ({
//   label,
//   value,
//   isMulti,
//   onChange,
//   options,
//   styles,
//   touched,
//   error,
//   name,
//   handleBlur,
//   className,
//   isDisabled,
//   placeholder,
//   isRequired,
// }: MultiSelectProps) => {
//   return (
//     <>
//       {label && (
//         <Label
//           htmlFor={name}
//           className="font-semibold text-gray-700 form-label"
//         >
//           {label}
//           {isRequired && <span className="text-red-500">*</span>}
//         </Label>
//       )}
//       <Select
//         value={value}
//         className={`${className ? className : "select-border"} ${
//           touched && error ? "is-invalid" : ""
//         }`}
//         isMulti={isMulti}
//         onChange={onChange}
//         options={options}
//         styles={styles}
//         name={name}
//         onBlur={handleBlur}
//         isClearable
//         isDisabled={isDisabled}
//         placeholder={placeholder}
//       />
//       {touched && error && (
//         <FormFeedback className="d-block">{error}</FormFeedback>
//       )}{" "}
//       {/* Ensure it's visible */}
//     </>
//   );
// };

// export { BaseSelect, MultiSelect };

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
}: BaseSelectProps) => {
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
        menuPlacement="bottom"
        styles={styles}
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
