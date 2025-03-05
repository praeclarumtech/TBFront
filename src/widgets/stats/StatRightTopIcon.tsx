import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getTotalApplicants } from "api/dashboardApi";
import appConstants from "constants/constant";

interface StatRightProps {
  title: string;
  icon: React.ReactNode;
  api: string;
  classes: string;
}
const { handleResponse } = appConstants;

export const StatRightTopIcon: React.FC<StatRightProps> = ({
  title,
  icon,
  api,
  classes,
}) => {
  const [totalApplicants, setTotalApplicants] = useState<number | null>(null);
  const [holdApplicants, setHoldApplicants] = useState<number | null>(null);
  const [pendingApplicants, setPendingApplicants] = useState<number | null>(
    null
  );
  const [inProcessApplicants, setInProcessApplicants] = useState<number | null>(
    null
  );

  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    try {
      const data = await getTotalApplicants();
      console.log(data);
      setTotalApplicants(data.data.totalApplicants);
      setHoldApplicants(data.data.holdApplicants);
      setPendingApplicants(data.data.pendingApplicants);
      setInProcessApplicants(data.data.inProcessApplicants);
    } catch (error) {
      setError("Failed to load applicants");
      console.error("API Error:", error);
    }
  };

  let app: number | null = null;

  switch (api) {
    case "totalApplicants":
      app = totalApplicants;
      break;
    case "inProcessApplicants":
      app = inProcessApplicants;
      break;
    case "holdApplicants":
      app = holdApplicants;
      break;
    case "pendingApplicants":
      app = pendingApplicants;
      break;
    default:
      app = null;
  }

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
            <h1 className="fw-bold">{app}</h1>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
