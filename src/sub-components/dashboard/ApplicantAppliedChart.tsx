import { useRef } from "react";
import { Card, Col, Row } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export interface ApplicantAppliedChartItem {
  key: string;
  label: string;
  count: number;
  from: string;
  to: string;
}

interface ApplicantAppliedChartProps {
  data: ApplicantAppliedChartItem[];
  isLoading: boolean;
}

/** Normalize API date values to YYYY-MM-DD for list filters / date inputs. */
const toDateParam = (value: string): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
};

const BAR_COLORS = ["#36A2EB", "#4BC0C0", "#FFCE56", "#FF9F40"];

const ApplicantAppliedChart = ({
  data,
  isLoading,
}: ApplicantAppliedChartProps) => {
  const chartRef = useRef<any>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const labels = data.map((item) => item.label);
  const counts = data.map((item) => item.count ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Applicants Applied",
        data: counts,
        backgroundColor: BAR_COLORS.slice(0, labels.length),
        borderColor: "#000000",
        borderWidth: 1,
        barThickness: 48,
        maxBarThickness: 64,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28 },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      datalabels: {
        display: true,
        align: "top",
        anchor: "end",
        color: "#000",
        font: { weight: "bold" },
        formatter: (value: number) => value.toString(),
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#000000" },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          color: "#000000",
          precision: 0,
        },
      },
    },
    onHover: (event, chartElement) => {
      const target = event?.native?.target as HTMLElement | null;
      if (target) {
        target.style.cursor = chartElement.length > 0 ? "pointer" : "default";
      }
    },
  };

  const handleChartClick = (event: any) => {
    if (!chartRef.current) return;

    const elements = getElementAtEvent(chartRef.current, event);
    if (elements.length === 0) return;

    if (role !== "admin") {
      toast.error("You don't have permission to perform this action.");
      return;
    }

    const index = elements[0].index;
    const item = data[index];
    if (!item) return;

    const startDate = toDateParam(item.from);
    const endDate = toDateParam(item.to);
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    navigate(`/applicants?${params.toString()}`);
  };

  return (
    <Row className="mt-6">
      <Col>
        <Card className="w-full">
          <Card.Header className="gap-2 p-4 bg-white border-0 d-flex justify-content-between align-items-center">
            <h4 className="h4 text-dark fw-bold mb-0">Applicants Applied</h4>
          </Card.Header>
          <Card.Body className="pt-0">
            <div className="w-full" style={{ height: 320 }}>
              {isLoading ? (
                <Skeleton height="300px" width="100%" />
              ) : data.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  No application data available
                </div>
              ) : (
                <Bar
                  ref={chartRef}
                  data={chartData}
                  options={options}
                  onClick={handleChartClick}
                />
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ApplicantAppliedChart;
