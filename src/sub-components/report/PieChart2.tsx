
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

const { gendersType, workPreferenceType, noticePeriodType } = appConstants;

const PieChart2 = () => {
  const [application, setApplication] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterGender, setFilterGender] = useState<SelectedOption | null>(null);
  const [filterWorkPreference, setFilterWorkPreference] =
    useState<SelectedOption | null>(null);
  const [filterNoticePeriod, setFilterNoticePeriod] =
    useState<SelectedOption | null>(null);
  const [chartType, setChartType] = useState<"gender" | "work" | "notice">(
    "gender"
  );
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
      } = {};
      if (filterGender) params.gender = filterGender.value;
      if (filterWorkPreference)
        params.workPreference = filterWorkPreference.value;
      if (filterNoticePeriod) params.noticePeriod = filterNoticePeriod.value;
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
  }, [filterGender, filterWorkPreference, filterNoticePeriod, chartType]);

  // pick correct dataset based on chartType
  let selectedData: Record<string, number> = {};
  if (chartType === "gender") selectedData = application.genderCounts || {};
  if (chartType === "work")
    selectedData = application.workPreferenceCounts || {};
  if (chartType === "notice")
    selectedData = application.noticePeriodCounts || {};

  const formatLabel = (key: string) =>
    chartType === "notice" ? `${key} days` : key;

  const chartData = Object.entries(selectedData).map(([key, value]) => ({
    name: formatLabel(key),
    y: value,
  }));

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 350,
      backgroundColor: "transparent",
      animation: true,
    },
    title: { text: "" },
    tooltip: { pointFormat: "<b>{point.y}</b>" },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" },
        showInLegend: true,
        animation: { duration: 1500 },
        events: {
          click: (event) => {
            const clickedLabel = event.point.name;
            navigate(
              `/applicants?chartType=${chartType}&selected=${encodeURIComponent(
                clickedLabel
              )}`
            );
          },
        },
      },
    },
    series: [{ type: "pie", name: "Applications", data: chartData }],
  };

  const handleGenderChange = (selectedOption: SelectedOption) =>
    setFilterGender(selectedOption);
  const handleWorkPreferenceChange = (selectedOption: SelectedOption) =>
    setFilterWorkPreference(selectedOption);

  const handleNoticePeriodChange = (selectedOption: SelectedOption) =>
    setFilterNoticePeriod(selectedOption);

  const handleCancelClose = () => {
    setShowExportModal(false);
    setFilterGender(null);
    setFilterNoticePeriod(null);
    setFilterWorkPreference(null);
  };

  const resetFilter = () => {
    setFilterGender(null);
    setFilterNoticePeriod(null);
    setFilterWorkPreference(null);
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
            <BaseButton color="primary" onClick={resetFilter}>
              Reset
            </BaseButton>
          </>
        </BaseModal>
        <div>
          <Dropdown onSelect={(val) => val && setChartType(val as any)}>
            <Dropdown.Toggle variant="outline-primary" className="min-h-[40px]">
              {chartType === "gender"
                ? "Gender"
                : chartType === "work"
                ? "Work Preference"
                : "Notice Period"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="gender">Gender</Dropdown.Item>
              <Dropdown.Item eventKey="work">Work Preference</Dropdown.Item>
              <Dropdown.Item eventKey="notice">Notice Period</Dropdown.Item>
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
