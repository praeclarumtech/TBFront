import { useEffect, useState } from "react";
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
import { Line } from "react-chartjs-2";

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

import { getApplicantsDetails } from "api/dashboardApi";

const LineChart = () => {
  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants$/, "") // Removes Applicants From end
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^./, (str: string) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const [applicantsDetail, setApplicantsDetail] = useState({});

  useEffect(() => {
    fetchApplicantsDetails();
  }, []);

  const fetchApplicantsDetails = async () => {
    try {
      const response = await getApplicantsDetails();
      // console.log("data inside", response);
      setApplicantsDetail(response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const labels = Object.keys(applicantsDetail).map((key) => formatLabel(key));
  const dataValues = Object.values(applicantsDetail);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "Technology Applicants Statistics",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#0000FF" },
        border: { color: "#0000FF" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#0000FF" },
        border: { color: "#0000FF" },
      },
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Skills",
        data: dataValues,
        borderColor: "#0000FF",
        backgroundColor: "rgba(135, 206, 235)",
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full h-full min-h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
