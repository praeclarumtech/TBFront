// src/components/Form/SelectField.tsx
import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  register: any;
  name: string;
  error?: string;
  value: string;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, register, name, error, value, onChange }) => {
  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <Form.Label className='font-bold'>{label}</Form.Label>
      <Select
        {...register(name)}
        value={value}
        onChange={onChange}
        className='h-10'
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;