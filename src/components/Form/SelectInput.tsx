// src/components/Form/SelectInput.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface SelectInputProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
  placeholder?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  name, 
  label, 
  options, 
  disabled, 
  placeholder 
}) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label={label}
            disabled={disabled}
            displayEmpty
            className="h-10 my-1"
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name] && (
        <FormHelperText>{errors[name].message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectInput;