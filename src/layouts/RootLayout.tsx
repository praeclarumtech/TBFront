import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import Header from "components/navbars/topbar/Header";
import AppFooter from "layouts/footer/AppFooter";
import { useState, useEffect } from "react";
import AutoLogout from "hooks/useAutoLogout";

interface RootLayoutProps {
  children?: React.ReactNode;
}
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767); // adjust breakpoint if needed

  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile: sidebar overlays, so content always full width (no margin).
  // On desktop: margin when menu open, no margin when closed.
  const sidebarMargin = isMobile
    ? "0" // iPhone/mobile: content always full width, sidebar overlays
    : showMenu
    ? "250px"
    : "0";

  const contentShiftStyle = {
    marginLeft: sidebarMargin,
    transition: "margin-left 0.3s ease",
  };

  return (
    <section className="bg-light overflow-x-hidden">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
        <div className="navbar-vertical navbar" style={{ zIndex: 10 }}>
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
        </div>
        <div id="page-content" className="overflow-auto">
          <div
            className="header fixed-top bg-dark border-bottom-dark"
            style={{ ...contentShiftStyle, zIndex: 10 }}
          >
            <Header toggleMenu={ToggleMenu} />
          </div>

          <div
            className="content content-below-header"
            style={{
              marginBottom: isMobile ? "56px" : "34px",
              overflow: "auto",
              overflowY: "auto",
              overflowX: "hidden",
              right: 0,
              zIndex: 10,
              maxWidth: "100%",
            }}
          >
            <AutoLogout />
            <Outlet />
            {children}
          </div>
        </div>
      </div>

      <div
        className="bg-white footer fixed-bottom border-top"
        style={{ ...contentShiftStyle, zIndex: 10 }}
      >
        <AppFooter isSidebarOpen={showMenu} />
      </div>
    </section>
  );
};

export default RootLayout;
