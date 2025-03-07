import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTotalApplicants } from "api/dashboardApi";
import appConstants from "constants/constant";

interface StatRightProps {
  title: string;
  icon: React.ReactNode;
  data: any;
  error: any;
  classes: string;
}
const { handleResponse } = appConstants;

export const StatRightTopIcon: React.FC<StatRightProps> = ({
  title,
  icon,
  data,
  error,
  classes,
}) => {
  return (
    <Card className="shadow-sm p-3 rounded-4 w-full">
      {/* // <Card> */}
      <Card.Body className="d-flex flex-column justify-content-between ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-muted">{title}</h5>
          <div className={classes}>{icon}</div>
        </div>
        <div>
          {error ? (
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
