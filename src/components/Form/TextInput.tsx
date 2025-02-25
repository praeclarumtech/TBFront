// src/components/Form/TextInput.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-bootstrap';

interface TextInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ name, label, type = 'text', placeholder }) => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <Form.Group controlId={name}>
      <Form.Label className='font-bold'>{label}</Form.Label>
      <Form.Control
        type={type}
        {...register(name)}
        isInvalid={!!errors?.[name]}
        placeholder={placeholder}
      />
      <Form.Control.Feedback type="invalid">
        {errors?.[name]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInput;