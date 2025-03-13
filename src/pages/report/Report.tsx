import  { Fragment, useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  BoxArrowInUpRight,
  Check2Circle,
  Icon1Circle,
  Icon2Circle,
} from "react-bootstrap-icons";
import DounutChart from "sub-components/report/DounutChart";
import ProgressBar from "sub-components/report/ProgressBar";
import ProgressChart from "sub-components/report/ProgressChart";
import { getApplicationOnProcess } from "api/reportApi";
import AreaChart from "sub-components/report/AreaChart";
const Report = () => {
  const [applicantsOnProcess1, setApplicantsOnProcess1] = useState([]);
  const [applicantsOnProcess2, setApplicantsOnProcess2] = useState([]);
  const [applicantsOnProcess3, setApplicantsOnProcess3] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

console.log(error)

  useEffect(() => {
    fetchApplicantsOnProcess();
  }, []);

  const fetchApplicantsOnProcess = async () => {
    setIsLoading(true);
    try {
      const data = await getApplicationOnProcess();
      console.log("API Response:", data);
      // ✅ Check if data exists before setting state
      setApplicantsOnProcess1(data.data.technicalRoundApplicants);
      setApplicantsOnProcess2(data.data.hrRoundApplicants);
      setApplicantsOnProcess3(data.data.finalRoundApplicants);
      console.log(data.data)
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        {/* <div className="pt-5 pb-21"></div> */}
        <Container fluid className="px-6 pt-5">
          <div>
            <Row className="grid grid-rows-2">
              <Col className="w-full">
                <Card className="shadow-sm p-3 rounded-4 ">
                  <Card.Body className="d-flex flex-column justify-between">
                    <Row>
                      <div className="d-flex justify-between mb-2">
                        <Col xl={8} lg={6} md={6} xs={12}>
                          <h4 className="fw-bold w-full">
                            {" "}
                            Applicantion on Process
                          </h4>
                          <div className="mt-5">
                            <div className="d-flex my-2">
                              <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-warning text-warning">
                                {/* <Cart /> */}
                                <Icon1Circle size={20}/>
                              </div>
                              <ProgressBar
                                value={applicantsOnProcess1}
                                colour="bg-warning"
                                lebel= "Technical Round"
                                loading={isLoading}
                              />
                            </div>
                            <div className="d-flex my-2">
                              <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-success text-success">
                                {/* <Truck /> */}
                                <Icon2Circle size={20}/>
                              </div>
                              <ProgressBar
                                value={applicantsOnProcess2}
                                colour="bg-success"
                                lebel="HR Round"
                                loading={isLoading}
                              />
                            </div>
                            <div className="d-flex my-2">
                              <div className="icon-shape icon-lg rounded-2 shadow-md bg-light-info text-info">
                                <Check2Circle size={20}/>
                              </div>
                              <ProgressBar
                                value={applicantsOnProcess3}
                                colour="bg-info"
                                lebel="Final Round"
                                loading={isLoading}
                              />
                            </div>
                            {/* <div className="d-flex my-2">
                              <div className="icon-shape icon-md rounded-2 shadow-md bg-light-info text-info">
                                <Icon2Circle />
                              </div>
                              <ProgressBar value={74} colour="bg-info" />
                            </div> */}
                          </div>
                        </Col>
                        <Col xl={4} lg={6} md={6} xs={12}>
                          <div className="flex">
                            <h4 className="fw-bold mr-2">
                              Status of Application
                            </h4>{" "}
                            <a href="" className="d-flex mr-2">
                              {" "}
                              View Details{" "}
                              <BoxArrowInUpRight className="Inline text" />
                            </a>
                          </div>
                          <div className="flex mt-2">
                            <ProgressChart />
                          </div>
                        </Col>
                      </div>
                    </Row>
                    <Row>
                      <div className="d-flex justify-content-between">
                        <Col xl={6} lg={6} md={6} xs={12}>
                          <h4 className="fw-bold">Statistics</h4>
                          <div className="items-center justify-center">
                            <DounutChart />
                          </div>
                        </Col>
                        <Col xl={6} lg={6} md={6} xs={12}>
                          <h4 className="fw-bold"> Applicants </h4>
                          <div className="items-center mt-3">
                            {/* <AreaChart /> */}
                              <AreaChart />
                          </div>
                        </Col>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Report;
