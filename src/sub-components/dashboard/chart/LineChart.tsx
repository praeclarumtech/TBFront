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
} from "chart.js";
import { Line, getElementAtEvent } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getApplicantsDetails } from "api/dashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  onBarClick: (label: string) => void;
}

const LineChart = ({ onBarClick }: LineChartProps) => {
  const [applicantsDetail, setApplicantsDetail] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchApplicantsDetails();
  }, []);

  const fetchApplicantsDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getApplicantsDetails();
      if (response?.data) {
        setApplicantsDetail(response.data);
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

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        // labels: {
        //   color: "#ffA500", // Change legend label color
        // },
      },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#000000" } },
      y: { grid: { display: false }, ticks: { color: "#000000" } },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Applicants",
        data: dataValues,
        borderColor: "#0dcaf0",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
          gradient.addColorStop(0, "rgba(13, 202, 240, 0.8)"); // Full color at the start
          gradient.addColorStop(1, "rgba(13, 202, 240, 0)"); // Fully transparent at the end
          return gradient;
        },
        fill: true,
      },
    ],
  };

  const formatClickedLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      "C++": "C%2B%2B",
      "C#": "C%23",
      NodeJs: "Node.js",
      ReactJs: "React.Js",
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
    <div className="w-full min-h-[390px] flex justify-center items-center ">
      {isLoading ? (
        <div className="min-h-[410px] w-full">
          <Skeleton className="min-h-[412px]" />
        </div>
      ) : Object.keys(applicantsDetail).length > 0 ? (
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          onClick={handleChartClick}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default LineChart;
