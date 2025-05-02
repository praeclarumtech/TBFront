// import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { getCityState } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

// type Props = {
//   selectedFilter: string;
// };

// const ColumnChart = ({ selectedFilter }: Props) => {
//   const [dataSeries, setDataSeries] = useState<number[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [selectedFilter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await getCityState(selectedFilter);
//       const data = response?.data || {};
//       setCategories(Object.keys(data));
//       setDataSeries(Object.values(data));
//     } catch (error) {
//       console.error("Failed to fetch chart data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isCity = selectedFilter === "city";
//   const columnWidth = isCity ? "40%" : "55%"; // narrower bars for city
//   const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

//   const chartOptions = {
//     chart: {
//       height: 350,
//       type: "bar",
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 10,
//         dataLabels: {
//           position: "top",
//         },
//         horizontal: false,
//         columnWidth: columnWidth,
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number) => `${val}`,
//       offsetY: -20,
//       style: {
//         fontSize: "12px",
//         colors: ["#304758"],
//       },
//     },
//     xaxis: {
//       categories,
//       position: "bottom",
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         rotate: 0, // ✅ no tilt
//         style: {
//           fontSize: "11px",
//           whiteSpace: "nowrap",
//         },
//       },
//       tooltip: { enabled: true },
//     },
//     yaxis: {
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         show: true,
//         formatter: (val: number) => `${val}`,
//       },
//     },
//    title: {
//   text: `Applicants by ${isCity ? "City" : "State"}`,
//   floating: false,
//   align: "left",  // <-- aligned to the left
//   offsetX: 10,    // <-- optional margin from left
//   style: { color: "#444", fontSize: "16px" },
// },
//     tooltip: {
//       y: {
//         formatter: (val: number) => `${val} Applicants`,
//       },
//     },
//   };

//   const series = [{ name: "Applicants", data: dataSeries }];

//   return loading ? (
//     <Skeleton height={350} width={"100%"} />
//   ) : (
//     <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
//       <div style={{ width: containerWidth }}>
//         <Chart options={chartOptions} series={series} type="bar" height={350} />
//       </div>
//     </div>
//   );
// };

// export default ColumnChart;


// import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { getCityState } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

// type Props = {
//   selectedFilter: string;
// };

// const ColumnChart = ({ selectedFilter }: Props) => {
//   const [dataSeries, setDataSeries] = useState<number[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [selectedFilter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await getCityState(selectedFilter);
//       const data = response?.data || {};
//       setCategories(Object.keys(data));
//       setDataSeries(Object.values(data));
//     } catch (error) {
//       console.error("Failed to fetch chart data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isCity = selectedFilter === "city";
//   const columnWidth = isCity ? "40%" : "55%";
//   const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

//   const chartOptions = {
//     chart: {
//       height: 350,
//       type: "bar",
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 10,
//         dataLabels: { position: "top" },
//         horizontal: false,
//         columnWidth: columnWidth,
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number) => `${val}`,
//       offsetY: -20,
//       style: {
//         fontSize: "12px",
//         colors: ["#304758"],
//       },
//     },
//     xaxis: {
//       categories,
//       position: "bottom",
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         rotate: 0,
//         style: {
//           fontSize: "11px",
//           whiteSpace: "nowrap",
//         },
//         trim: false, // ensure label doesn't get trimmed
//       },
//       tooltip: {
//         enabled: true, // ✅ show city/state name on hover even if text is clipped
//       },
//     },
//     yaxis: {
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         show: true,
//         formatter: (val: number) => `${val}`,
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: (val: number) => `${val} Applicants`,
//       },
//     },
//   };

//   const series = [{ name: "Applicants", data: dataSeries }];

//   return loading ? (
//     <Skeleton height={350} width={"100%"} />
//   ) : (
//     <div>
//       {/* Sticky title above scrollable chart */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           background: "#fff",
//           zIndex: 10,
//           paddingBottom: "8px",
//         }}
//       >
//         <h5 style={{ marginLeft: "10px", color: "#444" }}>
//           Applicants by {isCity ? "City" : "State"}
//         </h5>
//       </div>

//       <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
//         <div style={{ width: containerWidth }}>
//           <Chart
//             options={chartOptions}
//             series={series}
//             type="bar"
//             height={350}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ColumnChart;


// import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { getCityState } from "api/reportApi";
// import Skeleton from "react-loading-skeleton";

// type Props = {
//   selectedFilter: string;
// };

// const ColumnChart = ({ selectedFilter }: Props) => {
//   const [dataSeries, setDataSeries] = useState<number[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [selectedFilter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await getCityState(selectedFilter);
//       const data = response?.data || {};
//       setCategories(Object.keys(data));
//       setDataSeries(Object.values(data));
//     } catch (error) {
//       console.error("Failed to fetch chart data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isCity = selectedFilter === "city";
//   const columnWidth = isCity ? "40%" : "55%";
//   const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

