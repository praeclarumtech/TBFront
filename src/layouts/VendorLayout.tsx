import { Outlet, useSearchParams } from "react-router-dom";
import VendorHeader from "components/navbars/topbar/VendorHeader";

const VendorLayout = () => {
  const [searchParams] = useSearchParams();

  const isFromEmail = searchParams.get("source") === "email";

  return (
    <div className="flex flex-col min-h-screen">
      {!isFromEmail && <VendorHeader />}
      <div
        className={`flex-grow bg-light ${isFromEmail ? "p-0" : "p-6 pt-12"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
