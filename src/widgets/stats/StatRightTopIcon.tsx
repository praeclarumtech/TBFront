import React from "react";
import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import appConstants from "constants/constant";

interface StatRightProps {
  title: string;
  icon: React.ReactNode;
  data: any;
  error: any;
  classes: string;
  isLoading: boolean; // Renamed to isLoading for clarity
}

const { handleResponse } = appConstants;

export const StatRightTopIcon: React.FC<StatRightProps> = ({
  title,
  icon,
  data,
  error,
  classes,
  isLoading, // Check if data is still loading
}) => {
  return (
    <Card className="shadow-sm rounded-4 w-full">
      <Card.Body className="d-flex flex-column justify-content-between">
        {/* Title and Icon */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-muted">{title}</h5>
          <div className={classes}>{icon}</div>
        </div>
        <div>
          {isLoading ? (
            <Skeleton height={40} width={100} />
          ) : error ? (
            <div className="py-4 text-center">
              <i className="ri-search-line d-block fs-1 text-success"></i>
              {handleResponse?.dataNotFound}
            </div>
          ) : (
            <h1 className="fw-bold">{data}</h1>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
  