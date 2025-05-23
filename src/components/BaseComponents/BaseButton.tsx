/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseButtonProps } from "interfaces/global.interface";
import { Button, Spinner } from "reactstrap";

const BaseButton = ({
  color,
  disabled,
  loader,
  className,
  type,
  onClick,
  id,
  children,
  sx,
}: BaseButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Button
      id={id}
      color={color}
      disabled={disabled || loader}
      className={`btn ${color ? `btn-${color}` : ""} ${className}`}
      type={type}
      onClick={handleClick}
      style={sx}
    >
      {loader && <Spinner size="sm" className="me-2" />}
      {loader ? "Loading..." : children}
    </Button>
  );
};

export default BaseButton;