import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  size?: "sm" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "lg",
  className = "",
}) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{ minHeight: "200px" }}
    >
      <Spinner animation="border" size={size} role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
