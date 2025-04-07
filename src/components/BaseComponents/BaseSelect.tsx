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
}: BaseSelectProps) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      <Select
        name={name}
        className={`${className ? className : "select-border"} ${
          touched && error ? "is-invalid" : ""
        }`} // Add "is-invalid" class
        options={options?.length > 0 ? options : []}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        menuPlacement="auto"
        styles={styles}
      />
      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}{" "}
      {/* Ensure it's visible */}
    </>
  );
};

const MultiSelect = ({
  label,
  value,
  isMulti,
  onChange,
  options,
  styles,
  touched,
  error,
  name,
  handleBlur,
  className,
  isDisabled,
  placeholder,
}: MultiSelectProps) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      <Select
        value={value}
        className={`${className ? className : "select-border"} ${
          touched && error ? "is-invalid" : ""
        }`} // Add "is-invalid" class
        isMulti={isMulti}
        onChange={onChange}
        options={options}
        styles={styles}
        name={name}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        placeholder={placeholder}
      />
      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}{" "}
      {/* Ensure it's visible */}
    </>
  );
};

export { BaseSelect, MultiSelect };
