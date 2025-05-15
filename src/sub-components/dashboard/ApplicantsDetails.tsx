// import { useState } from "react";
import BarChart from "./chart/BarChart";
import { Card, Col, Row } from "react-bootstrap";

const ApplicantsDetails = ({
  setSelectedTechnology,
  setData,
  isloading,
}: {
  setSelectedTechnology: (tech: string | null) => void;
  setData: any;
  isloading: boolean;
}) => {
  return (
    <Row className="mt-6">
      <Col>
        <Card className=" w-full min-h-[400px]">
          <Card.Header className="p-4 bg-white border-0 d-flex justify-content-between align-items-center">
            <h4 className="h4">Skills Statistics</h4>
          </Card.Header>
          <Card.Body className="pt-0">
            <BarChart
              onBarClick={setSelectedTechnology}
              selectedFilter={setData}
              isloading={isloading}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ApplicantsDetails;
