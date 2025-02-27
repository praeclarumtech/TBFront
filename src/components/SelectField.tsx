import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from "@mui/material";

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  register: (name: string) => {
    onChange: () => void;
    onBlur: () => void;
    ref: (instance: HTMLInputElement | null) => void;
  };
  name: string;
  error?: string;
  value: string;
  onChange: () => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  register,
  name,
  error,
  value,
  onChange,
}) => {
  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel className="font-bold">{label}</InputLabel>
      <Select
        {...register(name)}
        value={value}
        onChange={onChange}
        className="h-10"
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
