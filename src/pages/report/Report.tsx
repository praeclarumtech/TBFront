import { Fragment, useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  Check2Circle,
  Icon1Circle,
  Icon2Circle,
  Laptop,
  PersonCircle,
} from "react-bootstrap-icons";
import DounutChart from "sub-components/report/DounutChart";
import ProgressBars from "sub-components/report/ProgressBar";
import ProgressChart from "sub-components/report/ProgressChart";
import { getApplicationOnProcess } from "api/reportApi";
import AreaChart from "sub-components/report/AreaChart";
import appConstants from "constants/constant";

const { projectTitle, Modules } = appConstants;

const Report = () => {
  document.title = Modules.Reports + " | " + projectTitle;
  const [applicantsOnProcess1, setApplicantsOnProcess1] = useState([]);
  const [applicantsOnProcess2, setApplicantsOnProcess2] = useState([]);
  const [applicantsOnProcess3, setApplicantsOnProcess3] = useState([]);
  const [applicantsOnProcess4, setApplicantsOnProcess4] = useState([]);
  const [applicantsOnProcess5, setApplicantsOnProcess5] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorS, setErrorS] = useState<string | null>(null);

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
              <Card className="shadow-sm p-3 rounded-4 w-100">
                <Card.Body className="d-flex flex-column">
                  <Row>
                    <Col xl={8} lg={6} md={12} sm={12} xs={12}>
                      <h4 className="fw-bold w-full">
                        {" "}
                        Application on Process
                      </h4>
                      <div className="mt-5">
                        <div className="d-flex my-2">
                          <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-warning text-warning">
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
                        <div className="d-flex my-2">
                          <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-success text-success">
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
                        <div className="d-flex my-2">
                          <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-danger text-danger">
                            <Laptop size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess3}
                            colour="danger"
                            label="Technical Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="d-flex my-2">
                          <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-primary text-primary">
                            <Check2Circle size={20} />
                          </div>
                          <ProgressBars
                            value={applicantsOnProcess4}
                            colour="primary"
                            label="HR Round"
                            loading={isLoading}
                          />
                        </div>
                        <div className="d-flex my-2">
                          <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-info text-info">
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
                      <div className="chart-container mt-2">
                        <ProgressChart />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col xl={6} lg={6} md={12} sm={12} xs={12} className="mb-4">
                      <h4 className="fw-bold">Statistics</h4>
                      <div className="chart-container">
                        <DounutChart />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                      <h4 className="fw-bold">Applicants</h4>
                      <div className="chart-container mt-3">
                        {" "}
                        <AreaChart />
                      </div>
                    </Col>
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
