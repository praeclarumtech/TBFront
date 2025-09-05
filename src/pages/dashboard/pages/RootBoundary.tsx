import appConstants from "constants/constant";
import { useRouteError } from "react-router-dom";
import { Col } from "reactstrap";

const { projectTitle } = appConstants;
const RootBoundary = () => {
  document.title = projectTitle;
  const error = useRouteError();
  console.error("error boundary", error);

  return (
    <Col className="w-screen h-screen bg-white">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-yellow-600">Warning</h2>
          <h3 className="mt-2 text-lg">Oops Something went wrong.</h3>
          <p className="mt-1 text-gray-600">
            Please refresh this page or try again later.
          </p>
        </div>
      </div>
    </Col>
  );
};

export default RootBoundary;
