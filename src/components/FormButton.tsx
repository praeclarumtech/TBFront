// src/components/FormButton.tsx
import React from 'react';
import { Button } from '@mui/material';

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
  type = 'button',
  onClick,
  className,
  children,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`${className} font-bold text-white px-4 py-2 rounded`}
    >
      {children}
    </Button>
  );
};

export default FormButton;