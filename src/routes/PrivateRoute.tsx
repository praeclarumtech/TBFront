import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/commonFunctions";
// import AutoLogout from "../components/AutoLogout";
import routes from "./routes";
import AutoLogout from "hooks/useAutoLogout";

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

  return (
    <>
      <AutoLogout />
      <Component />
    </>
  );
};

export default PrivateRoute;