import React from "react";
import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyState from "components/BaseComponents/EmptyState";

interface StatRightProps {
  title: string;
  icon: React.ReactNode;
  data: any;
  error: any;
  classes: string;
  isLoading: boolean; // Renamed to isLoading for clarity
}


export const StatRightTopIcon: React.FC<StatRightProps> = ({
  title,
  icon,
  data,
  error,
  classes,
  isLoading, // Check if data is still loading
}) => {
  return (
    <Card className="w-full shadow-sm rounded-4">
      <Card.Body className="d-flex flex-column justify-content-between">
        {/* Title and Icon */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          {isLoading ? (
            <>
              <Skeleton height={48} width={90} />
            </>
          ) : (
            <h4 style={{ fontSize: "1.1rem" }} className="mb-0 text-muted">
              {title}
            </h4>
          )}{" "}
          {isLoading ? (
            <>
              <Skeleton height={48} width={48} />
            </>
          ) : (
            <div className={classes}>{icon}</div>
          )}
        </div>
        <div>
          {isLoading ? (
            <Skeleton height={40} width={100} />
          ) : error ? (
            <EmptyState />
          ) : (
            <h1 className="fw-bold"> {data}</h1>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
