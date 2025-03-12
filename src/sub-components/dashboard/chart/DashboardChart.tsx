import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  ChartOptions,
  Filler,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bar } from "react-chartjs-2";
import { Col, Row, Card } from "react-bootstrap";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const DashboardChart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "Filterd Applicants",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#004225" },
        border: { color: "#004225" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#d40000" },
        border: { color: "#d40000" },
      },
    },
  };

  const chartData = {
    labels: ["Node", "React", "Vue", "C++", "C#"], // ✅ Corrected
    datasets: [
      {
        label: "Skills",
        data: [10, 15, 20, 25, 30],
        backgroundColor: [
          "rgba(236, 7, 66, 0.7)",
          "rgba(0, 66, 37, 0.7)",
          "rgba(0, 123, 255, 0.7)",
          "rgba(255, 193, 7, 0.7)",
          "rgba(40, 167, 69, 0.7)",
        ],
        borderColor: [
          "rgba(236, 7, 66, 0)",
          "rgba(0, 66, 37, 0)",
          "rgba(0, 123, 255, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(40, 167, 69, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Row className="mt-6">
        {/* mt-6*/}
        <Col>
          <Card className="min-h-[490px]">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <div className="h4">Skills Statistics</div>
              {/* <div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-primary"
                    id="dropdown-basic"
                  >
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/react">React JS</Dropdown.Item>
                    <Dropdown.Item href="#/node">Node JS</Dropdown.Item>
                    <Dropdown.Item href="#/mern">MERN Stack</Dropdown.Item>
                    <Dropdown.Item href="#/vue">Vue JS</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
            </Card.Header>
            <Card.Body className="d-flex justify-content-center items-center">
              <div className="w-full h-full min-h-[350px] flex justify-center items-center">
                <Bar data={chartData} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardChart;
