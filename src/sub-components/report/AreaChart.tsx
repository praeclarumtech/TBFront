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

//     import { getApplication } from "api/reportApi";
// import { Dropdown } from "reactstrap";

// // Register necessary components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend
// );

// const StackedAreaChart = () => {

//     const [application, setApplication] = useState([]);
//     const [selectedTime, setSelectedTime] = useState("month");
//     console.log(application);

//       useEffect(() => {
//         fetchStatusOfApplication(selectedTime);
//       }, [selectedTime]);

//       const fetchStatusOfApplication = async (cType: string) => {
//         try {
//           const data = await getApplication(cType);
//           // setApplication(data.data);
//           setApplication(Array.isArray(data.data) ? data.data : []);

//           console.log("Area",data)
//         } catch (error) {
//           // setError("Failed to load applicants");
//           console.error("API Error:", error);
//           setApplication([]);
//         }
//       };

//       const handleLabelClick = (time: string) => {
//         setSelectedTime(time); // Update selected time
//         console.log(time)
//       };

//       // const labels = application.map((app: any) => app.date);

//       const labels = Array.isArray(application) ? application.map((app: any) => app.date) : [];
// const weekData = Array.isArray(application) ? application.map((app: any) => app.week) : [];
// const monthData = Array.isArray(application) ? application.map((app: any) => app.month) : [];

//       const data = {
//         labels ,
//         datasets: [
//           {
//             label: "Week",
//             data: weekData,
//             backgroundColor: "rgba(153, 102, 255, 0.5)",
//             borderColor: "rgba(153, 102, 255, 1)",
//             fill: true,
//           },
//           {
//             label: "Month",
//             data: monthData,
//             backgroundColor: "rgba(255, 99, 132, 0.5)",
//             borderColor: "rgba(255, 99, 132, 1)",
//             fill: true,
//           },
//         ],
//       };

//   const options: ChartOptions<"line"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         onClick: (_e, legendItem) => handleLabelClick(legendItem.text.toLowerCase()),
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         stacked: true, // Enables stacking
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//         <div>
//         <Dropdown>
//         <Dropdown.Menu align={"end"}>
//           <Dropdown.Item eventKey="1">Action</Dropdown.Item>
//           <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
//           <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//         </div>

//     <div style={{ height: "300px", width: "100%" }}>
//       <Line data={data} options={options} />
//     </div>
//     </div>
//   );
// };

// export default StackedAreaChart;

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
// import {
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";

// // Register necessary components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend
// );

// interface ApplicationData {
//   date: string;
//   week: number;
//   month: number;
// }

// const StackedAreaChart = () => {
//   const [applicationWeek, setApplicationWeek] = useState([]);
//   const [applicationMonth, setApplicationMonth] = useState([]);
//   const [application, setApplication] = useState<ApplicationData[]>([]);

//   const [selectedTime, setSelectedTime] = useState("month");
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // console.log("Selected Time:", selectedTime);
//   // console.log("Application Data:", applicationWeek);

//   useEffect(() => {
//     fetchStatusOfApplication(selectedTime);
//   }, [selectedTime]);

//   const fetchStatusOfApplication = async (cType: string) => {
//     try {
//       const response = await getApplication(cType);
//       console.log("API Response:", response);

//       if (Array.isArray(response.data)) {
//         // ✅ Case 1: If API returns an array, use it as is.
//         setApplication(response.data);
//       } else if (typeof response.data === "object" && response.data.totalApplications) {
//         // ✅ Case 2: If API returns an object, create an array with a single entry.
//         setApplication([
//           {
//             date: new Date().toISOString().split("T")[0], // Today's date
//             week: response.data.totalApplications, // Use totalApplications for week
//             month: response.data.totalApplications, // Use totalApplications for month
//           },
//         ]);
//       } else {
//         setApplication([]); // ✅ Case 3: If no valid data, set empty array.
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       setApplication([]); // Prevents undefined errors
//     }
//   };

//   // Handle dropdown selection
//   const handleSelect = (time: string) => {
//     setSelectedTime(time);
//   };

//   // Handle legend clicks
//   const handleLabelClick = (time: string) => {
//     setSelectedTime(time);
//   };

//   // Ensure application is an array
//   const labels = Array.isArray(application)
//     ? application.map((app: any) => app.date)
//     : [];
//   const weekData = Array.isArray(application)
//     ? application.map((app: any) => app.week)
//     : [];
//   const monthData = Array.isArray(application)
//     ? application.map((app: any) => app.month)
//     : [];

//   // const weekData = weekDat.totalApplications

//   const data = {
//     labels,
//     datasets: [
//         {
//         label: "Week",
//         data: applicationWeek,
//         backgroundColor: "rgba(153, 102, 255, 0.5)",
//         borderColor: "rgba(153, 102, 255, 1)",
//         fill: true,
//       },
//       {
//         label: "Month",
//         data: applicationMonth,
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//         borderColor: "rgba(255, 99, 132, 1)",
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
//         stacked: true, // Enables stacking
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       {/* Dropdown for selecting time period */}
//       <Dropdown
//         isOpen={dropdownOpen}
//         toggle={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <DropdownToggle caret>{selectedTime}</DropdownToggle>
//         <DropdownMenu>
//           <DropdownItem onClick={() => handleSelect("month")}>
//             Month
//           </DropdownItem>
//           <DropdownItem onClick={() => handleSelect("week")}>Week</DropdownItem>
//         </DropdownMenu>
//       </Dropdown>

//       {/* Chart */}
//       <div style={{ height: "300px", width: "100%" }}>
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default StackedAreaChart;

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { getApplication } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define TypeScript Interface for Application Data
interface ApplicationData {
  date: string;
  week: number;
  month: number;
}

const StackedAreaChart = () => {
  const [application, setApplication] = useState<ApplicationData[]>([]);
  const [selectedTime, setSelectedTime] = useState("month");
  const [isLoading, setIsLoading] = useState(false);

  console.log("Application Data:", application);

  useEffect(() => {
    fetchStatusOfApplication(selectedTime);
  }, [selectedTime]);

  const fetchStatusOfApplication = async (cType: string) => {
    setIsLoading(true);
    try {
      const response = await getApplication(cType);
      console.log("API Response:", response);

      if (Array.isArray(response.data)) {
        setApplication(response.data);
      } else if (
        typeof response.data === "object" &&
        response.data.totalApplications
      ) {
        setApplication([
          {
            date: new Date().toISOString().split("T")[0], // Today's date
            week: response.data.totalApplications ?? 0, // Assign totalApplications to week
            month: response.data.totalApplications ?? 0, // Assign totalApplications to month
          },
        ]);
      } else {
        setApplication([]); // If no valid data, set empty array
      }
    } catch (error) {
      console.error("API Error:", error);
      setApplication([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabelClick = (time: string) => {
    setSelectedTime(time);
    console.log("Selected Time:", time);
  };

  // const labels = application.map((app) => app.date);
  const labels = ["jan","fab", "march"]
  const weekData = application.map((app) => app.week);
  const monthData = application.map((app) => app.month);

  const data = {
    labels,
    datasets: [
      {
        label: "Week",
        data: selectedTime === "week" ? weekData : [],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        fill: true,
      },
      {
        label: "Month",
        data: selectedTime === "month" ? monthData : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        onClick: (_e, legendItem) =>
          handleLabelClick(legendItem.text.toLowerCase()),
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {isLoading ? (
        <Skeleton height={300} width={500} />
      ) : (
        <div style={{ height: "300px", width: "100%" }}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default StackedAreaChart;
