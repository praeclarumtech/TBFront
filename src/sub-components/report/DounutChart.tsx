import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getSkillStatistics } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom plugin to render text in the center
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart: any) => {
    const { width, height, ctx } = chart;
    ctx.save();

    const text = "Technology wise\nApplicants"; // Add a line break for better formatting
    const fontSize = Math.min(width / 18, height / 9, 18);

    ctx.font = `600 ${fontSize}px Arial`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000"; // Slightly darker for better visibility

    const textX = width / 2;
    const textY = height / 2 - fontSize * 0.6;

    const lines = text.split("\n");
    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        textX,
        textY + (index - (lines.length - 1) / 2) * fontSize * 1.2
      );
    });

    ctx.restore();
  },
};

const DounutChart = () => {
  const [skillStatistics, setSkillStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSkillStatistics();
  }, []);

  const fetchSkillStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await getSkillStatistics();
      setSkillStatistics(data.data);
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
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  };

  const labels = Object.keys(skillStatistics).map((key) => formatLabel(key));
  const dataValues = Object.values(skillStatistics);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Applicants",
        data: dataValues,
        backgroundColor: [
          "#d40000",
          "#660099",
          "#ffcc00",
          "#9b2242",
          "#660099",
          "#0000FF",
          "#27ae60",
          "#004225",
          "#FCE903",
        ],
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "65%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          boxWidth: 10,
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full h-[350px]">
      {isLoading ? (
        <div>
          <Skeleton height={300} width={300} borderRadius="50%" />
          <Skeleton height={20} width={300} />
        </div>
      ) : (
        <div className="w-full h-[350px] flex items-center justify-center">
          <Doughnut
            data={data}
            options={options}
            plugins={[centerTextPlugin]}
          />
        </div>
      )}
    </div>
  );
};

export default DounutChart;
