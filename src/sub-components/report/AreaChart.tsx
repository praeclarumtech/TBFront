import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Dropdown } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getaddedbyReport } from "api/reportApi"; // <-- Make sure this path is correct
import BaseButton from "components/BaseComponents/BaseButton";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [application, setApplication] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Add today constant to prevent future date selection
  const today = new Date().toISOString().split("T")[0];

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

  // const fetchAddedByReport = async () => {
  //   setIsLoading(true);
  //   try {
  //     let params: any = {};
  //     if (startDate && endDate) {
  //       params.startDate = startDate;
  //       params.endDate = endDate;
  //     }

  const filterReset = () => {
    setFilterType("");
    setEndDate("");
    setStartDate("");
  };

  useEffect(() => {
    fetchAddedByReport();
  }, [filterType, startDate, endDate]);

  // Define the fixed order of categories
  const fixedCategories = ["Resume", "Manual", "Csv"];

  // Map backend values to display labels
  const labelDisplayMap: Record<string, string> = {
    Csv: "CSV",
    Resume: "Resume",
    Manual: "Manual",
  };

  // Build labels and values in fixed order
  const labels = fixedCategories.map((key) => labelDisplayMap[key] || key);
  const values = fixedCategories.map((key) => application[key] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        backgroundColor: [
          "#36A2EB", // Resume
          "#FFCE56", // Manual
          "#FF6384", // CSV
        ],
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
    },
  };

  return (
    <>
      {/* Dropdown Row */}
      <div className="gap-2 mb-3 d-flex justify-content-end align-items-cente">
        {/* Main Filter Dropdown */}
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
        {/* Time Range Dropdown */}

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
          height: "300px",
          overflow: "hidden",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        {isLoading ? (
          <Skeleton height={300} borderRadius={"50%"} width={300} />
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </>
  );
};

export default PieChart;
