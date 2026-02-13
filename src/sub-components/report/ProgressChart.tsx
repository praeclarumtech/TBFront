import { Fragment, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { getTotalApplicants } from "api/dashboardApi";

const Charts = () => {
  const [statusOfApplication, setStatusOfApplication] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getTotalApplicants();
      setStatusOfApplication(data.data || {});
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

  const filteredEntries = Object.entries(statusOfApplication).filter(
    ([key]) => key !== "totalApplicants"
  );

  const chartData = filteredEntries.map(([key, value]) => ({
    name: formatLabel(key),
    y: value,
  }));

  const chartJsColors = [
    "#FF6384",
    "#9966FF",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#FF9F40",
    "#00A950",
  ];

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
      height: 350,
      inverted: true,
    },
    title: { text: undefined },
    xAxis: {
      categories: chartData.map((d) => d.name),
      labels: {
        style: { fontSize: "12px", fontWeight: "bold", color: "#000" },
      },
    },
    yAxis: {
      min: 0,
      title: { text: undefined },
      labels: {
        style: { fontSize: "12px", fontWeight: "bold", color: "#000" },
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter: function () {
        const point = this.point as Highcharts.Point;
        return `
          <div style="padding:10px 15px; background:white; border-radius:8px; box-shadow:0px 4px 12px rgba(0,0,0,0.1); font-family:Arial, sans-serif;">
            <div style="font-weight:600; color:#4B5563; font-size:14px; margin-bottom:5px;">${point.name}</div>
            <div style="display:flex; align-items:center;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${point.color}; margin-right:8px;"></span>
              <span style="color:#111827; font-weight:600;">Applications:</span>
              <span style="margin-left:5px; font-weight:700;">${point.y}</span>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      bar: {
        colorByPoint: true,
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: { fontSize: "12px", fontWeight: "bold", color: "#000" },
        },
        point: {
          events: {
            click: function () {
              let formattedLabel = String(this.category).toLowerCase();
              if (formattedLabel === "short listed") {
                formattedLabel = "shortlisted";
              }
              navigate(
                `/applicants?applicantStatusChart=${encodeURIComponent(
                  formattedLabel
                )}`
              );
            },
          },
        },
      } as Highcharts.PlotBarOptions,
    },
    colors: chartJsColors,
    series: [
      {
        type: "bar",
        name: "Applications",
        data: chartData,
      },
    ],
  };

  return (
    <Fragment>
      <div className="relative !w-full">
        {isLoading ? (
          <Skeleton height={300} />
        ) : (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
