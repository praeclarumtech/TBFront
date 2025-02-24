import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/commonFunctions";
import routes from "./routes";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate to={routes.ROOT.path} state={{ from: location }} replace />
    );
  }

  return <Component />;
};

export default PrivateRoute;
