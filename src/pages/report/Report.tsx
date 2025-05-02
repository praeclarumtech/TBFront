import { Fragment, useState, useEffect } from "react";
import { Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import {
  Check2Circle,
  Icon1Circle,
  Icon2Circle,
  Laptop,
  PersonCircle,
} from "react-bootstrap-icons";
// import DounutChart from "sub-components/report/DounutChart";
import ProgressBars from "sub-components/report/ProgressBar";
import ProgressChart from "sub-components/report/ProgressChart";
import { getApplicationOnProcess } from "api/reportApi";
import AreaChart from "sub-components/report/AreaChart";
import appConstants from "constants/constant";
import ColumnChart from "sub-components/report/ColumnChart";

const { projectTitle, Modules } = appConstants;

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
        {selectedFilter ||
          // "Select Filters" ||
          "city"}
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
        <Dropdown.Item eventKey="city">City</Dropdown.Item>
        <Dropdown.Item eventKey="state">State</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Report = () => {
  document.title = Modules.Reports + " | " + projectTitle;
  const [applicantsOnProcess1, setApplicantsOnProcess1] = useState([]);
  const [applicantsOnProcess2, setApplicantsOnProcess2] = useState([]);
  const [applicantsOnProcess3, setApplicantsOnProcess3] = useState([]);
  const [applicantsOnProcess4, setApplicantsOnProcess4] = useState([]);
  const [applicantsOnProcess5, setApplicantsOnProcess5] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorS, setErrorS] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("city");

  useEffect(() => {
    fetchApplicantsOnProcess();
  }, []);

  const fetchApplicantsOnProcess = async () => {
    setIsLoading(true);
    try {
      const data = await getApplicationOnProcess();
      // ✅ Check if data exists before setting state
      setApplicantsOnProcess1(data.data.firstInterviewRoundApplicants);
      setApplicantsOnProcess2(data.data.practicalRoundApplicants);
      setApplicantsOnProcess3(data.data.technicalRoundApplicants);
      setApplicantsOnProcess4(data.data.hrRoundApplicants);
      setApplicantsOnProcess5(data.data.clientInterviewApplicants);
    } catch (error) {
      console.error("API Error:", error);
      setErrorS("Failed to load Api");
      console.log(errorS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <Container fluid className="px-3 pt-5">
          <Row className="gy-3">
            <Col xs={12}>
              <Card className="p-3 shadow-sm rounded-4 w-100">
                <Card.Body className="d-flex flex-column">
                  <Row>
                    <Col xl={8} lg={6} md={12} sm={12} xs={12}>
                      <h4 className="w-full fw-bold">
                        {" "}
                        Application on Process
                      </h4>
                      <div className="mt-5">
                        <div className="my-2 d-flex">
                          <div className="shadow-md icon-shape icon-lg rounded-2 bg-light-warning text-warning">
                            {/* <Cart /> */}
                            <Icon1Circle size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess1}
                            colour="warning"
                            label="First Interview Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="my-2 d-flex">
                          <div className="shadow-md icon-shape icon-lg rounded-2 bg-light-success text-success">
                            {/* <Truck /> */}
                            <Icon2Circle size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess2}
                            colour="success"
                            label="Practical Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="my-2 d-flex">
                          <div className="shadow-md icon-shape icon-lg rounded-2 bg-light-danger text-danger">
                            <Laptop size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess3}
                            colour="danger"
                            label="Technical Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="my-2 d-flex">
                          <div className="shadow-md icon-shape icon-lg rounded-2 bg-light-primary text-primary">
                            <Check2Circle size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess4}
                            colour="primary"
                            label="HR Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="my-2 d-flex">
                          <div className="shadow-md icon-shape icon-lg rounded-2 bg-light-info text-info">
                            <PersonCircle size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess5}
                            colour="info"
                            label="Client Round"
                            loading={isLoading}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col
                      xl={4}
                      lg={6}
                      md={12}
                      sm={12}
                      xs={12}
                      className="mt-3 mt-lg-0"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold">Status of Application</h4>
                      </div>
                      <div className="mt-2 chart-container">
                        <ProgressChart />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    {/* <Col xl={7} lg={6} md={12} sm={12} xs={12}> */}
                    <div className="justify-between d-flex">
                      <h4 className="justify-start fw-bold">Statistics</h4>
                      <ActionMenu
                        setSelectedFilter={setSelectedFilter}
                        selectedFilter={selectedFilter}
                      />
                    </div>
                    {/* <div className="chart-container">
                        <DounutChart selectedFilter={selectedFilter} />
                      </div> */}
                    <div className="chart-container mt-3">
                      <ColumnChart selectedFilter={selectedFilter} />
                    </div>
                    {/* </Col> */}
                    {/* <Col xl={5} lg={6} md={12} sm={12} xs={12}>
                      <h4 className="fw-bold">Applicants</h4>
                      <div className="mt-3 chart-container">
                        {" "}
                        <AreaChart />
                      </div>
                    </Col> */}
                  </Row>
                  <Row className="mt-4">
                    <h4 className="fw-bold">Applicants</h4>
                    <div className="mt-3 chart-container">
                      {" "}
                      <AreaChart />
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Report;
