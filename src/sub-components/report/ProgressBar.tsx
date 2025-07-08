// import React, { useEffect, useState } from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { getTotalApplicants } from "api/dashboardApi";
// import { ProgressBar } from "react-bootstrap";

// interface ProgressBarsProps {
//   value: any;
//   colour: string;
//   label: string;
//   loading: boolean;
// }

// const ProgressBars: React.FC<ProgressBarsProps> = ({
//   value,
//   colour,
//   label,
//   loading,
// }) => {
//   const [percentage, setPercentage] = useState(0);
//   const [totalApplicants, setTotalApplicants] = useState(0);

//   useEffect(() => {
//     fetchTotalApplicants();
//   }, []);

//   const fetchTotalApplicants = async () => {
//     try {
//       const data = await getTotalApplicants();

//       setTotalApplicants(data.data.totalApplicants);
//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//     }
//   };

//   useEffect(() => {
//     setPercentage(value);
//   }, [percentage, value, loading]);

//   return (
//     <div className="w-3/4 h-2 mx-2 my-2 rounded-lg bg-light">
//       {loading ? (
//         <div className="mt-n1">
//           <Skeleton width="100%" />
//         </div>
//       ) : (
//         <>
//           <ProgressBar
//             now={percentage}
//             max={totalApplicants}
//             variant={colour}
//             className="!h-[10px] hover:cursor-pointer"
//           />
//           <div className="justify-between mt-1 d-flex">
//             <div className="justify-start">{label}</div>
//             <div className="justify-end">{percentage}</div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProgressBars;

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getTotalApplicants } from "api/dashboardApi";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ Uncomment if you want to navigate on click
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
  const navigate = useNavigate(); // ✅ Uncomment if using react-router

  useEffect(() => {
    fetchTotalApplicants();
  }, []);

  const fetchTotalApplicants = async () => {
    try {
      const data = await getTotalApplicants();
      setTotalApplicants(data.data.totalApplicants);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    setPercentage(value);
  }, [value]);

  const handleClick = () => {
    console.log("Clicked progress bar:", label);
    navigate(`/applicants?progress=${label}`);
  };

  return (
    <div className="w-3/4 h-2 mx-2 my-2 rounded-lg bg-light">
      {loading ? (
        <div className="mt-n1">
          <Skeleton width="100%" />
        </div>
      ) : (
        <>
          <div onClick={handleClick} className="hover:cursor-pointer">
            <ProgressBar
              now={percentage}
              max={totalApplicants}
              variant={colour}
              className="!h-[10px]"
            />
          </div>
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
