import BarChart from "./chart/BarChart";
import { Card, Col, Row } from "react-bootstrap";


const ApplicantsDetails = ({
  setSelectedTechnology,
}: {
  setSelectedTechnology: (tech: string | null) => void;
}) => {
  return (
    <Row className="mt-6">
      <Col>
        <Card className=" w-full min-h-[400px]">
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4">
            <h4 className="h4">Skills Statistics</h4>
          </Card.Header>
          <Card.Body>
            <BarChart onBarClick={setSelectedTechnology} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ApplicantsDetails;
