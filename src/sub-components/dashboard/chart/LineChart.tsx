import  { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartjS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getApplicantsDetails } from "api/dashboardApi";

ChartjS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = () => {
  const [applicantsdetail, setApplicantsDetail] = useState([]);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicantsDetails();
  }, []);

  const fetchApplicantsDetails = async () => {
    try {
      const data = await getApplicantsDetails();
      console.log("data inside", data);
      setApplicantsDetail(data.data);
    } catch (error) {
      // setError("Failed to load applicants");
      console.error("API Error:", error);
    }
  };
  console.log(applicantsdetail);
  console.log(applicantsdetail);

  const lineChartData = {
    labels: ["da1", "day2"],
    datasets: [
      {
        label: "Applicants",
        data: ["100", "150"],
        borderColor: "#6610f2",
        backgroundColor: "rgba(102, 16, 242, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const op = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6610f2" },
        border: { color: "#6610f2" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#6610f2" },
        border: { color: "#6610f2" },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={lineChartData} options={op} />
    </div>
  );
};

export default LineChart;
