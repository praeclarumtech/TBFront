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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin for data labels

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels // Register the plugin for data labels
);

interface BarChartProps {
  onBarClick: (label: string) => void;
  selectedFilter: Record<string, number>; // assuming object like { JavaScript: 20, Python: 15 }
  isloading: boolean;
}

const BarChart = ({ onBarClick, selectedFilter, isloading }: BarChartProps) => {
  const chartRef = useRef<any>(null);

  const labels = Object.keys(selectedFilter ?? {});
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
        barPercentage: 0.5, //  Smaller = more space between bars
        categoryPercentage: 0.5, //  Smaller = more space between groups
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
     layout: {
    padding: {
      top: 30, // Prevent label clipping at the top
    },
  },
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: { color: "#000000" },
      },
      title: { display: false },
      datalabels: {
        display: true,
        align: "top", // Position the data label at the top of the bar
        anchor: "end", // Place the label on the outer side of the bar
        padding: 5,
        color: "#000", // Set the label color to black for visibility
        font: {
          weight: "bold",
        },
        formatter: (value: number) => value.toString(), // Display the value of each bar
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#000000",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false, // ✅ disable automatic skipping
          callback: function (value) {
            const label = this.getLabelForValue(value as number);
            return label.length > 10 ? label.slice(0, 10) + "..." : label;
          },
        },
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
      FullStack: "Full Stack",
      NodeJs: "Node.js",
      ReactJs: "React",
      VueJs: "Vue.js",
      NextJs: "Next.js",
      ExpressJs: "Express.js",
      "Microsoft.NetFramework": "Microsoft.Net Framework",
      TailwindCSS: "Tailwind CSS",
      MaterialUI: "Material UI",
      MsSQLServer: "Ms SQL Server",
      UNITY3D: "UNITY 3D",
      UNITYEngine: "UNITY Engine",
      MySQLWorkbench: "MySQL Workbench",
      AzureDevOps: "Azure DevOps",
    };
    return labelMap[label] || label;
  };

  const handleChartClick = (event: any) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (elements.length > 0) {
      const index = elements[0].index;
      let selectedLabel = labels[index];
      selectedLabel = formatClickedLabel(selectedLabel);
      onBarClick(selectedLabel);
    }
  };

  return (
    <div className="w-full min-h-[571px] flex justify-center items-center">
      <div className="w-full h-[570px] overflow-x-scroll overflow-y-auto !scrollbar-visible overflow-scroll custom-scroll">
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
            <style>
              {`
                     .custom-scroll::-webkit-scrollbar {
                      height: 8px;
                     }
                    .custom-scroll::-webkit-scrollbar-track {
                    background: #f0f0f0;
                    }
                    .custom-scroll::-webkit-scrollbar-thumb {
                    background: gray;
                    border-radius: 4px;
                    }
                    .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: black;
                    }
              `}
            </style>
          </>
        )}
      </div>
    </div>
  );
};

export default BarChart;
