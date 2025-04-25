import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";

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
  selectedFilter: Record<string, number>; // assuming object like { JavaScript: 20, Python: 15 }
  isloading: boolean;
}

const BarChart = ({ onBarClick, selectedFilter, isloading }: BarChartProps) => {
  const chartRef = useRef<any>(null);

  const formatLabel = (text: string) =>
    text
      .replace(/Applicants$/, "")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const labels = Object.keys(selectedFilter ?? {}).map(formatLabel);
  const dataValues = Object.values(selectedFilter ?? {});

  const generateColors = (length: number) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const hue = (i * 137.508) % 360; // Using golden angle approximation
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Applicants",
        data: dataValues,
        borderColor: "#000000",
        backgroundColor: generateColors(dataValues.length),
        fill: true,
        barThickness: 50,
        maxBarThickness: 70,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#000000" },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#000000" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#000000" },
      },
    },
    onHover: (event, chartElement) => {
      const target = event?.native?.target as HTMLElement | null;
      if (target) {
        target.style.cursor = chartElement.length > 0 ? "pointer" : "default";
      }
    },
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
      selectedLabel = formatClickedLabel(selectedLabel.replace(/\s+/g, ""));
      onBarClick(selectedLabel);
    }
  };

  // if (isloading) {
  //   return (
  //     <div className="w-full h-[570px] flex justify-center items-center">
  //       <div className="h-[500px] w-[600px]">
  //         <Skeleton height="500px" width="600px" />
  //       </div>
  //     </div>
  //   );
  // }

  // if (!labels.length || !dataValues.length) {
  //   return (
  //     <div className="py-4 text-center">
  //       <b>No data available. Please Go and Select Skills to Show </b>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full min-h-[571px] flex justify-center items-center">
      <div className="w-full h-[570px] overflow-x-scroll overflow-y-auto !scrollbar-visible overflow-scroll">
        {isloading ? (
          <div>
            <Skeleton height="500px" width="100%" />
          </div>
        ) : (
          <>
            <div
              className="h-[530px] min-w-[800px]"
              style={{ minWidth: `${Math.max(labels.length * 70, 900)}px` }}
            >
              <Bar
                ref={chartRef}
                data={chartData}
                options={options}
                onClick={handleChartClick}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarChart;
