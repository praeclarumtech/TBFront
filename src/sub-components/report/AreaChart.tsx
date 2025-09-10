import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dropdown } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getaddedbyReport } from "api/reportApi";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";

const AreaChart = () => {
  const [application, setApplication] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const formatDateTime = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchAddedByReport = async () => {
    setIsLoading(true);
    try {
      const start = formatDateTime(startDate);
      const end = formatDateTime(endDate);
      const response = await getaddedbyReport(start, end);
      setApplication(response?.data || {});
    } catch (error) {
      console.error("API Error:", error);
      setApplication({});
    } finally {
      setIsLoading(false);
    }
  };

  const filterReset = () => {
    setFilterType("");
    setStartDate("");
    setEndDate("");
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
  }, [filterType, startDate, endDate]);

  const fixedCategories = ["Resume", "Manual", "Csv", "guest"];

  const labelDisplayMap: Record<string, string> = {
    Csv: "CSV",
    Resume: "Resume",
    Manual: "Manual",
    guest: "Guest",
  };

  const chartData = fixedCategories.map((key) => ({
    name: labelDisplayMap[key] || key,
    y: application[key] || 0,
  }));

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 350,
      backgroundColor: "transparent",
      animation: true, 
    },
    title: { text: "" },
    tooltip: {
      pointFormat: "<b>{point.y}</b>",
    },
    credits: {
      enabled: false, // ✅ This disables the "Highcharts.com" link
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
        },
        showInLegend: true,
        animation: {
          duration: 1500,
        },
        events: {
          click: (event) => {
            const clickedLabel = event.point.name;
            navigate(
              `/applicants?addedByChart=${encodeURIComponent(clickedLabel)}`
            );
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Applications",
        data: chartData,
      },
    ],
  };

  return (
    <>
      {/* Filter & Reset Controls */}
      <div className="gap-2 mb-3 d-flex justify-content-end align-items-center">
        <div>
          <BaseButton color="success" onClick={filterReset}>
            Reset
          </BaseButton>
        </div>
        <div>
          <Dropdown onSelect={(val) => val && setFilterType(val)}>
            <Dropdown.Toggle variant="outline-primary" className="min-h-[40px]">
              {filterType || "Select Filter"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Date Filter Inputs */}
      <div className="mb-2 d-flex justify-content-end">
        {filterType === "Date" && (
          <div className="gap-2 mt-2 d-flex flex-column">
            <div className="gap-2 d-flex">
              <div>
                <label style={{ fontSize: "0.8rem" }}>Start Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={today}
                />
              </div>
            </div>
            <div className="gap-2 d-flex">
              <div>
                <label style={{ fontSize: "0.8rem" }}>End Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={today}
                />
              </div>
            </div>
          </div>
        )}
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

export default AreaChart;
