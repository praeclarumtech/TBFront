
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
}

const BarChart = ({ onBarClick }: BarChartProps) => {
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

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false, text: "Technology Applicants Statistics" },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#000000" } },
      y: { grid: { display: false }, ticks: { color: "#000000" } },
    },
    backgroundColor: "#9e9e9e"
  };

  // const generateColors = (count: number) =>
  //   Array.from(
  //     { length: count },
  //     () =>
  //       `#${Math.floor(Math.random() * 16777215)
  //         .toString(16)
  //         .padStart(6, "0")}`
  //   );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Skills",
        data: dataValues,
        borderColor: "#000000",
        // backgroundColor: generateColors(dataValues.length),
        backgroundColor: [
          "#d40000",
          "#FCE903",
          "#ffcc00",
          "#9b2242",
          "#00bcd4",
          "#6a0dad",
          "#0000FF",
          "#27ae60",
          "#004225",
          "#a40000",
        ],
        fill: true,
      },
    ],
  };

  const formatClickedLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      "NodeJs": "Node.js",
      "ReactJs": "React",
      "VueJs": "Vue.js",
      "NextJs": "Next.js",
      "ExpressJs": "Express.js",
    };
  
    return labelMap[label] || label;
  };
  
  const handleChartClick = (event: any) => {
    if (!chartRef.current) return; // Prevents errors if ref is null
  
    const elements = getElementAtEvent(chartRef.current, event);
    if (elements.length > 0) {
      const index = elements[0].index;
      let selectedLabel = labels[index]; // Get clicked bar label
  
      // Capitalize the first letter
      selectedLabel =
        selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1);
  
      selectedLabel = selectedLabel.replace(/\s+/g, "");
  
      // Apply custom formatting for specific technologies
      selectedLabel = formatClickedLabel(selectedLabel);
  
      console.log("Clicked Technology:", selectedLabel);
      onBarClick(selectedLabel); // Pass formatted label
    }
  };
  // Create a reference for the chart
  const chartRef = useRef<any>(null);

  return (
    <div className="w-full min-h-[390px] flex justify-center items-center ">
      {isLoading ? (
        <Skeleton width="500px" height="350px" />
      ) : Object.keys(applicantsDetail).length > 0 ? (
        <Bar
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

export default BarChart;
