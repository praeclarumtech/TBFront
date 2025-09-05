import { BaseTextareaProps } from "interfaces/global.interface";
import { Label, Input, FormFeedback } from "reactstrap";

const BaseTextarea = ({
  label,
  name,
  className,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  maxLength,
  disabled,
  rows = 4,
  cols = 50,
  isRequired,
}: BaseTextareaProps) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label text-black font-semibold">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Input
        name={name}
        type="textarea"
        className={className || "form-control  "}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value || ""}
        invalid={!!(touched && error)}
        maxLength={maxLength}
        rows={rows}
        cols={cols}
        disabled={disabled}
      />

      {touched && error && <FormFeedback type="invalid">{error}</FormFeedback>}
    </>
  );
};

export default BaseTextarea;
