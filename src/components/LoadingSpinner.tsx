import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{ minHeight: "200px" }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
