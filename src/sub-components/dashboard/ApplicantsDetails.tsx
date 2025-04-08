import { useState } from "react";
import BarChart from "./chart/BarChart";
import { Card, Col, Dropdown, Row } from "react-bootstrap";

// import LineChart from "./chart/LineChart";

const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ActionMenu = ({
  setSelectedFilter,
  selectedFilter,
}: {
  setSelectedFilter: (filter: string) => void;
  selectedFilter: string;
}) => {
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedFilter(eventKey); // Update filter when an option is selected
    }
  };
  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="outline-primary">
        {capitalizeWords(selectedFilter) ||
          // "Select Filters" ||
          "Frontend"}
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
        <Dropdown.Item eventKey="Frontend">Frontend</Dropdown.Item>
        <Dropdown.Item eventKey="Backend">Backend</Dropdown.Item>
        <Dropdown.Item eventKey="Database">Database</Dropdown.Item>
        <Dropdown.Item eventKey="Testing">Testing</Dropdown.Item>
        {/* <Dropdown.Item eventKey="UIUX">Ui/Ux</Dropdown.Item> */}
        <Dropdown.Item eventKey="uiux">Ui/Ux</Dropdown.Item>

        <Dropdown.Item eventKey="VersionControl">Version Control</Dropdown.Item>
        <Dropdown.Item eventKey="devops">Development Operations</Dropdown.Item>
        <Dropdown.Item eventKey="Programming">
          Programming Language
        </Dropdown.Item>
        {/* <Dropdown.Item eventKey="Others">Others</Dropdown.Item> */}
        <Dropdown.Item eventKey="others">Others</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const ApplicantsDetails = ({
  setSelectedTechnology,
}: {
  setSelectedTechnology: (tech: string | null) => void;
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  return (
    <Row className="mt-6">
      <Col>
        <Card className=" w-full min-h-[400px]">
          <Card.Header className="p-4 bg-white border-0 d-flex justify-content-between align-items-center">
            <h4 className="h4">Skills Statistics</h4>
            <ActionMenu
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          </Card.Header>
          <Card.Body>
            <BarChart
              onBarClick={setSelectedTechnology}
              selectedFilter={selectedFilter}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ApplicantsDetails;
