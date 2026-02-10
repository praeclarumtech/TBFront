import { Outlet, useSearchParams } from "react-router-dom";
import VendorHeader from "components/navbars/topbar/VendorHeader";

const VendorLayout = () => {
  const [searchParams] = useSearchParams();

  const isFromEmail = searchParams.get("source") === "email";

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full">
      {!isFromEmail && <VendorHeader />}
      <div
        className={`flex-grow bg-light overflow-x-hidden ${isFromEmail ? "p-0" : "p-4 p-md-6 pt-8 pt-md-12"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
