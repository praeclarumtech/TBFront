import React from "react";
import { Form } from "react-bootstrap";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder?: string;
  register: (name: string) => {
    onChange: () => void;
    onBlur: () => void;
    ref: (instance: HTMLInputElement | null) => void;
  };
  name: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  register,
  name,
  error,
}) => {
  return (
    <Form.Group controlId={name}>
      <Form.Label className="font-bold">{label}</Form.Label>
      <Form.Control
        type={type}
        {...register(name)}
        isInvalid={!!error}
        placeholder={placeholder}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputField;
