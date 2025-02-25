import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colProps?: { xs: number; sm: number; lg: number;md:number };
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  isInvalid,
  errorMessage,
  colProps,
}) => {
  const { register } = useFormContext();

  return (
    <Col {...colProps}>
      <Form.Group controlId={name}>
        <Form.Label className='font-bold'>{label}</Form.Label>
        <Form.Control
          type={type}
          {...register(name)}
          value={value}
          onChange={onChange}
          isInvalid={isInvalid}
          placeholder={placeholder}
        />
        {isInvalid && (
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Col>
  );
};

export default FormField;