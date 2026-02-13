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
  // isMobile: <=576px only - sidebar overlays. Tablet/desktop: content pushes.
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [showMenu, setShowMenu] = useState(window.innerWidth > 576);

  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    let prevMobile = window.innerWidth <= 576;
    const handleResize = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);
      if (prevMobile !== mobile) {
        setShowMenu(!mobile);
      }
      prevMobile = mobile;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // When sidebar overlay is open on mobile: lock body scroll so only sidebar scrolls
  useEffect(() => {
    const sidebarOverlayOpen = isMobile && showMenu;
    if (sidebarOverlayOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [showMenu, isMobile]);

  // <=576px: overlay (content stays). >576px: push (content shifts when sidebar open).
  const sidebarMargin = isMobile ? "0" : showMenu ? "250px" : "0";

  const contentShiftStyle = {
    marginLeft: sidebarMargin,
    transition: "margin-left 0.3s ease",
  };

  // When sidebar is open on mobile (overlay), prevent main content from scrolling
  const sidebarOverlayOpen = isMobile && showMenu;

  return (
    <section className={`bg-light root-layout-fixed ${sidebarOverlayOpen ? "sidebar-overlay-open" : ""}`}>
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
        <div className="navbar-vertical navbar">
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} isMobile={isMobile} />
        </div>
        <div id="page-content" className="page-content-scroll">
          <div
            className="header fixed-top header-dark"
            style={{ ...contentShiftStyle, zIndex: 1060 }}
          >
            <Header toggleMenu={ToggleMenu} showMenu={showMenu} isMobile={isMobile} />
          </div>

          <div
            className="content content-below-header"
            style={{
              marginBottom: isMobile ? "56px" : "34px",
              overflowX: "hidden",
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
        style={contentShiftStyle}
      >
        <AppFooter isSidebarOpen={showMenu} />
      </div>
    </section>
  );
};

export default RootLayout;
