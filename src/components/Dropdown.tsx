import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-bootstrap';

interface DropdownProps {
  
  isInvalid?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string; // Ensure this is defined
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  colProps?: { xs: number; sm: number; lg: number;md:number};
  // children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  isInvalid,
  errorMessage,
  fullWidth = true,
  disabled = false,
  multiple = false,
}) => {
  const { register } = useFormContext();

  return (
    <FormControl fullWidth={fullWidth} error={isInvalid} disabled={disabled}>
      <Form.Label className='font-bold'>{label}</Form.Label>
      <Select
        {...register(name)}
        value={value}
        onChange={(event, child) => onChange(event, child)}
        multiple={multiple}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {isInvalid && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;