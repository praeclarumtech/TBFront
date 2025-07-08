import { Outlet } from "react-router-dom";
import VendorHeader from "components/navbars/topbar/VendorHeader";

const VendorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <VendorHeader />
      <div className="flex-grow p-6 pt-12 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
