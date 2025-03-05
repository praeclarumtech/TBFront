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
  Filler
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

  const op: ChartOptions<"line"> = {
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

  // Define the dataset properly
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [10, 20, 30, 40, 50],
        borderColor: "#6610f2",
        backgroundColor: "rgba(102, 16, 242, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={lineChartData} options={op} />
    </div>
  );
};

export default LineChart;
