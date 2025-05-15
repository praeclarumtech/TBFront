
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getCityState } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

type Props = {
  selectedFilter: string;
};

type ChartData = Record<string, number>;

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
      const data = response?.data as ChartData;

      const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
      const sortedCategories = sortedEntries.map(([key]) => key);
      const sortedDataSeries = sortedEntries.map(([, value]) => value);

      setCategories(sortedCategories);
      setDataSeries(sortedDataSeries);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCity = selectedFilter === "city";
  const columnWidth = isCity ? "40%" : "55%";
  const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

  const maxValue = Math.max(...dataSeries, 0);

  let stepSize = 50;
  if (maxValue > 3000) stepSize = 500;
  else if (maxValue > 1500) stepSize = 250;
  else if (maxValue > 1000) stepSize = 200;
  else if (maxValue > 500) stepSize = 100;
  else if (maxValue > 200) stepSize = 75;
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
        formatter: (val: string) =>
          val.length > 5 ? val.slice(0, 5) + "..." : val,
      },
      tooltip: {
        enabled: true,
      },
    },
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
      custom: ({ series, seriesIndex, dataPointIndex }: any) => {
        const fullLabel = categories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return `<div style="padding: 8px;color:#212B36;">
              <strong style="color:#624BFF; ">${fullLabel}</strong><br />
              ${value} Applicants
            </div>`;
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
          position: "static",
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
