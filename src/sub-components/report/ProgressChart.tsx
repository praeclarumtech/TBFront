import { Fragment, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { getTotalApplicants } from "api/dashboardApi";

const Charts = () => {
  const [statusOfApplication, setStatusOfApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getTotalApplicants();
      setStatusOfApplication(data.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text
      .replace(/Applicants?/gi, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  // Filter out `totalApplicants`
  const filteredEntries = Object.entries(statusOfApplication).filter(
    ([key]) => key !== "totalApplicants"
  );

  const labels = filteredEntries.map(([key]) => formatLabel(key));
  const values = filteredEntries.map(([_, value]) => value);

  // Chart.js default colors:
  const chartJsColors = [
    "#FF6384", // red
    "#9966FF", // purple
    "#36A2EB", // blue
    "#FFCE56", // yellow
    "#4BC0C0", // teal
    "#FF9F40", // orange
    "#00A950", // green
  ];

  // Apply colors in sequence
  const colors = labels.map((_, index) => {
    return chartJsColors[index % chartJsColors.length];
  });

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
      events: {
        dataPointSelection: function (_event, _chartContext, config) {
          const dataPointIndex = config.dataPointIndex;
          const clickedLabel = labels[dataPointIndex];

          if (clickedLabel) {
            let formattedLabel = clickedLabel.toLowerCase();

            // Special cases
            if (formattedLabel === "short listed") {
              formattedLabel = "shortlisted";
            }
            navigate(
              `/applicants?applicantStatusChart=${encodeURIComponent(
                formattedLabel
              )}`
            );
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: "60%",
        distributed: true,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: true,
      offsetX: 25,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#000"],
      },
      formatter: function (val: number) {
        return val.toString();
      },
    },

    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const label = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const color = w.globals.colors[dataPointIndex];

        return `
          <div style="padding:10px 15px; background:white; border-radius:8px; box-shadow:0px 4px 12px rgba(0,0,0,0.1); font-family:Arial, sans-serif;">
            <div style="font-weight:600; color:#4B5563; font-size:14px; margin-bottom:5px;">${label}</div>
            <div style="display:flex; align-items:center;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color}; margin-right:8px;"></span>
              <span style="color:#111827; font-weight:600;">Applications:</span>
              <span style="margin-left:5px; font-weight:700;">${value}</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      fontSize: "12px",
      labels: {
        colors: "#000",
      },
      markers: {
        size: 7,
        shape: "circle",
      },
    },
  };

  return (
    <Fragment>
      <style>
        {`
          .apexcharts-legend-marker {
            border-radius: 50%!important;
          }
        `}
      </style>
      <div className="relative !w-full">
        {isLoading ? (
          <Skeleton height={300} />
        ) : (
          <Chart
            options={barChartOptions}
            series={[{ name: "Applications", data: values as number[] }]}
            type="bar"
            height={350}
          />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
