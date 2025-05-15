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

  // Reverse margin logic on small screens
  const sidebarMargin = isMobile
    ? showMenu
      ? "0" // on mobile: menu open → no margin
      : "250px" // on mobile: menu closed → push content
    : showMenu
    ? "250px" // on desktop: menu open → margin
    : "0"; // on desktop: menu closed → no margin

  const contentShiftStyle = {
    marginLeft: sidebarMargin,
    transition: "margin-left 0.3s ease",
  };

  return (
    <section className="bg-light">
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
            className="content"
            style={{
              // ...contentShiftStyle,
              marginTop: "66px",
              marginBottom: "50px",
              paddingBottom: "20px",
              overflow: "auto",
              overflowY: "auto",
              // height: "calc(100vh - 104px)",
              right: 0,
              zIndex: 10,
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
