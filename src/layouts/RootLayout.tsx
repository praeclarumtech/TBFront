
import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import Header from "components/navbars/topbar/Header";
import AppFooter from "layouts/footer/AppFooter";
import {  useState } from "react";
import { useMediaQuery } from "react-responsive";
import AutoLogout from "hooks/useAutoLogout";


interface RootLayoutProps {
  children?: React.ReactNode;
}
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <section className="top-0 left-0 bg-light min-vh-100 position-fixed w-100">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"} h-100`}>
        {/* Sidebar */}
        <div
          className={`navbar-vertical navbar position-fixed top-0 bottom-0 border-end-dark ${
            isMobile && !showMenu ? "d-block" : "d-block"
          }`}
          style={{
            width: isMobile
              ? showMenu
                ? "256px"
                : "256px"
              : showMenu
              ? "256px"
              : "64px",
            transition: " 0.5s ease-in-out",
            zIndex: 1030,
            overflowX: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
        </div>

        {/* Main Page Content */}
        <div
          id="page-content"
          style={{
            marginLeft: isMobile ? "0px" : showMenu ? "250px" : "0px",
            transition: " 0.5s ease-in-out",
          }}
        >
          {/* Header */}
          <div
            className="header fixed-top bg-dark border-bottom-dark"
            style={{
              left: isMobile
                ? showMenu
                  ? "0px"
                  : "250px"
                : showMenu
                ? "250px"
                : "0px",
              right: 0,
              transition: " 0.5s ease-in-out",
              zIndex: 1030,
            }}
          >
            <Header toggleMenu={ToggleMenu} />
          </div>
          <div
            className="content"
            style={{
              marginTop: "66px",
              marginBottom: "50px",
              paddingBottom: "20px",
              overflowY: "auto",
              height: "calc(100vh - 104px)",
              overflow:
                isMobile && !showMenu ? "hidden" : "auto",
              transition: " 0.5s ease-in-out",
            }}
          >
            {/* {isMobile && showMenu ? (
              <div>
                {" "}
                <Outlet />
                {children}{" "}
              </div>
            ) : (
              <div
                style={{
                  color: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {" "}
                
              </div>
            )} */}
            <AutoLogout />
            <Outlet />
            {children}
          </div>

          {/* Footer */}
          <div
            className="bg-white footer fixed-bottom border-top"
            style={{
              left: isMobile
                ? showMenu
                  ? "0px"
                  : "250px"
                : showMenu
                ? "250px"
                : "0px",
              right: 0,
              transition: " 0.5s ease-in-out",
              // zIndex: 1030,
            }}
          >
            <AppFooter isSidebarOpen={showMenu} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default RootLayout;
