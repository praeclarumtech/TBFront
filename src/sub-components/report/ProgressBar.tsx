//

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ProgressBarProps {
  value: any;
  colour: string;
  lebel: string;
  loading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colour,
  lebel,
  loading,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!loading && value !== null && percentage < value) {
      const timer = setTimeout(() => setPercentage(percentage + 1), 10);
      return () => clearTimeout(timer);
    }
  }, [percentage, value, loading]);

  return (
    <div className="h-2 w-3/4 bg-light rounded-lg mx-2 my-2">
      {loading ? (
        <Skeleton width="100%" />
      ) : (
        <>
          <div
            className={`flex h-full rounded transition-all ease-in-out duration-300 ${colour} hover:shadow-2xl hover:brightness-125 hover:scale-105`}
            style={{ width: `${percentage}%` }}
          ></div>
          <div className="d-flex justify-between mt-1">
            <div className="justify-start">{lebel}</div>
            <div className="justify-end">{percentage}%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressBar;
