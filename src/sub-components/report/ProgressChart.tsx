import React, { Fragment, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getStatusOfApplication } from "api/reportApi";
import Skeleton from "react-loading-skeleton";

const Charts = () => {
  const [statusOfApplication, setStatusOfApplication] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchStatusOfApplication();
  }, []);

  const fetchStatusOfApplication = async () => {
    setIsLoading(true);
    try {
      const data = await getStatusOfApplication();
      setStatusOfApplication(data.data);
      console.log("progrs",data);
    } catch (error) {
      // setError("Failed to load applicants");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dataValues = Object.values(statusOfApplication);

  const perfomanceChartSeries = dataValues;
  const perfomanceChartOptions: ApexOptions = {
    labels: Object.keys(statusOfApplication),
    colors: ["#28a745", "#17a2b8", "#E4A11B", "#dc3545"],
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 270,
        hollow: {
          size: "40%",
        },
        track: {
          background: "transparent",
        },
        dataLabels: {
          name: { show: true },
          value: { show: true },
        },
      },
    },
    chart: { type: "radialBar" },
    stroke: { lineCap: "round" },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200,
          },
        },
      },
      {
        breakpoint: 5000,
        options: {
          chart: {
            height: 220,
          },
        },
      },
    ],
  };

  return (
    <Fragment>
      <div className="relative flex flex-col items-center  h-50">
        {isLoading ? (
          <Skeleton height={200} width={200} borderRadius="50%"/>
        ) : (
          <Chart
            options={perfomanceChartOptions}
            series={perfomanceChartSeries}
            type="radialBar"
            width="100%"
          />
        )}
      </div>
    </Fragment>
  );
};

export default Charts;
