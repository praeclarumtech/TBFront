import { Fragment, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { StatRightTopIcon } from "widgets";
import { useLocation } from "react-router-dom";

import RecentApplicants from "sub-components/dashboard/RecentApplicants";
import {
  PeopleFill,
  // ExclamationCircleFill,
  XCircleFill,
  ClockFill,
  HCircleFill,
} from "react-bootstrap-icons";
import ApplicantsDeatils from "sub-components/dashboard/ApplicantsDetails";
import { getChartDetails, getTotalApplicants } from "api/dashboardApi";
import appConstants from "constants/constant";
import { CheckCircleFilled } from "@ant-design/icons";

const { projectTitle, Modules } = appConstants;

const Dashboard = () => {
  document.title = Modules.Dashboard + " | " + projectTitle;
  const [totalApplicants, setTotalApplicants] = useState<number | null>(null);
  const [holdApplicants, setHoldApplicants] = useState<number | null>(null);

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
  const [appliedApplicants, setAppliedApplicants] = useState<number | null>(
    null
  );
  const [shortListedApplicants, setShortListedApplicants] = useState<
    number | null
  >(null);
  const [onboardedApplicants, setOnboardedApplicants] = useState<number | null>(
    null
  );
  const [leavedApplicants, setLeavedApplicants] = useState<number | null>(null);

  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const location = useLocation();
  const applicantIds = location.state?.applicantIds || [];

  const handleResetFilter = () => {
    setSelectedTechnology(null);
  };

  useEffect(() => {
    fetchTotalApplicants();
    fetchChart();
  }, []);

  const fetchTotalApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await getTotalApplicants();
      console.log(data);
      setTotalApplicants(data.data.totalApplicants);
      setHoldApplicants(data.data.holdApplicants);
      // setPendingApplicants(data.data.pendingApplicants);
      setInProcessApplicants(data.data.inProgressApplicants); // renamed key
      setRejectedApplicants(data.data.rejectedApplicants);
      setSelectedApplicants(data.data.selectedApplicants);
      setAppliedApplicants(data.data.appliedApplicants);
      setShortListedApplicants(data.data.shortListedApplicants);
      setOnboardedApplicants(data.data.onboardedApplicants);
      setLeavedApplicants(data.data.leavedApplicants);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const applicantStats = [
    {
      title: "Total ",
      value: totalApplicants,
      icon: <PeopleFill size={25} />,
      color: "primary",
    },
    {
      title: "Applied",
      value: appliedApplicants,
      icon: <PeopleFill size={25} />,
      color: "secondary",
    },
    {
      title: "In Process",
      value: inProcessApplicants,
      icon: <ClockFill size={25} />,
      color: "info",
    },
    {
      title: "Shortlisted",
      value: shortListedApplicants,
      icon: <CheckCircleFilled style={{ fontSize: 25 }} />,
      color: "info",
    },
    {
      title: "Selected",
      value: selectedApplicants,
      icon: <CheckCircleFilled style={{ fontSize: 25 }} />,
      color: "success",
    },
    {
      title: "Onboarded",
      value: onboardedApplicants,
      icon: <CheckCircleFilled style={{ fontSize: 25 }} />,
      color: "success",
    },
    {
      title: "On Hold",
      value: holdApplicants,
      icon: <HCircleFill size={25} />,
      color: "warning",
    },
    {
      title: "Rejected",
      value: rejectedApplicants,
      icon: <XCircleFill size={25} />,
      color: "danger",
    },
    {
      title: "Leaved",
      value: leavedApplicants,
      icon: <XCircleFill size={25} />,
      color: "danger",
    },
  ];

  const [chartData, setChartData] = useState<any>([]);
  const fetchChart = async () => {
    if (!applicantIds) return;
    setChartLoading(true);
    try {
      const data = await getChartDetails(applicantIds);
      setChartData(data?.data);
    } catch (error) {
      setError("error");
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <Fragment>
      <div>
        <div className="pb-23"></div>
        <Container fluid className="px-6 mt-n23">
          {/* <Row className="pt-3 bg-primary mx-n6 mb-n6 mt-n8">
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
                icon={<HCircleFill size={25} style={{ fontWeight: "bold" }} />}
                data={holdApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-warning text-warning"
                isLoading={isLoading}
              />
            </Col>
            {/* <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Total Pending"
                icon={
                  <ExclamationCircleFill
                    size={25}
                    style={{ fontWeight: "bold" }}
                  />
                }
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
                  <CheckCircleFilled
                    style={{ fontSize: 25, fontWeight: "bold" }}
                  />
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
            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Applied"
                icon={<PeopleFill size={25} className="fw-bold" />}
                data={appliedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-primary text-primary fw-bold"
                isLoading={isLoading}
              />
            </Col>

            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Shortlisted"
                icon={<CheckCircleFilled style={{ fontSize: 25 }} />}
                data={shortListedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-info text-info"
                isLoading={isLoading}
              />
            </Col>

            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Onboarded"
                icon={<CheckCircleFilled style={{ fontSize: 25 }} />}
                data={onboardedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-success text-success"
                isLoading={isLoading}
              />
            </Col>

            <Col xl={2} lg={4} md={6} xs={6} className="mb-3">
              <StatRightTopIcon
                title="Leaved"
                icon={<XCircleFill size={25} />}
                data={leavedApplicants}
                error={error}
                classes="icon-shape icon-lg rounded-2 bg-light-danger text-danger"
                isLoading={isLoading}
              />
            </Col>
          </Row> */}
          <div
            className="pt-3 applicant-stats-scroll bg-primary mx-n6 mb-n6 mt-n8"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <style>
              {`
                .applicant-stats-scroll::-webkit-scrollbar {
                  display: none;
                 }
                .applicant-stats-scroll {
                   -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;    /* Firefox */
                  }
              `}
            </style>

            {applicantStats.map((stat, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ minWidth: "200px" }}
              >
                <StatRightTopIcon
                  title={stat.title}
                  icon={stat.icon}
                  data={stat.value}
                  error={error}
                  isLoading={isLoading}
                  classes={`icon-shape icon-lg rounded-2 bg-light-${stat.color} text-${stat.color}`}
                />
              </div>
            ))}
          </div>

          <Row className="mt-3">
            <Col xl={12}>
              <ApplicantsDeatils
                setSelectedTechnology={setSelectedTechnology}
                setData={chartData}
                isloading={chartLoading}
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
