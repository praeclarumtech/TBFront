// import { Container } from "react-bootstrap/lib/Tab";
import { Dropdown } from "react-bootstrap";
import { Col, Row, Card } from "react-bootstrap";
import LineChart from "./chart/LineChart";

const ApplicantsDeatils = () => {
  return (
    <div>
      <Row className="mt-6">
        {/* mt-6*/}
        <Col>
          <Card>
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <div className="h4">Applicants Details</div>
              <div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-primary"
                    id="dropdown-basic"
                  >
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/react">React JS</Dropdown.Item>
                    <Dropdown.Item href="#/node">Node JS</Dropdown.Item>
                    <Dropdown.Item href="#/mern">MERN Stack</Dropdown.Item>
                    <Dropdown.Item href="#/vue">Vue JS</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>
            <Card.Body>
              <LineChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ApplicantsDeatils;
