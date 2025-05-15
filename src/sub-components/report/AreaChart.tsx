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

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [application, setApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [filterType, setFilterType] = useState("Date"); // "time" or "date"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDateTime = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchAddedByReport = async () => {
    setIsLoading(true);
    try {
      const start = formatDateTime(startDate,);
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

  //     const response = await getaddedbyReport(startDate, endDate);
  //     setApplication(response?.data || {});
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     setApplication({});
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchAddedByReport = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getaddedbyReport();
  //     setApplication(response?.data || []);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     setApplication([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchAddedByReport();
  }, [filterType, startDate, endDate]);

  const labels = Object.keys(application);
  const values = Object.values(application);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8AFFC1",
          "#FF8A5B",
          "#7F5AFF",
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
      <div className="mb-3 d-flex flex-column align-items-end">
        {/* Main Filter Dropdown */}
        <Dropdown onSelect={(val) => val && setFilterType(val)}>
          <Dropdown.Toggle variant="outline-primary" size="sm">
            {filterType}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Time Range Dropdown */}
        {/* {filterType === "time" && (
          <div className="mt-2">
            <Dropdown onSelect={(val) => val && setSelectedTime(val)}>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                {selectedTime}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="today">Today</Dropdown.Item>
                <Dropdown.Item eventKey="week">This Week</Dropdown.Item>
                <Dropdown.Item eventKey="month">This Month</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )} */}

        {/* Date Pickers */}
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
                  disabled={!startDate.length}
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
        className="justify-items-center"
      >
        {isLoading ? (
          <Skeleton height={300} width="100%" />
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </>
  );
};

export default PieChart;
