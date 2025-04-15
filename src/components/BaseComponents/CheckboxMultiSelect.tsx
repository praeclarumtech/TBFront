/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { FormFeedback, Label } from "reactstrap";
import { MultiSelectCheckBoxProps } from "interfaces/global.interface";

const SELECT_ALL = { label: "Select All", value: "__all__" };

const CheckboxOption = (props: any) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: 10 }}
      />
      {props.label}
    </components.Option>
  );
};

const MultiValueContainer = (props: any) => {
  return <components.MultiValue {...props} />;
};

const CheckboxMultiSelect = ({
  label,
  value,
  onChange,
  options = [],
  styles,
  touched,
  error,
  name,
  handleBlur,
  className,
  isDisabled,
  placeholder,
  showSelectAll = true,
}: MultiSelectCheckBoxProps) => {
  // const fullOptions = [SELECT_ALL, ...options];
  const fullOptions = showSelectAll ? [SELECT_ALL, ...options] : options;
  const [selectedOptions, setSelectedOptions] = useState<any[]>(value || []);

  const isAllSelected = showSelectAll
    ? selectedOptions.length === options.length ||
      selectedOptions.some((opt: any) => opt.value === SELECT_ALL.value)
    : selectedOptions.length === options.length;

  const handleSelectChange = (selected: any) => {
    if (!selected) {
      setSelectedOptions([]);
      onChange([]);
      return;
    }

    const hasSelectAll = selected.some(
      (opt: any) => opt.value === SELECT_ALL.value
    );

    if (showSelectAll && hasSelectAll) {
      if (isAllSelected) {
        setSelectedOptions([]);
        onChange([]);
      } else {
        setSelectedOptions(options);
        onChange(options);
      }
    } else {
      setSelectedOptions(selected);
      onChange(selected);
    }
  };

  useEffect(() => {
    setSelectedOptions(value || []);
  }, [value]);

  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      <Select
        value={selectedOptions}
        className={`react-select-container ${className || ""} ${
          touched && error ? "is-invalid" : ""
        }`}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          Option: CheckboxOption,
          MultiValue: MultiValueContainer,
        }}
        onChange={handleSelectChange}
        options={fullOptions}
        styles={{
          ...styles,
          menu: (base) => ({
            ...base,
            zIndex: 9999,
            maxHeight: "300px",
            overflowY: "auto",
          }),
          control: (base) => ({
            ...base,
            flexWrap: "wrap",
            minHeight: "38px",
            maxHeight: "auto",
            overflowY: "auto",
          }),
        }}
        name={name}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        placeholder={placeholder}
        menuPlacement="auto"
      />
      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}
    </>
  );
};

export default CheckboxMultiSelect;
