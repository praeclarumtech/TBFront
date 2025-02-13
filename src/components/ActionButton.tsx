// src/components/Form/ActionButton.tsx
import React from 'react';
import { Button } from '@mui/material';

interface ActionButtonProps {
  type: 'button' | 'submit';
  onClick?: () => void;
  label: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick, label, className }) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={className}
    >
      {label}
    </Button>
  );
};

export default ActionButton;