//   const chartOptions = {
//     chart: {
//       height: 350,
//       type: "bar" as const, // ✅ fix type error
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 10,
//         dataLabels: { position: "top" },
//         horizontal: false,
//         columnWidth,
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number) => `${val}`,
//       offsetY: -20,
//       style: {
//         fontSize: "12px",
//         colors: ["#304758"],
//       },
//     },
//     xaxis: {
//       categories,
//       position: "bottom",
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         rotate: 0,
//         style: {
//           fontSize: "11px",
//           whiteSpace: "nowrap",
//           overflow: "visible",
//         },
//         trim: false,
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     yaxis: {
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       labels: {
//         show: true,
//         formatter: (val: number) => `${val}`,
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: (val: number) => `${val} Applicants`,
//       },
//     },
//     grid: {
//       padding: {
//         bottom: 40, // ✅ ensures x-axis labels are visible
//       },
//     },
//   };

//   const series = [{ name: "Applicants", data: dataSeries }];

//   return loading ? (
//     <Skeleton height={350} width="100%" />
//   ) : (
//     <div>
//       {/* Sticky Title */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           background: "#fff",
//           zIndex: 10,
//           paddingBottom: "8px",
//         }}
//       >
//         <h5 style={{ marginLeft: "10px", color: "#212B26" }}>
//           Applicants by {isCity ? "City" : "State"}
//         </h5>
//       </div>

//       {/* Scrollable Container with Styled Scrollbar */}
//       <div
//         style={{
//           overflowX: "auto",
//           paddingBottom: "10px",
//         }}
//         className="custom-scroll"
//       >
//         <div style={{ width: containerWidth }}>
//           <Chart
//             options={chartOptions}
//             series={series}
//             type="bar"
//             height={350}
//           />
//         </div>
//       </div>

//       {/* Scrollbar styling (can be in CSS or styled-components) */}
//       <style>{`
//         .custom-scroll::-webkit-scrollbar {
//           height: 8px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: #f0f0f0;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #26a0fc;
//           border-radius: 4px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           //   background: #555;
//           background: #26a0fc;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ColumnChart;


import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getCityState } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

type Props = {
  selectedFilter: string;
};

const ColumnChart = ({ selectedFilter }: Props) => {
  const [dataSeries, setDataSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCityState(selectedFilter);
      const data = response?.data || {};
      setCategories(Object.keys(data));
      setDataSeries(Object.values(data));
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCity = selectedFilter === "city";
  const columnWidth = isCity ? "40%" : "55%";
  const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

  // ✅ Calculate y-axis max based on multiple of 75
  //   const maxValue = Math.max(...dataSeries, 0);
  //   const yAxisMax = Math.ceil(maxValue / 75) * 75;

    const maxValue = Math.max(...dataSeries, 0);

    // Auto-determine step size based on value ranges
    let stepSize = 50;

    if (maxValue > 3000) {
      stepSize = 500;
    } else if (maxValue > 1500) {
      stepSize = 250;
    } else if (maxValue > 1000) {
      stepSize = 200;
    } else if (maxValue > 500) {
      stepSize = 100;
    } else if (maxValue > 200) {
      stepSize = 75;
    } else {
      stepSize = 50;
    }

    // Final Y-axis max rounded to next step
    const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
    const tickCount = Math.max(5, yAxisMax / stepSize);

    
  const chartOptions = {
    chart: {
      height: 350,
      type: "bar" as const,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: { position: "top" },
        horizontal: false,
        columnWidth,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories,
      position: "bottom",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: 0,
        style: {
          fontSize: "11px",
          whiteSpace: "nowrap",
          overflow: "visible",
        },
        trim: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    // yaxis: {
    //   min: 0,
    //   max: yAxisMax, // ✅ Use dynamic max
    //   axisBorder: { show: false },
    //   axisTicks: { show: false },
    //   labels: {
    //     show: true,
    //     formatter: (val: number) => `${val}`,
    //   },
    // },

    yaxis: {
      min: 0,
      max: yAxisMax,
      tickAmount: tickCount,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        formatter: (val: number) => `${val}`,
      },
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val} Applicants`,
      },
    },
    grid: {
      padding: {
        bottom: 40,
      },
    },
  };

  const series = [{ name: "Applicants", data: dataSeries }];

  return loading ? (
    <Skeleton height={350} width="100%" />
  ) : (
    <div>
      {/* Sticky Title */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
          paddingBottom: "4px",
        }}
      >
        <h5 style={{ marginLeft: "10px", color: "#212B26" }}>
          Applicants by {isCity ? "City" : "State"}
        </h5>
      </div>

      {/* Scrollable Container with Styled Scrollbar */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: "0",
        }}
        className="custom-scroll"
      >
        <div style={{ width: containerWidth }}>
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Scrollbar styling */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f0f0f0;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #26a0fc;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #26a0fc;
        }
      `}</style>
    </div>
  );
};

export default ColumnChart;
