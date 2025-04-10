import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getTotalApplicants } from "api/dashboardApi";
import { ProgressBar } from "react-bootstrap";

interface ProgressBarsProps {
  value: any;
  colour: string;
  label: string;
  loading: boolean;
}

const ProgressBars: React.FC<ProgressBarsProps> = ({
  value,
  colour,
  label,
  loading,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);

  // const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    // setIsLoading(true);
    try {
      const data = await getTotalApplicants();

      setTotalApplicants(data.data.totalApplicants);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && value !== null && percentage < value) {
      const timer = setTimeout(() => setPercentage(percentage + 1), 30);
      return () => clearTimeout(timer);
    }
    // setPercentage(value)
  }, [percentage, value, loading]);

  // const range = (percentage / totalApplicants) * 100;

  return (
    <div className="h-2 w-3/4 bg-light rounded-lg mx-2 my-2">
      {loading ? (
        <div className="mt-n1">
          <Skeleton width="100%" />
        </div>
      ) : (
        <>
          {/* <div
            className={`flex h-full rounded transition-all ease-in-out duration-300 ${colour} hover:shadow-2xl hover:brightness-125 hover:scale-105`}
            style={{ width: `${range}%`, maxWidth: "100%" }}
          ></div> */}

          <ProgressBar
            now={percentage}
            max={totalApplicants}
            variant={colour}
            className="!h-[10px] hover:cursor-pointer"
          />
          <div className="d-flex justify-between mt-1">
            <div className="justify-start">{label}</div>
            <div className="justify-end">{percentage}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressBars;
