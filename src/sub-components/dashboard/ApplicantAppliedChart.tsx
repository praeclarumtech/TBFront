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
import { Bar } from "react-chartjs-2";
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

const BAR_COLORS = [
  "#36A2EB",
  "#4BC0C0",
  "#FFCE56",
  "#FF9F40",
  "#9966FF",
  "#C9CBCF",
  "#FF6384",
];

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
        backgroundColor: labels.map(
          (_, index) => BAR_COLORS[index % BAR_COLORS.length],
        ),
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
    // Click anywhere in a column (not only on the short bar)
    interaction: {
      mode: "index",
      intersect: false,
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
      tooltip: {
        callbacks: {
          footer: () => "Click to view applicants",
        },
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

  const navigateToApplicants = (item: ApplicantAppliedChartItem) => {
    if (role !== "admin") {
      toast.error("You don't have permission to perform this action.");
      return;
    }

    const startDate = toDateParam(item.from);
    const endDate = toDateParam(item.to);
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    navigate(`/applicants?${params.toString()}`);
  };

  const handleChartClick = (event: any) => {
    const chart = chartRef.current;
    if (!chart) return;

    // Index mode + intersect:false → click near label / above short bar still works
    const elements = chart.getElementsAtEventForMode(
      event,
      "index",
      { intersect: false },
      true,
    );
    if (elements.length === 0) return;

    const item = data[elements[0].index];
    if (item) navigateToApplicants(item);
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

            {/* Easy click targets for short bars */}
            {!isLoading && data.length > 0 && (
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-3 pt-2 border-top">
                {data.map((item, index) => (
                  <button
                    key={item.key || item.label}
                    type="button"
                    className="btn btn-light border text-center px-3 py-2"
                    style={{ minWidth: 120, cursor: "pointer" }}
                    title={`View applicants: ${item.label}`}
                    onClick={() => navigateToApplicants(item)}
                  >
                    <div className="fw-bold text-dark">{item.count ?? 0}</div>
                    <div
                      className="mx-auto my-1 rounded"
                      style={{
                        height: 6,
                        width: 48,
                        backgroundColor:
                          BAR_COLORS[index % BAR_COLORS.length],
                      }}
                    />
                    <div className="small text-muted">{item.label}</div>
                  </button>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ApplicantAppliedChart;
