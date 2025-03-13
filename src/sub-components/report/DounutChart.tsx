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
      console.log(data);
    } catch (error) {
      // setError("Failed to load applicants");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants$/, "") // Removes Applicants From end
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^./, (str: string) => str.toUpperCase()) // Capitalize first letter
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
        <Skeleton height={300} width={300} borderRadius="50%" />
      ) : (
        <div className="w-full h-[350px] flex items-center justify-center">
          <Doughnut data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default DounutChart;
