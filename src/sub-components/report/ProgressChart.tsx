
// import { Fragment, useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { getStatusOfApplication } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";
// // import { colors } from "@mui/material";

// const Charts = () => {
//   const [statusOfApplication, setStatusOfApplication] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchStatusOfApplication();
//   }, []);

//   const fetchStatusOfApplication = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getStatusOfApplication();
//       setStatusOfApplication(data.data);
//       console.log("progrs", data);
//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatLabel = (text: string) => {
//     return text
//       .replace(/Applicants?/gi, "") // Remove "Applicant" or "Applicants"
//       .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
//       .replace(/_/g, " ") // Replace underscores with spaces
//       .trim()
//       .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
//   };

//   const dataValues = Object.values(statusOfApplication);
//   const labels = Object.keys(statusOfApplication).map(formatLabel);
//   const colors = ["#28a745", "#17a2b8", "#E4A11B", "#dc3545"];
//   const perfomanceChartSeries = dataValues;
//   const perfomanceChartOptions: ApexOptions = {
//     labels: labels,
//     colors: colors,
//     plotOptions: {
//       radialBar: {
//         startAngle: 0,
//         endAngle: 270,
//         hollow: { size: "40%" },
//         track: { background: "transparent" },
//         dataLabels: {
//           name: { show: false }, // Hide default name labels inside the chart
//           value: { show: false }, // Hide default value labels inside the chart
//         },
//       },
//     },
//     chart: { type: "radialBar" },
//     stroke: { lineCap: "round" },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: { chart: { height: 200 } },
//       },
//       {
//         breakpoint: 5000,
//         options: { chart: { height: 220 } },
//       },
//     ],
//   };

//   return (
//     <Fragment>
//       <div className="relative flex flex-col items-center">
//         {/* Custom Label Section */}
//         <div className="absolute top-0 left-0 transform -translate-x-1/2 mb-4 flex flex-col items-center">
//         {labels.map((label, index) => (
//             <div key={index} className="flex items-center text-sm font-semibold text-gray-800">
//               <span
//                 className="w-3 h-3 rounded-full mr-2"
//                 style={{ backgroundColor: colors[index % colors.length] }}
//               ></span>
//               {label}
//             </div>
//           ))}
//         </div>

//         {isLoading ? (
//           <Skeleton height={200} width={200} borderRadius="50%" />
//         ) : (
//           <Chart
//             options={perfomanceChartOptions}
//             series={perfomanceChartSeries}
//             type="radialBar"
//             width="100%"
//           />
//         )}
//       </div>
//     </Fragment>
//   );
// };

// export default Charts;

import { Fragment, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getStatusOfApplication } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

const Charts = () => {
  const [statusOfApplication, setStatusOfApplication] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getStatusOfApplication();
      setStatusOfApplication(data.data);
      console.log("progrs", data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants?/gi, "") // Remove "Applicant" or "Applicants"
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
      .replace(/_/g, " ") // Replace underscores with spaces
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const dataValues = Object.values(statusOfApplication);
  const labels = Object.keys(statusOfApplication).map(formatLabel);

  // Define colors and ensure cycling
  const colors = ["#28a745", "#17a2b8", "#E4A11B", "#dc3545", "#007bff"];

  const perfomanceChartSeries = dataValues;
  const perfomanceChartOptions: ApexOptions = {
    labels: labels,
    colors: colors,
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 270,
        hollow: { size: "40%" },
        track: { background: "transparent" },
        dataLabels: {
          name: { show: false }, // Hide default name labels inside the chart
          value: { show: false }, // Hide default value labels inside the chart
        },
      },
    },
    chart: { type: "radialBar" },
    stroke: { lineCap: "round" },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { height: 200 } },
      },
      {
        breakpoint: 5000,
        options: { chart: { height: 220 } },
      },
    ],
  };

  return (
    <Fragment>
      <div className="relative flex flex-col items-between">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="text-gray-800 font-medium text-xs">{label}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <Skeleton height={200} width={200} borderRadius="50%" />
        ) : (
          <Chart
            options={perfomanceChartOptions}
            series={perfomanceChartSeries}
            type="radialBar"
            width="100%"
          />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
