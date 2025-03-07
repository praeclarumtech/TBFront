import { Fragment, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { StatRightTopIcon } from "widgets";
import RecentApplicants from "sub-components/dashboard/RecentApplicants";
import { People, ListTask, ClockHistory, GraphUp } from "react-bootstrap-icons";
import ApplicantsDeatils from "sub-components/dashboard/ApplicantsDetails";
import { getTotalApplicants } from "api/dashboardApi";

const Dashboard = () => {
  const [totalApplicants, setTotalApplicants] = useState<any>();
  const [holdApplicants, setHoldApplicants] = useState<number | null>(null);
  const [pendingApplicants, setPendingApplicants] = useState<number | null>(
    null
  );
  const [inProcessApplicants, setInProcessApplicants] = useState<number | null>(
    null
  );

  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

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

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="pt-5 pb-23 bg-primary"></div>
        <Container fluid className="mt-n23 px-6">
          <Row>
            <Col
              xl={3}
              lg={6}
              md={6}
              xs={12}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <StatRightTopIcon
                title="Total Applicants"
                icon={<People size={18} />}
                data={totalApplicants}
                error={error}
                classes={
                  "icon-shape icon-md rounded-2 bg-light-primary text-primary"
                }
              />
            </Col>
            <Col
              xl={3}
              lg={6}
              md={6}
              xs={12}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <StatRightTopIcon
                title="Applicants in Process"
                icon={<ListTask size={18} />}
                data={inProcessApplicants}
                error={error}
                classes={
                  "icon-shape icon-md rounded-2 bg-light-success text-success"
                }
              />
            </Col>
            <Col
              xl={3}
              lg={6}
              md={6}
              xs={12}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <StatRightTopIcon
                title="Applicants on Hold"
                icon={<GraphUp size={18} />}
                data={holdApplicants}
                error={error}
                classes={
                  "icon-shape icon-md rounded-2 bg-light-warning text-warning"
                }
              />
            </Col>
            <Col
              xl={3}
              lg={6}
              md={6}
              xs={12}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <StatRightTopIcon
                title="Total Pending "
                icon={<ClockHistory size={18} />}
                data={pendingApplicants}
                error={error}
                classes={
                  "icon-shape icon-md rounded-2 bg-light-danger text-danger"
                }
              />
            </Col>
          </Row>

          {/* <ActiveProjects /> */}
          <Row className="mb-3">
            <Col xl={6} lg={12} md={12} xs={12}>
              <ApplicantsDeatils  />
            </Col>
            <Col xl={6} lg={12} md={12} xs={12}>
              <RecentApplicants />
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};
export default Dashboard;
