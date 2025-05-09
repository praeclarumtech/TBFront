// import { Fragment, useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { getStatusOfApplication } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

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

//   // Define colors and ensure cycling
//   const colors = ["#660099", "#d40000", "#0000FF", "#004225", "#FCE903"];

//   const perfomanceChartSeries = dataValues;
//   const perfomanceChartOptions: ApexOptions = {
//     labels: labels,
//     colors: colors,
//     plotOptions: {
//       radialBar: {
//         startAngle: 0,
//         endAngle: 300,
//         hollow: { size: "40%" },
//         track: { background: "transparent" },
//         dataLabels: {
//           name: { show: true }, // Hide default name labels inside the chart
//           value: {
//             show: true,
//             fontSize: "14px",
//             formatter: (value: number, opts?: any) => {
//               if (opts && typeof opts.seriesIndex === "number") {
//                 return String(perfomanceChartSeries[opts.seriesIndex]);
//               }

//               return String(value); // Fallback to the actual value
//             },
//           },
//         },
//       },
//     },
//     chart: { type: "radialBar", height: 320 },
//     stroke: { lineCap: "round" },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: { chart: { height: 250 } },
//       },
//       {
//         breakpoint: 5000,
//         options: { chart: { height: 350 } },
//       },
//     ],
//   };

//   return (
//     <Fragment>
//       <div className="relative flex flex-col items-center">
//         <div className="flex flex-wrap items-center mb-2 gap-x-4 gap-y-1">
//           {isLoading ? (
//             <Skeleton height={20} width={375} />
//           ) : (
//             <>
//               {labels.map((label, index) => (
//                 <div key={index} className="flex items-center gap-1">
//                   <span
//                     className="w-2.5 h-2.5 rounded-full"
//                     style={{ backgroundColor: colors[index % colors.length] }}
//                   ></span>
//                   <span className="text-xs font-medium text-gray-800">
//                     {label}
//                   </span>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>

//         {isLoading ? (
//           <Skeleton
//             height={250}
//             width={250}
//             borderRadius="50%"
//             className="flex items-center mt-5"
//           />
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
  const [statusOfApplication, setStatusOfApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getStatusOfApplication();
      setStatusOfApplication(data.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants?/gi, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const labels = Object.keys(statusOfApplication).map(formatLabel);
  const values = Object.values(statusOfApplication);

  const colors = ["#660099", "#d40000", "#0000FF", "#004225", "#FCE903"];

  // const barChartOptions: ApexOptions = {
  //   chart: {
  //     type: "bar",
  //     height: 320,
  //     toolbar: { show: false },
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: true,
  //       borderRadius: 5,
  //       barHeight: "60%",
  //       dataLabels: {
  //         position: "top", // Show data labels to the right/top
  //       },
  //     },
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     offsetX: 25, // Push label a bit further from the bar
  //     style: {
  //       fontSize: "12px",
  //       colors: ["#000"], // Make sure it's visible against your background
  //     },
  //     formatter: function (val: number) {
  //       return val.toString(); // Ensure it's a string
  //     },
  //   },
  //   xaxis: {
  //     categories: labels,
  //     labels: {
  //       style: {
  //         fontSize: "12px",
  //       },
  //     },
  //   },
  //   colors: colors,
  // };

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: "60%",
        distributed: true, // Ensure that each bar gets a distinct color
        dataLabels: {
          position: "top", // Show data labels to the right/top
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 25, // Push label a bit further from the bar
      style: {
        fontSize: "12px",
        colors: ["#000"], // Make sure it's visible against your background
      },
      formatter: function (val: number) {
        return val.toString(); // Ensure it's a string
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: colors, // The array of colors should apply here
  };
  

  
  return (
    <Fragment>
      <div className="relative w-full">
        {isLoading ? (
          <Skeleton height={300} />
        ) : (
          <Chart
            options={barChartOptions}
            series={[{ name: "Applications", data: values as number[] }]}
            type="bar"
            height={320}
          />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
