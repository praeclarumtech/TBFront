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
  CheckCircleFill,
  ClipboardCheckFill,
  DoorOpenFill,
  HourglassSplit,
  PersonCheckFill,
  PersonPlusFill,
} from "react-bootstrap-icons";
import ApplicantsDeatils from "sub-components/dashboard/ApplicantsDetails";
import { getTotalApplicants } from "api/dashboardApi";
import appConstants from "constants/constant";
import { useNavigate } from "react-router-dom";

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

  const location = useLocation();
  const applicantIds = location.state?.applicantIds || [];
  const navigate = useNavigate();

  const handleResetFilter = () => {
    setSelectedTechnology(null);
  };

  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await getTotalApplicants();

      setTotalApplicants(data.data.totalApplicants);
      setHoldApplicants(data.data.holdApplicants);
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
      title: "Total",
      value: totalApplicants,
      icon: <PeopleFill size={25} />,
      color: "primary",
    },
    {
      title: "Applied",
      value: appliedApplicants,
      icon: <PersonPlusFill size={25} />, // applied => new applicant
      color: "secondary",
    },
    {
      title: "In Process",
      value: inProcessApplicants,
      icon: <ClockFill size={25} />, // in process => clock
      color: "info",
    },
    {
      title: "Shortlisted",
      value: shortListedApplicants,
      icon: <ClipboardCheckFill size={25} />, // shortlisted => checklist
      color: "info",
    },
    {
      title: "Selected",
      value: selectedApplicants,
      icon: <CheckCircleFill size={25} />, // selected => check mark
      color: "success",
    },
    {
      title: "Onboarded",
      value: onboardedApplicants,
      icon: <PersonCheckFill size={25} />, // onboarded => person with check
      color: "success",
    },
    {
      title: "On Hold",
      value: holdApplicants,
      icon: <HourglassSplit size={25} />, // on hold => hourglass
      color: "warning",
    },
    {
      title: "Rejected",
      value: rejectedApplicants,
      icon: <XCircleFill size={25} />, // rejected => cross
      color: "danger",
    },
    {
      title: "Leaved",
      value: leavedApplicants,
      icon: <DoorOpenFill size={25} />, // leaved => door open
      color: "danger",
    },
  ];

  const handleCardClick = (status: string) => {
    const filter = status.toLowerCase().replace(/\s+/g, " ");
    console.log("Clicked:", status);
    if (status === "Total") {
      navigate("/applicants");
    } else if (status === "Applied") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "In Process") {
      const encodedStatus = encodeURIComponent("in progress");
      navigate(`/applicants?status=${encodedStatus}`);
    } else if (status === "Shortlisted") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "Selected") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "Onboarded") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "On Hold") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "Rejected") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    } else if (status === "Leaved") {
      navigate(`/applicants?status=${encodeURIComponent(filter)}`);
    }
  };

  return (
    <Fragment>
      <div>
        <div className="pb-23"></div>
        <Container fluid className="px-6 mt-n23 pb-6">
          <div
            className="pt-3 pb-4 applicant-stats-scroll bg-primary mx-n6 mb-n5 mt-n8"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <style>
              {`
                  .applicant-stats-scroll {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;    /* Firefox */
                  }

                  .applicant-stats-scroll::-webkit-scrollbar {
                    width: 0; /* hidden */
                    height: 0; /* hidden */
                  }

                  .applicant-stats-scroll:hover {
                    -ms-overflow-style: thin; /* IE and Edge */
                    scrollbar-width: thin;    /* Firefox */
                  }

                  .applicant-stats-scroll:hover::-webkit-scrollbar {
                    width: 8px; /* visible */
                    height: 8px; /* visible for horizontal scroll */
                  }

                  .applicant-stats-scroll:hover::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.3); /* thumb color */
                    border-radius: 4px;
                    height: 12px;
                  }

                  // .applicant-stats-scroll:hover::-webkit-scrollbar-track {
                  //   background: transparent; /* optional */
                  // }
              `}
            </style>

            {applicantStats.map((stat, index) => (
              <div
                key={index}
                className="flex-shrink-0 cursor-pointer"
                style={{ minWidth: "200px" }}
                onClick={() => handleCardClick(stat.title)}
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
                ids={applicantIds}
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
