/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { FormFeedback, Label } from "reactstrap";
import { MultiSelectCheckBoxProps } from "interfaces/global.interface";

const SELECT_ALL = { label: "Select All", value: "__all__" };

// ✅ Custom checkbox option with input
const CheckboxOption = (props: any) => (
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

// ✅ Correct: DO NOT REMOVE the search input
const ValueContainer = ({ children, ...props }: any) => {
  // children[0] = selected values, children[1] = search input
  const [values, input] = children;
  const count = props.getValue().length;

  return (
    <components.ValueContainer {...props}>
      {count > 0 ? `${count} selected` : values}
      {input}
    </components.ValueContainer>
  );
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
  zIndex,
  showSelectAll = true,
}: MultiSelectCheckBoxProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // ✅ Is all real options selected?
  const isAllSelected =
    selectedOptions.length === options.length && options.length > 0;

  // ✅ Include "Select All" only if not all selected
  const fullOptions =
    showSelectAll && !isAllSelected ? [SELECT_ALL, ...options] : options;

  const handleSelectChange = (selected: any) => {
    if (!selected) {
      setSelectedOptions([]);
      onChange([]);
      return;
    }

    const hasSelectAll = selected.some(
      (opt: any) => opt.value === SELECT_ALL.value
    );

    if (hasSelectAll) {
      if (isAllSelected) {
        // ✅ Deselect all
        setSelectedOptions([]);
        onChange([]);
      } else {
        // ✅ Select all real options
        setSelectedOptions(options);
        onChange(options);
      }
    } else {
      // ✅ Remap to match references
      const mapped = selected
        .map((s: any) => options.find((opt) => opt.value === s.value))
        .filter(Boolean);

      setSelectedOptions(mapped);
      onChange(mapped);
    }
  };

  useEffect(() => {
    if (value && value.length > 0) {
      const mapped = value
        .map((v: any) => options.find((opt) => opt.value === v.value))
        .filter(Boolean);
      setSelectedOptions(mapped);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options]);

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
          ValueContainer: ValueContainer, // ✅ Only override ValueContainer, NOT MultiValueContainer!
        }}
        onChange={handleSelectChange}
        options={fullOptions}
        styles={{
          ...styles,
          menu: (base) => ({
            ...base,
            zIndex: zIndex,
            maxHeight: "300px",
            overflowY: "auto",
          }),
          menuPortal: (base) => ({ ...base, zIndex: zIndex }),
          control: (base) => ({
            ...base,
            flexWrap: "nowrap",
            minHeight: "38px",
            maxHeight: "38px",
            overflowY: "hidden",
          }),
        }}
        name={name}
        onBlur={handleBlur}
        isClearable
        isDisabled={isDisabled}
        placeholder={placeholder}
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={document.body}
      />

      {touched && error && (
        <FormFeedback className="d-block">{error}</FormFeedback>
      )}
    </>
  );
};

export default CheckboxMultiSelect;
