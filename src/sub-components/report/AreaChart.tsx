import { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Colors,
} from "chart.js";
import { Dropdown } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getaddedbyReport } from "api/reportApi"; // ✅ Make sure your path is right
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom"; // ✅ Uncomment if you want to navigate on click

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const PieChart = () => {
  const [application, setApplication] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ✅ Correct type for react-chartjs-2 v5+
  const chartRef = useRef<ChartJS<"pie", number[], unknown>>(null);

  const navigate = useNavigate(); // ✅ Uncomment if using react-router

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
    fetchAddedByReport();
  }, [filterType, startDate, endDate]);

  const fixedCategories = ["Resume", "Manual", "Csv", "guest"];

  const labelDisplayMap: Record<string, string> = {
    Csv: "CSV",
    Resume: "Resume",
    Manual: "Manual",
    guest: "Guest",
  };

  const labels = fixedCategories.map((key) => labelDisplayMap[key] || key);
  const values = fixedCategories.map((key) => application[key] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        bodyColor: "#ffffff",
        titleColor: "#ffffff",
      },
      datalabels: {
        color: "#ffffff",
        font: {
          size: 12,
        },
        formatter: (value) => value,
      },
    },
    onHover: (event, chartElement) => {
      if (event.native) {
        const target = event.native.target as HTMLElement;
        target.style.cursor = chartElement.length ? "pointer" : "default";
      }
    },
  };

  const handleSliceClick = (event: any) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      false
    );

    if (elements.length > 0) {
      const firstElement = elements[0];
      const dataIndex = firstElement.index;
      const clickedLabel = labels[dataIndex];
      console.log("Clicked label:", clickedLabel);

      // ✅ Example: navigate if needed
      navigate(`/applicants?addedByChart=${encodeURIComponent(clickedLabel)}`);
    }
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

      {/* Chart Container */}
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
          <Pie
            ref={chartRef}
            data={data}
            options={options}
            onClick={handleSliceClick}
          />
        )}
      </div>
    </>
  );
};

export default PieChart;
