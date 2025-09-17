import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dropdown } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getApplicationsByGenderWorkNotice } from "api/reportApi";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";
import BaseModal from "components/BaseComponents/BaseModal";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import appConstants from "constants/constant";
import { SelectedOption } from "interfaces/applicant.interface";
import { toast } from "react-toastify";
import { capitalizeWords } from "utils/commonFunctions";

const {
  gendersType,
  workPreferenceType,
  noticePeriodType,
  activeStatusOptions,
  favoriteOptions,
} = appConstants;

const PieChart2 = () => {
  const [application, setApplication] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterGender, setFilterGender] = useState<SelectedOption | null>(null);
  const [filterWorkPreference, setFilterWorkPreference] =
    useState<SelectedOption | null>(null);
  const [filterNoticePeriod, setFilterNoticePeriod] =
    useState<SelectedOption | null>(null);
  const [filterRole, setFilterRole] = useState<SelectedOption | null>(null);
  const [filterFavorite, setFilterFavorite] = useState<SelectedOption | null>(
    null
  );
  const [filterActiveStatus, setFilterActiveStatus] =
    useState<SelectedOption | null>(null);
  const [chartType, setChartType] = useState<
    "gender" | "work" | "notice" | "role" | "status" | "favorite"
  >("gender");
  const [noData, setNoData] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchAddedByReport = async () => {
    setIsLoading(true);
    setNoData(false);
    try {
      const params: {
        gender?: string;
        workPreference?: string;
        noticePeriod?: string;
        createdBy?: string;
        isActive?: string;
        isFavorite?: string;
      } = {};
      if (filterGender) params.gender = filterGender.value;
      if (filterWorkPreference)
        params.workPreference = filterWorkPreference.value;
      if (filterNoticePeriod) params.noticePeriod = filterNoticePeriod.value;
      if (filterNoticePeriod) params.noticePeriod = filterNoticePeriod.value;
      if (filterActiveStatus) params.isActive = filterActiveStatus.value;
      if (filterRole) params.createdBy = filterRole.value;

      if (filterFavorite) params.isFavorite = filterFavorite.value;

      const response = await getApplicationsByGenderWorkNotice(params);
      if (response?.success === true && response?.data) {
        setApplication(response?.data?.applicants || {});
      } else {
        setNoData(true);
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      setApplication({});
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (chartRef.current?.chart) {
        // force chart to resize to container
        if (containerRef.current && chartRef.current?.chart) {
          const containerWidth = containerRef.current.offsetWidth || null;
          const containerHeight = containerRef.current.offsetHeight || null;
          chartRef.current.chart.setSize(
            containerWidth,
            containerHeight,
            false
          );
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchAddedByReport();
  }, [
    filterGender,
    filterWorkPreference,
    filterNoticePeriod,
    filterFavorite,
    filterRole,
    filterActiveStatus,
  ]);

  // pick correct dataset based on chartType
  let selectedData: Record<string, number> = {};
  if (chartType === "gender") selectedData = application.gender || {};
  if (chartType === "work") selectedData = application.workPreference || {};
  if (chartType === "notice") selectedData = application.noticePeriod || {};
  if (chartType === "role") selectedData = application.role || {};
  if (chartType === "status") selectedData = application.active || {};
  if (chartType === "favorite") selectedData = application.favorite || {};

  const formatLabel = (key: string) => {
    if (chartType === "notice") {
      return `${key} days`;
    }
    if (chartType === "status") {
      return key === "true" ? "Active" : "Inactive";
    }
    if (chartType === "favorite") {
      return key === "true" ? "Favorited" : "Not Favorited";
    }
    return capitalizeWords(key);
  };

  const chartData = Object.entries(selectedData).map(([key, value]) => ({
    name: formatLabel(key),
    y: value,
  }));

  // const warmColors = [
  //   "#FF6B35",
  //   "#F7931E",
  //   "#FFD23F",
  //   "#FF8C42",
  //   "#C73E1D",
  //   "#A0522D",
  //   "#FF4500",
  //   "#FF7F50",
  //   "#FFA500",
  //   "#FFB347",
  // ];

  const sunsetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];

  // Add this to your Highcharts options:
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 350,
      backgroundColor: "transparent",
      animation: true,
    },
    colors: sunsetColors, // Choose one of the color arrays above
    title: { text: "" },
    tooltip: { pointFormat: "<b>{point.y}</b>" },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: "#333333", // Dark text for better readability
            fontWeight: "bold",
          },
        },
        showInLegend: true,
        animation: { duration: 1500 },
        events: {
          click: (event) => {
            const clickedLabel = event.point.name;
            navigate(
              `/applicants?piechartType=${
                chartType === "status" ? "ActiveStatus" : chartType
              }&selected=${encodeURIComponent(clickedLabel)}`
            );
          },
        },
      },
    },
    series: [{ type: "pie", name: "Applications", data: chartData }],
  };
  // const options: Highcharts.Options = {
  //   chart: {
  //     type: "pie",
  //     height: 350,
  //     backgroundColor: "transparent",
  //     animation: true,
  //   },
  //   title: { text: "" },
  //   tooltip: { pointFormat: "<b>{point.y}</b>" },
  //   credits: { enabled: false },
  //   plotOptions: {
  //     pie: {
  //       allowPointSelect: true,
  //       cursor: "pointer",
  //       dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" },
  //       showInLegend: true,
  //       animation: { duration: 1500 },
  //       events: {
  //         click: (event) => {
  //           const clickedLabel = event.point.name;
  //           navigate(
  //             `/applicants?chartType=${chartType}&selected=${encodeURIComponent(
  //               clickedLabel
  //             )}`
  //           );
  //         },
  //       },
  //     },
  //   },
  //   series: [{ type: "pie", name: "Applications", data: chartData }],
  // };

  const handleGenderChange = (selectedOption: SelectedOption) =>
    setFilterGender(selectedOption);
  const handleWorkPreferenceChange = (selectedOption: SelectedOption) =>
    setFilterWorkPreference(selectedOption);

  const handleNoticePeriodChange = (selectedOption: SelectedOption) =>
    setFilterNoticePeriod(selectedOption);
  // const handleRoleChange = (selectedOption: SelectedOption) =>
  //   setFilterRole(selectedOption);
  // const handleStatusChange = (selectedOption: SelectedOption) =>
  //   setFilterActiveStatus(selectedOption);

  // const handleFavoritesChange = (selectedOption: SelectedOption) =>
  //   setFilterFavorite(selectedOption);

  const handleCancelClose = () => {
    setShowExportModal(false);
    setFilterGender(null);
    setFilterNoticePeriod(null);
    setFilterWorkPreference(null);
    setFilterRole(null);
    setFilterActiveStatus(null);
    setFilterFavorite(null);
  };

  const resetFilter = () => {
    setFilterGender(null);
    setFilterNoticePeriod(null);
    setFilterWorkPreference(null);
    setFilterRole(null);
    setFilterActiveStatus(null);
    setFilterFavorite(null);
    setChartType("gender");
  };

  const handleSubmit = () => {
    // filters already in state, effect will trigger API
    if (filterGender) {
      setChartType("gender");
    } else if (filterWorkPreference) {
      setChartType("work");
    } else if (filterNoticePeriod) {
      setChartType("notice");
    } else if (filterRole) {
      setChartType("role");
    } else if (filterActiveStatus) {
      setChartType("status");
    } else if (filterFavorite) {
      setChartType("favorite");
    } else {
      setChartType("gender");
    }
    setShowExportModal(false);
  };

  return (
    <>
      {/* Controls */}
      <div className="gap-2 mb-3 d-flex justify-content-end align-items-center">
        <div>
          <BaseButton color="primary" onClick={() => setShowExportModal(true)}>
            Filters
          </BaseButton>
        </div>
        <BaseModal
          show={showExportModal}
          onSubmitClick={handleSubmit}
          onCloseClick={handleCancelClose}
          loader={false}
          submitButtonText="Submit"
          closeButtonText="Close"
          setShowBaseModal={setShowExportModal}
          modalTitle={"Choose Filter"}
        >
          <>
            <BaseSelect
              label="Gender"
              name="gender"
              className="mb-1 select-border"
              options={gendersType}
              placeholder="Gender"
              handleChange={handleGenderChange}
              value={filterGender}
            />
            <BaseSelect
              label="Work Preference"
              name="workPreference"
              className="mb-1 select-border"
              options={workPreferenceType}
              placeholder="Work Preference"
              handleChange={handleWorkPreferenceChange}
              value={filterWorkPreference}
            />
            <BaseSelect
              label="Notice Period (in Days)"
              name="noticePeriod"
              placeholder="Notice Period (in Days)"
              className="mb-1 select-border"
              value={filterNoticePeriod}
              options={noticePeriodType}
              handleChange={handleNoticePeriodChange}
            />
            <BaseSelect
              label="Status"
              name="Status"
              className="mb-1 select-border"
              options={activeStatusOptions}
              placeholder="Status"
              handleChange={(selectedOption: SelectedOption) =>
                setFilterActiveStatus(selectedOption)
              }
              value={filterActiveStatus}
            />{" "}
            <BaseSelect
              label="Favorite"
              name="favorite"
              className="mb-1 select-border"
              options={favoriteOptions}
              placeholder="Favorite"
              handleChange={(selectedOption: SelectedOption) =>
                setFilterFavorite(selectedOption)
              }
              value={filterFavorite}
            />
            <BaseButton color="primary" onClick={resetFilter}>
              Reset
            </BaseButton>
          </>
        </BaseModal>
        <div>
          <Dropdown onSelect={(val) => val && setChartType(val as any)}>
            <Dropdown.Toggle variant="outline-primary" className="min-h-[40px]">
              {capitalizeWords(chartType)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="gender" active={chartType === "gender"}>
                Gender
              </Dropdown.Item>
              <Dropdown.Item eventKey="work" active={chartType === "work"}>
                Work Preference
              </Dropdown.Item>
              <Dropdown.Item eventKey="notice" active={chartType === "notice"}>
                Notice Period
              </Dropdown.Item>
              <Dropdown.Item eventKey="role" active={chartType === "role"}>
                Role
              </Dropdown.Item>
              <Dropdown.Item eventKey="status" active={chartType === "status"}>
                Applicants Status
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="favorite"
                active={chartType === "favorite"}
              >
                Favorites
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "350px",
          overflow: "hidden",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        {isLoading ? (
          <Skeleton height={350} borderRadius={"50%"} width={350} />
        ) : noData ? (
          <span>No Data Availabel for this filter</span>
        ) : (
          <div
            ref={containerRef}
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "350px",
              overflow: "hidden",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              ref={chartRef}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PieChart2;
