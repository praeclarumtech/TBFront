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
        <Dropdown.Item eventKey="frontend">Frontend</Dropdown.Item>
        <Dropdown.Item eventKey="backend">Backend</Dropdown.Item>
        <Dropdown.Item eventKey="fullstack">Fullstack</Dropdown.Item>
        <Dropdown.Item eventKey="testing">Testing</Dropdown.Item>
        <Dropdown.Item eventKey="uiux">Ui/Ux</Dropdown.Item>
        <Dropdown.Item eventKey="versioncontrol">Version Control</Dropdown.Item>
        <Dropdown.Item eventKey="devops">Development Operations</Dropdown.Item>
        <Dropdown.Item eventKey="programming">
          Programming Language
        </Dropdown.Item>
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
  console.log("HElooooooooooooooooooooo", selectedFilter);

  return (
    <Row className="mt-6">
      <Col>
        <Card className=" w-full min-h-[400px]">
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4">
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
