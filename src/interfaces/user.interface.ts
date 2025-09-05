import { ReactNode } from "react";

export interface ProfileFormData {
  profilePicture: string | File | null;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  designation: string;
  [key: string]: any;
}
export interface CheckboxDropdownProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onToggle?: () => void;
  isExpanded?: boolean;
  hasDropdown?: boolean;
  children?: ReactNode;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
}
