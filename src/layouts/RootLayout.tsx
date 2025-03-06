//import node module libraries
import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import Header from "components/navbars/topbar/Header";
import AppFooter from "layouts/footer/AppFooter";
import { ReactNode, useState } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <section className="bg-light min-vh-100 position-fixed w-100 top-0 left-0">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"} h-100`}>
        <div className="navbar-vertical navbar position-fixed top-0 bottom-0 border-end" style={{
          width: showMenu ? '256px' : '64px',
          transition: 'width .3s ease-in-out',
          zIndex: 1030
        }}>
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
        </div>
        <div id="page-content" style={{
          marginLeft: showMenu ? '256px' : '64px',
          transition: 'margin-left .3s ease-in-out'
        }}>
          <div className="header fixed-top bg-white border-bottom" style={{ 
            left: showMenu ? '256px' : '64px',
            right: 0,
            transition: 'left .3s ease-in-out',
            zIndex: 1020
          }}>
            <Header toggleMenu={ToggleMenu} />
          </div>
          <div className="content" style={{ 
            marginTop: '60px',
            marginBottom: '50px',
            padding: '20px',
            overflowY: 'auto',
            height: 'calc(100vh - 110px)'
          }}>
            <Outlet />
            {children}
          </div>
          <div className="footer fixed-bottom bg-white border-top" style={{ 
            left: showMenu ? '256px' : '64px',
            right: 0,
            transition: 'left .3s ease-in-out'
          }}>
            <AppFooter isSidebarOpen={showMenu} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RootLayout;
