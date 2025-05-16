import { Fragment, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getStatusOfApplication } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

const Charts = () => {
  const [statusOfApplication, setStatusOfApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getStatusOfApplication();
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

  const labels = Object.keys(statusOfApplication).map(formatLabel);
  const values = Object.values(statusOfApplication);

  const colors = ["#660099", "#d40000", "#0000FF", "#004225", "#FCE903"];

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: "60%",
        distributed: true,
      },
    },
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
          fontWeight: "bold", // ✅ Bold y-axis labels ("Hold", "Pending", etc.)
        },
      },
    },
    colors: colors,
    legend: {
      show: true,
      fontSize: "12px",
      // fontWeight: 700,
      labels: {
        colors: "#000",
      },
      markers: {
        size: 7, // overall size of the marker
        shape: "circle", // try this to round marker if supported
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
