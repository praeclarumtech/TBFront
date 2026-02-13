import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getCityState } from "api/reportApi";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedFilter: string;
};

type ChartData = Record<string, number>;

const ColumnChart = ({ selectedFilter }: Props) => {
  const [dataSeries, setDataSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
  const containerWidth = Math.max(categories.length * (isCity ? 60 : 90), 600);

  const maxValue = Math.max(...dataSeries, 0);
  let stepSize = 50;
  if (maxValue > 3000) stepSize = 500;
  else if (maxValue > 1500) stepSize = 250;
  else if (maxValue > 1000) stepSize = 200;
  else if (maxValue > 500) stepSize = 100;
  else if (maxValue > 200) stepSize = 75;
  const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;

  const chartData = categories.map((cat, i) => ({
    name: cat,
    y: dataSeries[i] ?? 0,
  }));

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 350,
    },
    title: { text: undefined },
    xAxis: {
      categories,
      labels: {
        style: { fontSize: "11px", color: "#000" },
        formatter: function () {
          const val = String(this.value);
          return val.length > 5 ? val.slice(0, 5) + "..." : val;
        },
      },
    },
    yAxis: {
      min: 0,
      max: yAxisMax,
      title: { text: undefined },
      labels: {
        style: { color: "#000" },
        formatter: function () {
          return String(this.value);
        },
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter: function () {
        const point = this.point as Highcharts.Point;
        return `<div style="padding: 8px;color:#212B36;">
              <strong style="color:#624BFF;">${point.name}</strong><br />
              ${point.y} Applicants
            </div>`;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 10,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: { fontSize: "12px", fontWeight: "bold", color: "#304758" },
        },
        pointWidth: isCity ? 40 : 55,
        point: {
          events: {
            click: function () {
              const clickedLabel = String(this.category);
              navigate(
                `/applicants?filter=${encodeURIComponent(
                  clickedLabel
                )}&type=${selectedFilter}`
              );
            },
          },
        },
      } as Highcharts.PlotColumnOptions,
    },
    series: [
      {
        type: "column",
        name: "Applicants",
        data: chartData,
      },
    ],
  };

  return loading ? (
    <Skeleton height={350} width="100%" />
  ) : (
    <div>
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

      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: "0",
        }}
        className="custom-scroll"
      >
        <div style={{ width: containerWidth }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>

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
