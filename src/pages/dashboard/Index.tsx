import { Fragment, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { StatRightTopIcon } from "widgets";
import RecentApplicants from "sub-components/dashboard/RecentApplicants";
import {
  // People,
  // ClockHistory,
  // GraphUp,
  // Check2Circle,
  // XCircle,
  // ExclamationCircle,
  PeopleFill,
  ExclamationCircleFill,
  XCircleFill,
  ClockFill,
  // ExclamationDiamondFill,
  HCircleFill,
} from "react-bootstrap-icons";
import ApplicantsDeatils from "sub-components/dashboard/ApplicantsDetails";
import { getTotalApplicants } from "api/dashboardApi";
import appConstants from "constants/constant";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const { projectTitle, Modules } = appConstants;

const Dashboard = () => {
  const navigate = useNavigate();

  document.title = Modules.Dashboard + " | " + projectTitle;
  const [totalApplicants, setTotalApplicants] = useState<number | null>(null);
  const [holdApplicants, setHoldApplicants] = useState<number | null>(null);
  const [pendingApplicants, setPendingApplicants] = useState<number | null>(
    null
  );
  const [inProcessApplicants, setInProcessApplicants] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true); // ✅ Tracks loading
  const [error, setError] = useState<string | null>(null);
  const [rejectedApplicants, setRejectedApplicants] = useState<number | null>(
    null
  );
  const [selectedApplicants, setSelectedApplicants] = useState<number | null>(
    null
  );

  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(
    null
  );

  const handleResetFilter = () => {
    setSelectedTechnology(null);
  };

  // const handleBarClick = (technology: string) => {
  //   setSelectedTechnology(technology);
  // };

  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await getTotalApplicants();

      setTotalApplicants(data.data.totalApplicants);
      setHoldApplicants(data.data.holdApplicants);
      setPendingApplicants(data.data.pendingApplicants);
      setInProcessApplicants(data.data.inProcessApplicants);
      setRejectedApplicants(data.data.rejectedApplicants);
      setSelectedApplicants(data.data.selectedApplicants);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div>
        <div className="pb-23"></div>
        <Container fluid className="mt-n23 px-6">
          <Row className="bg-primary mx-n6 mb-n6 mt-n8 pt-3">
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Total Applicants"
                icon={
                  <PeopleFill
                    size={25}
                    strokeWidth={2.5}
                    onClick={() => navigate("/applicants")}
                    className="cursor-pointer fw-bold"
                  />
                }
                data={totalApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-primary text-primary fw-bold"
                isLoading={isLoading}
              />
            </Col>
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="In Process"
                icon={<ClockFill size={25} style={{ fontWeight: "bold" }} />}
                data={inProcessApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-info text-info"
                isLoading={isLoading}
              />
            </Col>
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="On Hold"
                // icon={<GraphUp size={25} />}
                icon = {<HCircleFill size={25} style={{ fontWeight: "bold" }}/>}
                data={holdApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-warning text-warning"
                isLoading={isLoading}
              />
            </Col>
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Total Pending"
                icon={<ExclamationCircleFill size={25} style={{ fontWeight: "bold" }}/>}
                data={pendingApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-warning text-warning"
                isLoading={isLoading}
              />
            </Col>
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Selected"
                icon={
                  <CheckCircleFilled style={{ fontSize: 25,fontWeight: "bold" }} />
                }
                data={selectedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-success text-success"
                isLoading={isLoading}
              />
            </Col>
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Rejected"
                icon={<XCircleFill size={25} style={{ fontWeight: "bold" }} />}
                data={rejectedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-danger text-danger"
                isLoading={isLoading}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl={12}>
              <ApplicantsDeatils
                setSelectedTechnology={setSelectedTechnology}
              />
            </Col>
            <Col xl={12}>
              <RecentApplicants
                selectedTechnology={selectedTechnology}
                onResetFilter={handleResetFilter}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Dashboard;
