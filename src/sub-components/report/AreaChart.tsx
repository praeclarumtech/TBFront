import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { getApplication } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define TypeScript Interface for Application Data
interface ApplicationData {
  date: string;
  week: number;
  month: number;
}

const StackedAreaChart = () => {
  const [application, setApplication] = useState<ApplicationData[]>([]);
  const [selectedTime, setSelectedTime] = useState("month");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchStatusOfApplication(selectedTime);
  }, [selectedTime]);

  const fetchStatusOfApplication = async (cType: string) => {
    setIsLoading(true);
    try {
      const response = await getApplication(cType);
      if (Array.isArray(response.data)) {
        setApplication(response.data);
      } else if (
        typeof response.data === "object" &&
        response.data.totalApplications
      ) {
        setApplication([
          {
            date: new Date().toISOString().split("T")[0], // Today's date
            week: response.data.totalApplications ?? 0, // Assign totalApplications to week
            month: response.data.totalApplications ?? 0, // Assign totalApplications to month
          },
        ]);
      } else {
        setApplication([]); // If no valid data, set empty array
      }
    } catch (error) {
      console.error("API Error:", error);
      setApplication([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabelClick = (time: string) => {
    setSelectedTime(time);
  };

  // const labels = application.map((app) => app.date);
  const labels = ["jan","fab", "march"]
  const weekData = application.map((app) => app.week);
  const monthData = application.map((app) => app.month);

  const data = {
    labels,
    datasets: [
      {
        label: "Week",
        data: selectedTime === "week" ? weekData : [],
        backgroundColor: "rgba(0, 0, 212)",
        borderColor: "rgba(0, 0, 212)",
        fill: true,
      },
      {
        label: "Month",
        data: selectedTime === "month" ? monthData : [],
        backgroundColor: "rgba(212, 0, 0)",
        borderColor: "rgba(212, 0, 0)",
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        onClick: (_e, legendItem) =>
          handleLabelClick(legendItem.text.toLowerCase()),
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {isLoading ? (
        <Skeleton height={300} width={500} />
      ) : (
        <div style={{ height: "300px", width: "100%" }}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default StackedAreaChart;
