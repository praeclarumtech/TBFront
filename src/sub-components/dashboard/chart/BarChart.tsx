import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
  BarElement,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getApplicantsDetails } from "api/dashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BarChartProps {
  onBarClick: (label: string) => void;
  selectedFilter: string;
}

const BarChart = ({ onBarClick, selectedFilter }: BarChartProps) => {
  const [applicantsDetail, setApplicantsDetail] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchApplicantsDetails();
  }, [selectedFilter]);

  const fetchApplicantsDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getApplicantsDetails(selectedFilter);
      if (response?.data?.skillCounts) {
        setApplicantsDetail(response?.data?.skillCounts);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants$/, "")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const labels = Object.keys(applicantsDetail).map((key) => formatLabel(key));
  const dataValues = Object.values(applicantsDetail);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffA500", // Change legend label color
        },
      },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#000000" } },
      y: { grid: { display: false }, ticks: { color: "#000000" } },
    },
    onHover: (event, chartElement) => {
      if (!event?.native) return; // Ensure event.native is not null

      const target = event.native.target as HTMLElement | null; // Type assertion to HTMLElement
      if (target) {
        target.style.cursor = chartElement.length > 0 ? "pointer" : "default";
      }
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Applicants",
        data: dataValues,
        borderColor: "#000000",
        backgroundColor: [
          "#d40000",
          "#ffa500",
          "#FCE903",
          "#004225",
          "#0000FF",
          "#4b369d",
          "#70369d",
          // "#00bcd4",
          // "#6a0dad",
          // "#a40000",
        ],
        fill: true,
        barThickness: 50, // Fixed width for bars
        maxBarThickness: 70,
        // categoryPercentage: 0.6, // Adjust space between categories (0.0 - 1.0)
        // barPercentage: 0.6, //
      },
    ],
  };

  const formatClickedLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      "C++": "C%2B%2B",
      "C#": "C%23",
      NodeJs: "Node.js",
      ReactJs: "React",
      VueJs: "Vue.js",
      NextJs: "Next.js",
      ExpressJs: "Express.js",
    };

    return labelMap[label] || label;
  };

  const handleChartClick = (event: any) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (elements.length > 0) {
      const index = elements[0].index;
      let selectedLabel = labels[index];

      selectedLabel = selectedLabel.replace(/\s+/g, "");

      selectedLabel = formatClickedLabel(selectedLabel);

      onBarClick(selectedLabel);
    }
  };

  const chartRef = useRef<any>(null);

  return (
    <div className="w-full min-h-[390px] flex justify-center items-center">
      {isLoading ? (
        <div className="min-h-[410px] w-full">
          <Skeleton className="min-h-[412px]" />
        </div>
      ) : Object.keys(applicantsDetail).length > 0 ? (
        <div className="w-full overflow-x-auto h-full">
          {/* Set min-width dynamically: Each bar gets ~50px, adjust as needed */}
          <div
            className="h-[410px] min-w-[800px]"
            style={{ minWidth: `${Math.max(labels.length * 70, 900)}px` }}
          >
            <Bar
              ref={chartRef}
              data={chartData}
              options={options}
              onClick={handleChartClick}
            />
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default BarChart;
