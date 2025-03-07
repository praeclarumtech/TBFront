import { Fragment } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { StatRightTopIcon } from "widgets";
import RecentApplicants from "sub-components/dashboard/RecentApplicants";
import { People, ListTask, ClockHistory, GraphUp } from "react-bootstrap-icons";
import ApplicantsDeatils from "sub-components/dashboard/ApplicantsDetails";

const Dashboard = () => {
  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="pt-5 pb-21"></div>
        <Container fluid className="mt-n22 px-6">
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
                api={"totalApplicants"}
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
                api={"inProcessApplicants"}
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
                api={"holdApplicants"}
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
                api={"pendingApplicants"}
                classes={
                  "icon-shape icon-md rounded-2 bg-light-danger text-danger"
                }
              />
            </Col>
          </Row>

          {/* <ActiveProjects /> */}
          <Row className="my-3">
            <Col xl={6} lg={12} md={12} xs={12}>
              <ApplicantsDeatils />
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
