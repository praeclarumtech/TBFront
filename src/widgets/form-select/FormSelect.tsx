import { Fragment } from "react";
import { Form } from "react-bootstrap";

interface FormSelectProps {
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  placeholder,
  id,
  name,
  className,
  options,
  value,
  onChange,
}) => {
  return (
    <Fragment>
      <Form.Select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
      >
        {placeholder && (
          <option value="" className="text-muted">
            {placeholder}
          </option>
        )}
        {options.map((item, index) => (
          <option key={index} value={item.value} className="text-dark">
            {item.label}
          </option>
        ))}
      </Form.Select>
    </Fragment>
  );
};

export default FormSelect;
