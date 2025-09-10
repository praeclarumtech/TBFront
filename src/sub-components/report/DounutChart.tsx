import { Fragment, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { getRoleWiseReport } from "api/reportApi";

const Charts = () => {
  const [roleData, setRoleData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    setIsLoading(true);
    try {
      const data = await getRoleWiseReport();
      setRoleData(data.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const labels = Object.keys(roleData).map((key) => formatLabel(key));
  const values = Object.values(roleData) as number[];

  const chartJsColors = [
    "#FF6384",
    "#9966FF",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#FF9F40",
    "#00A950",
  ];

  const chartData = labels.map((label, index) => ({
    name: label,
    y: values[index],
    color: chartJsColors[index % chartJsColors.length],
  }));

  const doughnutOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b><br/>Count: <b>{point.y}</b><br/>Percentage: <b>{point.percentage:.1f}%</b>",
      style: {
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
      },
      backgroundColor: "white",
      borderColor: "#ccc",
      borderRadius: 8,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "30%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.y}",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#000",
          },
          distance: 20,
        },
        showInLegend: true,
        point: {
          events: {
            click: function (event) {
              const clickedLabel = event.point.name;
              if (clickedLabel) {
                navigate(
                  `/userManagement?role=${encodeURIComponent(
                    clickedLabel.toLowerCase()
                  )}`
                );
              }
            },
          },
        },
      },
    },
    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      itemStyle: {
        fontSize: "12px",
        color: "#000",
        fontWeight: "normal",
      },
      symbolRadius: 7,
      symbolHeight: 14,
      symbolWidth: 14,
    },
    series: [
      {
        type: "pie",
        name: "Roles",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <Fragment>
      <div className="relative !w-full">
        {isLoading ? (
          <Skeleton height={400} />
        ) : (
          <HighchartsReact highcharts={Highcharts} options={doughnutOptions} />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
