import React from "react";
import appConstants from "constants/constant";

const { handleResponse } = appConstants;

interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = handleResponse?.dataNotFound || "No Records Found",
  className = "",
}) => {
  return (
    <div className={`py-4 text-center ${className}`}>
      <i className="ri-search-line d-block fs-1 text-success"></i>
      <p
        className="mt-2 mb-0"
        style={{
          fontSize: "15px",
          fontFamily: "inherit",
          fontWeight: 400,
          color: "#6c757d",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
