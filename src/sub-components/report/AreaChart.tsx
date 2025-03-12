// import React from "react";
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
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// const AreaChart = () => {
//   const data = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "Revenue",
//         data: [10, 30, 20, 50, 40, 70], // First dataset
//         fill: true,
//         backgroundColor: "rgba(75, 192, 192, 0.5)", // Light blue fill
//         borderColor: "rgba(75, 192, 192, 1)", // Blue line
//         // tension: 0.4, // Smooth curve
//       },
//       {
//         label: "Profit",
//         data: [5, 20, 15, 35, 30, 50], // Second dataset
//         fill: true,
//         backgroundColor: "rgba(255, 99, 132, 0.5)", // Light red fill
//         borderColor: "rgba(255, 99, 132, 1)", // Red line

//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false, // Hide X-axis grid lines
//         },
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div style={{ height: "300px", width: "100%" }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default AreaChart;

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

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StackedAreaChart = () => {

    const [Applicaiton, setApplication] = useState([]);
    console.log(Applicaiton);
    
      useEffect(() => {
        fetchStatusOfApplication();
      }, []);
    
      const fetchStatusOfApplication = async () => {
        try {
          const data = await getApplication();
          setApplication(data.data);
          console.log("Area",data)
        } catch (error) {
          // setError("Failed to load applicants");
          console.error("API Error:", error);
        }
      };
    


  const data = {
    labels: ["2016", "2017", "2018", "2019"],
    datasets: [
      {
        label: "Week",
        data: [100, 200, 250, 300],
        backgroundColor: "rgba(255, 159, 64, 1)", // Orange color with transparency
        borderColor: "rgba(255, 255, 255, 1)",
        fill: true,
      },
      {
        label: "Monthly",
        data: [80, 180, 230, 280],
        backgroundColor: "rgba(75, 192, 192, 1)", // Green color with transparency
        borderColor: "rgba(255, 255, 255, 1)",
        fill: true,
      },
      {
        label: "1st 3 Months",
        data: [10, 120, 170, 220],
        backgroundColor: "rgba(153, 102, 255, 1)", // Purple color with transparency
        borderColor: "rgba(255, 255, 255, 1)",
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true, // Enables stacking
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StackedAreaChart;
