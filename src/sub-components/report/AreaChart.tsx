// import { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from "chart.js";
// import { getApplication } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend
// );

// // Define TypeScript Interface for Application Data
// interface ApplicationData {
//   date: string;
//   week: number;
//   month: number;
// }

// const StackedAreaChart = () => {
//   const [application, setApplication] = useState<ApplicationData[]>([]);
//   const [selectedTime, setSelectedTime] = useState("month");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchStatusOfApplication(selectedTime);
//   }, [selectedTime]);

//   const fetchStatusOfApplication = async (cType: string) => {
//     setIsLoading(true);
//     try {
//       const response = await getApplication(cType);
//       if (Array.isArray(response.data)) {
//         setApplication(response.data);
//       } else if (
//         typeof response.data === "object" &&
//         response.data.totalApplications
//       ) {
//         setApplication([
//           {
//             date: new Date().toISOString().split("T")[0], // Today's date
//             week: response.data.totalApplications ?? 0, // Assign totalApplications to week
//             month: response.data.totalApplications ?? 0, // Assign totalApplications to month
//           },
//         ]);
//       } else {
//         setApplication([]); // If no valid data, set empty array
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       setApplication([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLabelClick = (time: string) => {
//     setSelectedTime(time);
//   };

//   // const labels = application.map((app) => app.date);
//   const labels = ["jan","fab", "march"]
//   const weekData = application.map((app) => app.week);
//   const monthData = application.map((app) => app.month);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Week",
//         data: selectedTime === "week" ? weekData : [],
//         backgroundColor: "rgba(0, 0, 212)",
//         borderColor: "rgba(0, 0, 212)",
//         fill: true,
//       },
//       {
//         label: "Month",
//         data: selectedTime === "month" ? monthData : [],
//         backgroundColor: "rgba(212, 0, 0)",
//         borderColor: "rgba(212, 0, 0)",
//         fill: true,
//       },
//     ],
//   };

//   const options: ChartOptions<"line"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         onClick: (_e, legendItem) =>
//           handleLabelClick(legendItem.text.toLowerCase()),
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         stacked: true,
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div style={{ height: "300px", width: "100%" }}>
//       {isLoading ? (
//         <Skeleton height={300} width={500} />
//       ) : (
//         <div style={{ height: "300px", width: "100%" }}>
//           <Line data={data} options={options} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default StackedAreaChart;

// import { useEffect, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from "chart.js";
// import { getaddedbyReport } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

// // Register Pie chart components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = () => {
//   const [application, setApplication] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchAddedByReport = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getaddedbyReport();
//       setApplication(response?.data || []);
//     } catch (error) {
//       console.error("API Error:", error);
//       setApplication([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAddedByReport();
//   }, []);

//   // Extract labels and data values from the application data
//   const labels = Object.keys(application);
//   const values = Object.values(application);// Adjust key based on actual response structure

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Added By",
//         data: values,
//         backgroundColor: [
//           "#FF6384",
//           "#36A2EB",
//           "#FFCE56",
//           "#8AFFC1",
//           "#FF8A5B",
//           "#7F5AFF",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options: ChartOptions<"pie"> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   return (

//     <div style={{ height: "300px", width: "100%" }}>
//       {isLoading ? (
//         <Skeleton height={400} width={400} borderRadius="50%"/>
//       ) : (
//         <div className="items-center">
//         <Pie data={data} options={options} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PieChart;

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

  // const fetchAddedByReport = async () => {
  //   setIsLoading(true);
  //   try {
  //     let params: any = {};
  //     if (filterType === "time") {
  //       params.filter = selectedTime;
  //     } else if (startDate && endDate) {
  //       params.startDate = startDate;
  //       params.endDate = endDate;
  //     }

  //     const response = await getaddedbyReport(params);
  //     setApplication(response?.data || {});
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     setApplication({});
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchAddedByReport = async () => {
    setIsLoading(true);
    try {
      const response = await getaddedbyReport();
      setApplication(response?.data || []);
    } catch (error) {
      console.error("API Error:", error);
      setApplication([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filterType === "time" || (startDate && endDate)) {
      fetchAddedByReport();
    }
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
            <Dropdown.Item eventKey="date">Date</Dropdown.Item>
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
        {filterType === "date" && (
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
              <div>
                <label style={{ fontSize: "0.8rem" }}>Start Time</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  onChange={(e) => console.log("Start Time:", e.target.value)}
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
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem" }}>End Time</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  onChange={(e) => console.log("End Time:", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div
        style={{ width: "100%", maxWidth: "100%", height: "300px" }}
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
