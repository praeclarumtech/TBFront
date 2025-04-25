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

  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    try {
      const data = await getTotalApplicants();

      setTotalApplicants(data.data.totalApplicants);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
    }
  };

  useEffect(() => {
    // if (!loading && value !== null && percentage < value) {
    //   const timer = setTimeout(() => setPercentage(percentage + 1), 10);
    //   return () => clearTimeout(timer);
    // }
    setPercentage(value);
  }, [percentage, value, loading]);

  // const range = (percentage / totalApplicants) * 100;

  return (
    <div className="w-3/4 h-2 mx-2 my-2 rounded-lg bg-light">
      {loading ? (
        <div className="mt-n1">
          <Skeleton width="100%" />
        </div>
      ) : (
        <>
          <ProgressBar
            now={percentage}
            max={totalApplicants}
            variant={colour}
            className="!h-[10px] hover:cursor-pointer"
          />
          <div className="justify-between mt-1 d-flex">
            <div className="justify-start">{label}</div>
            <div className="justify-end">{percentage}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressBars;
